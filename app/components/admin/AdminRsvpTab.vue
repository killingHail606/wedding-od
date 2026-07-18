<script setup lang="ts">
import type { RsvpRow } from '~~/server/db/schema'

type RsvpWithBook = Omit<RsvpRow, 'giftBookId'> & { giftBooks: string[] }

function partnerName(r: RsvpWithBook) {
  if (!r.withPartner) return '—'
  return `${r.partnerFirstName ?? ''} ${r.partnerLastName ?? ''}`.trim() || 'Так'
}

/** Only the detail fields that actually have a value, for a tidy card. */
function details(r: RsvpWithBook): { label: string, value: string }[] {
  const items: { label: string, value: string }[] = []
  if (r.withPartner) items.push({ label: 'Друга половинка', value: partnerName(r) })
  if (r.attending && r.withChildren) {
    items.push({ label: 'Діти', value: String(r.childrenCount) })
  }
  if (r.attending && r.wantsToast) items.push({ label: 'Тост', value: 'Так' })
  if (r.allergies) items.push({ label: 'Алергії / харчування', value: r.allergies })
  return items
}

interface RsvpResponse {
  summary: { total: number, attending: number, declined: number, children: number }
  rsvps: RsvpWithBook[]
}

const { data, pending, refresh } = await useFetch<RsvpResponse>('/api/admin/rsvps')

const deletingId = ref<number | null>(null)
async function remove(r: RsvpWithBook) {
  const who = `${r.firstName} ${r.lastName}`.trim()
  const bookNote = r.giftBooks.length
    ? `\n\nБронь на книги (${r.giftBooks.join(', ')}) буде звільнена.`
    : ''
  if (!confirm(`Видалити відповідь від ${who}?${bookNote}`)) return
  deletingId.value = r.id
  try {
    await $fetch(`/api/admin/rsvps/${r.id}`, { method: 'DELETE' })
    await refresh()
  }
  finally {
    deletingId.value = null
  }
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso.includes('T') ? iso : `${iso.replace(' ', 'T')}Z`))
}

const stats = computed(() => [
  { label: 'Усього відповідей', value: data.value?.summary.total ?? 0, icon: 'ph:list-checks' },
  { label: 'Прийдуть', value: data.value?.summary.attending ?? 0, icon: 'ph:check-circle' },
  { label: 'Не зможуть', value: data.value?.summary.declined ?? 0, icon: 'ph:x-circle' },
  { label: 'Дітей', value: data.value?.summary.children ?? 0, icon: 'ph:baby' },
])
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h2 class="font-serif text-2xl">Підтвердження присутності</h2>
      <div class="flex gap-2">
        <button
          class="rounded-full border border-olive-300 px-4 py-1.5 text-sm text-olive-700 transition hover:bg-olive-100"
          @click="refresh()"
        >
          Оновити
        </button>
        <a
          href="/api/admin/rsvps/export"
          class="rounded-full bg-olive-600 px-4 py-1.5 text-sm text-ivory transition hover:bg-olive-700"
        >
          Експорт CSV
        </a>
      </div>
    </div>

    <!-- Summary -->
    <div class="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div
        v-for="s in stats"
        :key="s.label"
        class="rounded-xl border border-olive-200 bg-ivory p-5"
      >
        <Icon :name="s.icon" class="h-5 w-5 text-olive-500" />
        <p class="mt-2 font-serif text-3xl">{{ s.value }}</p>
        <p class="text-xs tracking-wide text-cocoa">{{ s.label }}</p>
      </div>
    </div>

    <div v-if="pending" class="py-16 text-center text-cocoa">Завантаження…</div>

    <div v-else-if="!data?.rsvps.length" class="rounded-xl border border-dashed border-olive-300 py-16 text-center text-cocoa">
      Поки що немає жодної відповіді.
    </div>

    <div v-else class="grid gap-3">
      <article
        v-for="r in data.rsvps"
        :key="r.id"
        class="rounded-xl border border-olive-200 bg-ivory p-4 sm:p-5"
      >
        <!-- Header: name + status + date + delete -->
        <header class="flex flex-wrap items-start justify-between gap-3">
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <h3 class="font-serif text-lg leading-tight text-espresso">
                {{ r.firstName }} {{ r.lastName }}
              </h3>
              <span
                class="rounded-full px-2.5 py-0.5 text-xs"
                :class="r.attending ? 'bg-olive-100 text-olive-700' : 'bg-blush/40 text-espresso'"
              >
                {{ r.attending ? 'Буде' : 'Не буде' }}
              </span>
            </div>
            <p class="mt-1 text-xs text-cocoa/80">{{ formatDate(r.createdAt) }}</p>
          </div>

          <button
            class="shrink-0 rounded-full border border-blush px-3 py-1.5 text-xs text-espresso transition hover:bg-blush/30 disabled:opacity-50"
            :disabled="deletingId === r.id"
            @click="remove(r)"
          >
            {{ deletingId === r.id ? '…' : 'Видалити' }}
          </button>
        </header>

        <!-- Detail fields (only those with a value) -->
        <dl
          v-if="details(r).length"
          class="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          <div v-for="d in details(r)" :key="d.label">
            <dt class="text-xs tracking-wide text-cocoa/70 uppercase">{{ d.label }}</dt>
            <dd class="mt-0.5 text-sm text-espresso">{{ d.value }}</dd>
          </div>
        </dl>

        <!-- Books as chips -->
        <div v-if="r.giftBooks.length" class="mt-4">
          <p class="text-xs tracking-wide text-cocoa/70 uppercase">
            Книги у подарунок · {{ r.giftBooks.length }}
          </p>
          <ul class="mt-1.5 flex flex-wrap gap-1.5">
            <li
              v-for="(title, i) in r.giftBooks"
              :key="i"
              class="inline-flex items-center gap-1.5 rounded-full border border-olive-200 bg-cream/50 px-3 py-1 text-xs text-espresso"
            >
              <Icon name="ph:book" class="h-3.5 w-3.5 text-olive-500" />
              {{ title }}
            </li>
          </ul>
        </div>

        <!-- Comment -->
        <div v-if="r.comment" class="mt-4 rounded-lg bg-olive-50 px-3 py-2">
          <p class="text-xs tracking-wide text-cocoa/70 uppercase">Коментар</p>
          <p class="mt-0.5 text-sm whitespace-pre-line text-espresso">{{ r.comment }}</p>
        </div>
      </article>
    </div>
  </div>
</template>
