<script setup lang="ts">
import type { RsvpInput } from '#shared/types'

const route = useRoute()
const { content, guest } = useSite()
const rsvp = computed(() => content.value.rsvp)

// Wishlist books the guest can choose to gift.
const { available, hasBooks, load: loadBooks } = useBooks()
onMounted(() => loadBooks())

// Deadline handling — form closes after the deadline day.
const closed = computed(() => {
  if (!rsvp.value.deadline) return false
  const end = new Date(`${rsvp.value.deadline}T23:59:59`)
  return Date.now() > end.getTime()
})

// A couple invitation pre-fills the partner from the guest link.
const knownPartner = computed(() => !!guest.value?.partnerFirstName)

const form = reactive({
  firstName: guest.value?.firstName ?? '',
  lastName: guest.value?.lastName ?? '',
  attending: null as boolean | null,
  withChildren: false,
  childrenCount: 1,
  wantsToast: null as boolean | null,
  allergies: '',
  withPartner: knownPartner.value as boolean,
  partnerFirstName: guest.value?.partnerFirstName ?? '',
  partnerLastName: guest.value?.partnerLastName ?? '',
  giftBook: null as boolean | null,
  giftBookIds: [] as number[],
  comment: '',
})

const errors = reactive<Record<string, string>>({})
const status = ref<'idle' | 'submitting' | 'success' | 'error'>('idle')
const errorMessage = ref('')

// Reset the chosen books if the guest switches away from "yes".
watch(() => form.giftBook, (wants) => {
  if (!wants) form.giftBookIds = []
})

function validate(): boolean {
  errors.firstName = form.firstName.trim() ? '' : "Вкажіть, будь ласка, імʼя"
  errors.lastName = form.lastName.trim() ? '' : 'Вкажіть, будь ласка, прізвище'
  errors.attending = form.attending === null ? 'Оберіть один з варіантів' : ''
  errors.giftBookIds
    = form.giftBook === true && !form.giftBookIds.length
      ? 'Оберіть хоча б одну книгу зі списку'
      : ''
  errors.partnerFirstName
    = form.attending === true && form.withPartner && !form.partnerFirstName.trim()
      ? 'Вкажіть імʼя другої половинки'
      : ''
  return (
    !errors.firstName && !errors.lastName && !errors.attending
    && !errors.giftBookIds && !errors.partnerFirstName
  )
}

async function submit() {
  if (!validate()) return
  status.value = 'submitting'
  errorMessage.value = ''

  const payload: RsvpInput = {
    guestToken: (route.query.guest as string) || undefined,
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    attending: form.attending as boolean,
    withChildren: form.attending ? form.withChildren : false,
    childrenCount: form.attending && form.withChildren ? form.childrenCount : 0,
    wantsToast: form.attending ? form.wantsToast === true : false,
    allergies: form.allergies.trim() || undefined,
    withPartner: form.attending ? form.withPartner : false,
    partnerFirstName: form.attending && form.withPartner ? form.partnerFirstName.trim() : undefined,
    partnerLastName: form.attending && form.withPartner ? form.partnerLastName.trim() || undefined : undefined,
    comment: form.comment.trim() || undefined,
    giftBookIds: form.giftBook === true ? form.giftBookIds : [],
  }

  try {
    await $fetch('/api/rsvp', { method: 'POST', body: payload })
    // Keep the shared wishlist in sync so the chosen book is now marked taken.
    await loadBooks(true)
    status.value = 'success'
  }
  catch (err: unknown) {
    const e = err as { statusCode?: number, data?: { data?: { code?: string } } }
    if (e?.statusCode === 409 || e?.data?.data?.code === 'BOOK_TAKEN') {
      // Someone grabbed one of these books first — refresh and ask to re-pick.
      await loadBooks(true)
      form.giftBookIds = form.giftBookIds.filter(id =>
        available.value.some(b => b.id === id),
      )
      errorMessage.value
        = 'На жаль, одну з обраних книг щойно взяв хтось інший. Будь ласка, перевірте список і оберіть знову.'
    }
    else {
      errorMessage.value
        = 'Не вдалося надіслати. Спробуйте ще раз або звʼяжіться з координатором.'
    }
    status.value = 'error'
  }
}
</script>

