<script setup lang="ts">
import type { GuestRow } from '~~/server/db/schema'

const { data: guests, pending, refresh } = await useFetch<GuestRow[]>(
  '/api/admin/guests',
)

const origin = ref('')
onMounted(() => {
  origin.value = window.location.origin
})

function guestLink(token: string) {
  return `${origin.value}/?guest=${token}`
}

const copiedId = ref<number | null>(null)
async function copyLink(guest: GuestRow) {
  await navigator.clipboard.writeText(guestLink(guest.token))
  copiedId.value = guest.id
  setTimeout(() => (copiedId.value = null), 1500)
}

// Create form
const draft = reactive({
  firstName: '',
  lastName: '',
  invitedToCeremony: false,
  isCouple: false,
  partnerFirstName: '',
  partnerLastName: '',
  note: '',
})
const creating = ref(false)

function resetDraft() {
  Object.assign(draft, {
    firstName: '',
    lastName: '',
    invitedToCeremony: false,
    isCouple: false,
    partnerFirstName: '',
    partnerLastName: '',
    note: '',
  })
}

async function create() {
  if (!draft.firstName.trim() || !draft.lastName.trim()) return
  creating.value = true
  try {
    await $fetch('/api/admin/guests', {
      method: 'POST',
      body: {
        firstName: draft.firstName,
        lastName: draft.lastName,
        invitedToCeremony: draft.invitedToCeremony,
        note: draft.note,
        partnerFirstName: draft.isCouple ? draft.partnerFirstName : '',
        partnerLastName: draft.isCouple ? draft.partnerLastName : '',
      },
    })
    resetDraft()
    await refresh()
  }
  finally {
    creating.value = false
  }
}

async function toggleCeremony(guest: GuestRow) {
  await $fetch(`/api/admin/guests/${guest.id}`, {
    method: 'PATCH',
    body: { invitedToCeremony: !guest.invitedToCeremony },
  })
  await refresh()
}

async function remove(guest: GuestRow) {
  if (!confirm(`Видалити гостя ${guest.firstName} ${guest.lastName}?`)) return
  await $fetch(`/api/admin/guests/${guest.id}`, { method: 'DELETE' })
  await refresh()
}
</script>

<template>
  <div>
    <h2 class="mb-6 font-serif text-2xl">Гості та персональні запрошення</h2>

    <!-- Create -->
    <form
      class="mb-8 grid gap-4 rounded-xl border border-olive-200 bg-ivory p-5"
      @submit.prevent="create"
    >
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AdminField v-model="draft.firstName" label="Імʼя" placeholder="Ірина" />
        <AdminField v-model="draft.lastName" label="Прізвище" placeholder="Коваль" />
        <AdminField v-model="draft.note" label="Примітка (не показується гостю)" placeholder="Напр. родичі" />
      </div>

      <label class="flex items-center gap-2 text-sm text-cocoa">
        <input v-model="draft.isCouple" type="checkbox" class="h-4 w-4 accent-olive-600">
        Запрошення для двох (з другою половинкою)
      </label>

      <div v-if="draft.isCouple" class="grid gap-4 rounded-lg bg-olive-50 p-4 sm:grid-cols-2">
        <AdminField v-model="draft.partnerFirstName" label="Імʼя другої половинки" placeholder="Андрій" />
        <AdminField v-model="draft.partnerLastName" label="Прізвище другої половинки" placeholder="Коваль" />
      </div>

      <div class="flex flex-wrap items-center justify-between gap-3">
        <label class="flex items-center gap-2 text-sm text-cocoa">
          <input v-model="draft.invitedToCeremony" type="checkbox" class="h-4 w-4 accent-olive-600">
          Запрошений(-і) на церемонію
        </label>
        <AppButton type="submit" :disabled="creating">
          <Icon name="ph:plus" class="h-4 w-4" />
          Додати {{ draft.isCouple ? 'пару' : 'гостя' }}
        </AppButton>
      </div>
    </form>

    <div v-if="pending" class="py-16 text-center text-cocoa">Завантаження…</div>

    <div v-else-if="!guests?.length" class="rounded-xl border border-dashed border-olive-300 py-16 text-center text-cocoa">
      Ще немає доданих гостей. Створіть першого — і згенерується персональне посилання.
    </div>

    <ul v-else class="grid gap-3">
      <li
        v-for="g in guests"
        :key="g.id"
        class="flex flex-col gap-3 rounded-xl border border-olive-200 bg-ivory p-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div class="min-w-0">
          <p class="font-medium">
            {{ g.firstName }} {{ g.lastName }}
            <span
              v-if="g.partnerFirstName"
              class="ml-1 text-cocoa"
            >&amp; {{ g.partnerFirstName }} {{ g.partnerLastName }}</span>
            <span
              v-if="g.partnerFirstName"
              class="ml-2 rounded-full bg-blush/40 px-2 py-0.5 text-xs text-espresso"
            >пара</span>
            <span
              v-if="g.invitedToCeremony"
              class="ml-2 rounded-full bg-olive-100 px-2 py-0.5 text-xs text-olive-700"
            >церемонія</span>
          </p>
          <p v-if="g.note" class="text-xs text-cocoa">{{ g.note }}</p>
          <p class="mt-1 truncate font-mono text-xs text-cocoa/80">{{ guestLink(g.token) }}</p>
        </div>

        <div class="flex shrink-0 flex-wrap items-center gap-2">
          <button
            class="rounded-full border border-olive-300 px-3 py-1.5 text-xs text-olive-700 transition hover:bg-olive-100"
            @click="copyLink(g)"
          >
            {{ copiedId === g.id ? 'Скопійовано ✓' : 'Копіювати лінк' }}
          </button>
          <button
            class="rounded-full border border-olive-300 px-3 py-1.5 text-xs text-olive-700 transition hover:bg-olive-100"
            @click="toggleCeremony(g)"
          >
            {{ g.invitedToCeremony ? 'Прибрати церемонію' : 'Додати церемонію' }}
          </button>
          <button
            class="rounded-full border border-blush px-3 py-1.5 text-xs text-espresso transition hover:bg-blush/30"
            @click="remove(g)"
          >
            Видалити
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>
