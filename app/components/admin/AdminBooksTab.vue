<script setup lang="ts">
import type { AdminBook } from '~~/server/api/admin/books/index.get'

const { data: books, pending, refresh } = await useFetch<AdminBook[]>(
  '/api/admin/books',
)

const draft = reactive({ title: '', author: '', imageUrl: '', url: '', note: '' })
const creating = ref(false)

async function create() {
  if (!draft.title.trim()) return
  creating.value = true
  try {
    await $fetch('/api/admin/books', { method: 'POST', body: { ...draft } })
    Object.assign(draft, { title: '', author: '', imageUrl: '', url: '', note: '' })
    await refresh()
  }
  finally {
    creating.value = false
  }
}

async function remove(book: AdminBook) {
  const warn = book.reservedBy
    ? `Книгу «${book.title}» вже обрав(-ла) ${book.reservedBy}. Все одно видалити?`
    : `Видалити книгу «${book.title}»?`
  if (!confirm(warn)) return
  await $fetch(`/api/admin/books/${book.id}`, { method: 'DELETE' })
  await refresh()
}

const availableCount = computed(
  () => books.value?.filter(b => !b.reservedBy).length ?? 0,
)
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h2 class="font-serif text-2xl">Вішліст книг</h2>
      <button
        class="rounded-full border border-olive-300 px-4 py-1.5 text-sm text-olive-700 transition hover:bg-olive-100"
        @click="refresh()"
      >
        Оновити
      </button>
    </div>

    <p class="mb-6 text-sm text-cocoa">
      Книги, які гості можуть обрати як подарунок. Коли гість обирає книгу у формі
      RSVP, вона стає недоступною для інших.
    </p>

    <!-- Create -->
    <form
      class="mb-8 grid gap-4 rounded-xl border border-olive-200 bg-ivory p-5 sm:grid-cols-2"
      @submit.prevent="create"
    >
      <AdminField v-model="draft.title" label="Назва книги" placeholder="Майстер і Маргарита" />
      <AdminField v-model="draft.author" label="Автор (за бажанням)" placeholder="Михайло Булгаков" />
      <AdminField v-model="draft.url" label="Посилання (за бажанням)" placeholder="https://…" />
      <AdminField v-model="draft.imageUrl" label="Обкладинка — URL (за бажанням)" placeholder="https://…/cover.jpg" />
      <div class="sm:col-span-2">
        <AdminField v-model="draft.note" label="Примітка (за бажанням)" placeholder="Напр. видання у твердій обкладинці" />
      </div>
      <div class="sm:col-span-2">
        <AppButton type="submit" :disabled="creating">
          <Icon name="ph:plus" class="h-4 w-4" />
          Додати книгу
        </AppButton>
      </div>
    </form>

    <div v-if="pending" class="py-16 text-center text-cocoa">Завантаження…</div>

    <div v-else-if="!books?.length" class="rounded-xl border border-dashed border-olive-300 py-16 text-center text-cocoa">
      Ще немає жодної книги. Додайте першу — і вона зʼявиться у списку для гостей.
    </div>

    <template v-else>
      <p class="mb-4 text-sm text-cocoa">
        Усього: <b>{{ books.length }}</b> · Доступно: <b>{{ availableCount }}</b> ·
        Обрано: <b>{{ books.length - availableCount }}</b>
      </p>

      <ul class="grid gap-3">
        <li
          v-for="b in books"
          :key="b.id"
          class="flex flex-col gap-3 rounded-xl border border-olive-200 bg-ivory p-4 sm:flex-row sm:items-center sm:justify-between"
          :class="b.reservedBy ? 'opacity-70' : ''"
        >
          <div class="flex min-w-0 items-center gap-4">
            <div class="h-16 w-12 shrink-0 overflow-hidden rounded border border-olive-200 bg-olive-50">
              <img
                v-if="b.imageUrl"
                :src="b.imageUrl"
                :alt="b.title"
                class="h-full w-full object-cover"
              >
              <div v-else class="flex h-full w-full items-center justify-center">
                <Icon name="ph:book" class="h-5 w-5 text-olive-400" />
              </div>
            </div>
            <div class="min-w-0">
              <p class="font-medium">
                {{ b.title }}
                <span
                  v-if="b.reservedBy"
                  class="ml-2 rounded-full bg-blush/40 px-2 py-0.5 text-xs text-espresso"
                >обрано</span>
              </p>
              <p v-if="b.author" class="text-sm text-cocoa">{{ b.author }}</p>
              <p v-if="b.note" class="text-xs text-cocoa/80">{{ b.note }}</p>
              <p v-if="b.reservedBy" class="mt-1 text-xs text-olive-700">
                Обрав(-ла): {{ b.reservedBy }}
              </p>
              <a
                v-if="b.url"
                :href="b.url"
                target="_blank"
                rel="noopener noreferrer"
                class="mt-1 inline-flex items-center gap-1 text-xs text-olive-600 hover:text-olive-700"
              >
                <Icon name="ph:link" class="h-3.5 w-3.5" />
                Посилання
              </a>
            </div>
          </div>

          <div class="flex shrink-0 items-center gap-2">
            <button
              class="rounded-full border border-blush px-3 py-1.5 text-xs text-espresso transition hover:bg-blush/30"
              @click="remove(b)"
            >
              Видалити
            </button>
          </div>
        </li>
      </ul>
    </template>
  </div>
</template>