<template>
  <SectionShell id="rsvp" tint narrow>
    <SectionHeader
      eyebrow="Ваша відповідь"
      title="Підтвердьте присутність"
    />

    <p v-if="rsvp.deadlineLabel && !closed" class="mt-4 text-center font-sans text-sm text-olive-600">
      Будь ласка, підтвердьте свою присутність {{ rsvp.deadlineLabel }}.
    </p>

    <!-- Closed -->
    <RevealOnScroll v-if="closed" class="mt-12">
      <div class="rounded-xl border border-olive-200 bg-ivory p-10 text-center">
        <Icon name="ph:envelope-simple" class="mx-auto h-10 w-10 text-olive-400" />
        <p class="mt-4 font-serif text-xl text-espresso">{{ rsvp.closedMessage }}</p>
      </div>
    </RevealOnScroll>

    <!-- Success -->
    <RevealOnScroll v-else-if="status === 'success'" class="mt-12">
      <div class="rounded-xl border border-olive-200 bg-ivory p-10 text-center">
        <Icon name="ph:check-circle" class="mx-auto h-12 w-12 text-olive-500" />
        <h3 class="mt-4 font-serif text-2xl text-espresso">Дякуємо за відповідь!</h3>
        <p class="mt-3 font-sans text-cocoa">
          {{ form.attending
            ? 'Ми дуже раді, що ви будете з нами цього дня 🤍'
            : 'Шкода, що не вийде. Дякуємо, що дали знати 🤍' }}
        </p>
      </div>
    </RevealOnScroll>

    <!-- Form -->
    <RevealOnScroll v-else class="mt-12">
      <form class="grid gap-5" novalidate @submit.prevent="submit">
        <div class="grid gap-5 sm:grid-cols-2">
          <div>
            <label for="firstName" class="field-label">Імʼя</label>
            <input
              id="firstName"
              v-model="form.firstName"
              class="field-input"
              :aria-invalid="!!errors.firstName"
              autocomplete="given-name"
            >
            <p v-if="errors.firstName" class="field-error">{{ errors.firstName }}</p>
          </div>
          <div>
            <label for="lastName" class="field-label">Прізвище</label>
            <input
              id="lastName"
              v-model="form.lastName"
              class="field-input"
              :aria-invalid="!!errors.lastName"
              autocomplete="family-name"
            >
            <p v-if="errors.lastName" class="field-error">{{ errors.lastName }}</p>
          </div>
        </div>

        <fieldset>
          <legend class="field-label">Чи будете присутні?</legend>
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              class="rounded-lg border px-4 py-3 font-sans text-sm transition"
              :class="form.attending === true
                ? 'border-olive-500 bg-olive-100 text-olive-700'
                : 'border-olive-200 bg-ivory/60 text-cocoa hover:border-olive-300'"
              @click="form.attending = true"
            >
              <Icon name="ph:check" class="mr-1 inline h-4 w-4" />
              Так, я буду
            </button>
            <button
              type="button"
              class="rounded-lg border px-4 py-3 font-sans text-sm transition"
              :class="form.attending === false
                ? 'border-olive-500 bg-olive-100 text-olive-700'
                : 'border-olive-200 bg-ivory/60 text-cocoa hover:border-olive-300'"
              @click="form.attending = false"
            >
              <Icon name="ph:x" class="mr-1 inline h-4 w-4" />
              На жаль, ні
            </button>
          </div>
          <p v-if="errors.attending" class="field-error">{{ errors.attending }}</p>
        </fieldset>

        <!-- Extra fields only when attending -->
        <Transition name="expand">
          <div v-if="form.attending" class="grid gap-5">
            <!-- Partner / plus-one -->
            <div>
              <div class="flex items-center gap-3">
                <input
                  id="withPartner"
                  v-model="form.withPartner"
                  type="checkbox"
                  class="h-4 w-4 accent-olive-600"
                >
                <label for="withPartner" class="font-sans text-sm text-cocoa">
                  {{ knownPartner ? 'Будемо разом із другою половинкою' : 'Буду з другою половинкою' }}
                </label>
              </div>

              <div v-if="form.withPartner" class="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <label for="partnerFirstName" class="field-label">Імʼя другої половинки</label>
                  <input
                    id="partnerFirstName"
                    v-model="form.partnerFirstName"
                    class="field-input"
                    :aria-invalid="!!errors.partnerFirstName"
                    autocomplete="off"
                  >
                  <p v-if="errors.partnerFirstName" class="field-error">{{ errors.partnerFirstName }}</p>
                </div>
                <div>
                  <label for="partnerLastName" class="field-label">Прізвище другої половинки</label>
                  <input
                    id="partnerLastName"
                    v-model="form.partnerLastName"
                    class="field-input"
                    autocomplete="off"
                  >
                </div>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <input
                id="withChildren"
                v-model="form.withChildren"
                type="checkbox"
                class="h-4 w-4 accent-olive-600"
              >
              <label for="withChildren" class="font-sans text-sm text-cocoa">
                Буду з дітьми
              </label>
            </div>

            <div v-if="form.withChildren">
              <label for="childrenCount" class="field-label">Кількість дітей</label>
              <input
                id="childrenCount"
                v-model.number="form.childrenCount"
                type="number"
                min="1"
                max="10"
                class="field-input max-w-32"
              >
            </div>

            <div>
              <label for="allergies" class="field-label">Алергії або особливості харчування</label>
              <input
                id="allergies"
                v-model="form.allergies"
                class="field-input"
                placeholder="Наприклад: без лактози, вегетаріанство…"
              >
            </div>

            <fieldset>
              <legend class="field-label">
                Чи хотіли б ви сказати кілька теплих слів або виголосити тост у мікрофон під час святкування?
              </legend>
              <div class="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  class="rounded-lg border px-4 py-3 font-sans text-sm transition"
                  :class="form.wantsToast === true
                    ? 'border-olive-500 bg-olive-100 text-olive-700'
                    : 'border-olive-200 bg-ivory/60 text-cocoa hover:border-olive-300'"
                  @click="form.wantsToast = true"
                >
                  Так
                </button>
                <button
                  type="button"
                  class="rounded-lg border px-4 py-3 font-sans text-sm transition"
                  :class="form.wantsToast === false
                    ? 'border-olive-500 bg-olive-100 text-olive-700'
                    : 'border-olive-200 bg-ivory/60 text-cocoa hover:border-olive-300'"
                  @click="form.wantsToast = false"
                >
                  Ні
                </button>
              </div>
            </fieldset>
          </div>
        </Transition>

        <!-- Gift a book from the wishlist -->
        <fieldset v-if="hasBooks">
          <legend class="field-label">
            {{ rsvp.giftQuestion }}
          </legend>
          <p v-if="rsvp.giftHint" class="mb-3 text-sm text-cocoa">
            {{ rsvp.giftHint }}
          </p>
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              class="rounded-lg border px-4 py-3 font-sans text-sm transition"
              :class="form.giftBook === true
                ? 'border-olive-500 bg-olive-100 text-olive-700'
                : 'border-olive-200 bg-ivory/60 text-cocoa hover:border-olive-300'"
              @click="form.giftBook = true"
            >
              <Icon name="ph:book-open" class="mr-1 inline h-4 w-4" />
              Так, оберу книгу
            </button>
            <button
              type="button"
              class="rounded-lg border px-4 py-3 font-sans text-sm transition"
              :class="form.giftBook === false
                ? 'border-olive-500 bg-olive-100 text-olive-700'
                : 'border-olive-200 bg-ivory/60 text-cocoa hover:border-olive-300'"
              @click="form.giftBook = false"
            >
              <Icon name="ph:x" class="mr-1 inline h-4 w-4" />
              На жаль, ні
            </button>
          </div>

          <Transition name="expand">
            <div v-if="form.giftBook === true" class="mt-4">
              <label class="field-label">Оберіть книги</label>
              <BookSelect
                v-model="form.giftBookIds"
                multiple
                :options="available"
                placeholder="Оберіть книги зі списку…"
              />
              <p v-if="errors.giftBookIds" class="field-error">{{ errors.giftBookIds }}</p>
              <p v-else class="mt-2 text-xs text-cocoa">
                Можна обрати одразу декілька книг. У списку лише вільні книги —
                після надсилання форми обрані книги стануть недоступними для інших гостей.
              </p>
            </div>
          </Transition>
        </fieldset>

        <div>
          <label for="comment" class="field-label">Коментар (за бажанням)</label>
          <textarea
            id="comment"
            v-model="form.comment"
            rows="3"
            class="field-input resize-none"
            placeholder="Побажання, запитання чи щось приємне…"
          />
        </div>

        <p v-if="status === 'error'" class="field-error text-center">
          {{ errorMessage }}
        </p>

        <AppButton type="submit" :disabled="status === 'submitting'" block class="mt-2">
          <Icon v-if="status === 'submitting'" name="ph:spinner" class="h-4 w-4 animate-spin" />
          {{ status === 'submitting' ? 'Надсилаємо…' : 'Надіслати відповідь' }}
        </AppButton>
      </form>
    </RevealOnScroll>
  </SectionShell>
</template>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: opacity 0.3s var(--ease-soft);
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
}
</style>
