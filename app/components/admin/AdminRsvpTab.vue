<script setup lang="ts">
import type { RsvpRow } from '~~/server/db/schema'

type RsvpWithBook = RsvpRow & { giftBookTitle: string | null }

function partnerName(r: RsvpWithBook) {
  if (!r.withPartner) return '—'
  return `${r.partnerFirstName ?? ''} ${r.partnerLastName ?? ''}`.trim() || 'Так'
}

interface RsvpResponse {
  summary: { total: number, attending: number, declined: number, children: number }
  rsvps: RsvpWithBook[]
}

const { data, pending, refresh } = await useFetch<RsvpResponse>('/api/admin/rsvps')

const deletingId = ref<number | null>(null)
async function remove(r: RsvpWithBook) {
  const who = `${r.firstName} ${r.lastName}`.trim()
  const bookNote = r.giftBookTitle
    ? `\n\nБронь на книгу «${r.giftBookTitle}» буде звільнена.`
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

    <div v-else class="overflow-x-auto rounded-xl border border-olive-200 bg-ivory">
      <table class="w-full min-w-[720px] text-left text-sm">
        <thead class="border-b border-olive-200 text-xs tracking-wide text-cocoa uppercase">
          <tr>
            <th class="px-4 py-3">Гість</th>
            <th class="px-4 py-3">Присутність</th>
            <th class="px-4 py-3">Друга половинка</th>
            <th class="px-4 py-3">Діти</th>
            <th class="px-4 py-3">Тост</th>
            <th class="px-4 py-3">Алергії / харчування</th>
            <th class="px-4 py-3">Книга</th>
            <th class="px-4 py-3">Коментар</th>
            <th class="px-4 py-3">Дата</th>
            <th class="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="r in data.rsvps"
            :key="r.id"
            class="border-b border-olive-100 last:border-0"
          >
            <td class="px-4 py-3 font-medium">{{ r.firstName }} {{ r.lastName }}</td>
            <td class="px-4 py-3">
              <span
                class="rounded-full px-2.5 py-1 text-xs"
                :class="r.attending ? 'bg-olive-100 text-olive-700' : 'bg-blush/40 text-espresso'"
              >
                {{ r.attending ? 'Буде' : 'Не буде' }}
              </span>
            </td>
            <td class="px-4 py-3 text-cocoa">{{ partnerName(r) }}</td>
            <td class="px-4 py-3">{{ r.withChildren ? r.childrenCount : '—' }}</td>
            <td class="px-4 py-3">{{ r.attending ? (r.wantsToast ? 'Так' : 'Ні') : '—' }}</td>
            <td class="px-4 py-3 text-cocoa">{{ r.allergies || '—' }}</td>
            <td class="px-4 py-3 text-cocoa">{{ r.giftBookTitle || '—' }}</td>
            <td class="px-4 py-3 text-cocoa">{{ r.comment || '—' }}</td>
            <td class="px-4 py-3 whitespace-nowrap text-cocoa">{{ formatDate(r.createdAt) }}</td>
            <td class="px-4 py-3 text-right">
              <button
                class="rounded-full border border-blush px-3 py-1.5 text-xs text-espresso transition hover:bg-blush/30 disabled:opacity-50"
                :disabled="deletingId === r.id"
                @click="remove(r)"
              >
                {{ deletingId === r.id ? '…' : 'Видалити' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
