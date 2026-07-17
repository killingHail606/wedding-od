<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const { books, available, pending, load } = useBooks()

// Load (and refresh) whenever the popup opens, so status is always current.
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) load(true)
  },
)

const takenCount = computed(() => books.value.length - available.value.length)

onKeyStroke('Escape', () => props.open && emit('close'))

// Lock body scroll while open.
watch(
  () => props.open,
  (isOpen) => {
    if (import.meta.client) {
      document.body.style.overflow = isOpen ? 'hidden' : ''
    }
  },
)
onUnmounted(() => {
  if (import.meta.client) document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="books-modal">
      <div
        v-if="open"
        class="fixed inset-0 z-[100] flex items-end justify-center bg-espresso/60 backdrop-blur-sm sm:items-center"
        role="dialog"
        aria-modal="true"
        aria-label="Список книг"
        @click.self="emit('close')"
      >
        <div
          class="flex max-h-[90svh] w-full max-w-2xl flex-col rounded-t-2xl bg-ivory shadow-2xl sm:rounded-2xl"
        >
          <!-- Header -->
          <div class="flex items-start justify-between gap-4 border-b border-olive-200 px-6 py-5">
            <div>
              <p class="eyebrow">Наша бібліотека</p>
              <h3 class="mt-1 font-serif text-2xl text-espresso">Список книг</h3>
              <p v-if="books.length" class="mt-1 text-sm text-cocoa">
                Доступно: {{ available.length }} · Вже обрано: {{ takenCount }}
              </p>
            </div>
            <button
              class="-mr-2 rounded-full p-2 text-cocoa transition hover:bg-olive-100 hover:text-espresso"
              aria-label="Закрити"
              @click="emit('close')"
            >
              <Icon name="ph:x" class="h-6 w-6" />
            </button>
          </div>

          <!-- Body -->
          <div class="overflow-y-auto px-6 py-5">
            <div v-if="pending && !books.length" class="py-12 text-center text-cocoa">
              Завантаження…
            </div>

            <div
              v-else-if="!books.length"
              class="py-12 text-center text-cocoa"
            >
              Список книг поки що порожній. Зазирніть трохи згодом 🤍
            </div>

            <ul v-else class="grid gap-3">
              <li
                v-for="b in books"
                :key="b.id"
                class="flex items-center gap-4 rounded-xl border border-olive-200 bg-cream/40 p-3"
                :class="b.taken ? 'opacity-60' : ''"
              >
                <div class="h-20 w-14 shrink-0 overflow-hidden rounded border border-olive-200 bg-olive-50">
                  <img
                    v-if="b.imageUrl"
                    :src="b.imageUrl"
                    :alt="b.title"
                    class="h-full w-full object-cover"
                  >
                  <div v-else class="flex h-full w-full items-center justify-center">
                    <Icon name="ph:book-open" class="h-6 w-6 text-olive-400" />
                  </div>
                </div>

                <div class="min-w-0 flex-1">
                  <p class="font-serif text-lg leading-tight text-espresso">
                    {{ b.title }}
                  </p>
                  <p v-if="b.author" class="text-sm text-cocoa">{{ b.author }}</p>
                  <p v-if="b.note" class="mt-0.5 text-xs text-cocoa/80">{{ b.note }}</p>
                  <a
                    v-if="b.url"
                    :href="b.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="mt-1 inline-flex items-center gap-1 text-xs text-olive-600 hover:text-olive-700"
                  >
                    <Icon name="ph:link" class="h-3.5 w-3.5" />
                    Детальніше
                  </a>
                </div>

                <span
                  class="shrink-0 rounded-full px-3 py-1 text-xs font-medium"
                  :class="b.taken
                    ? 'bg-blush/40 text-espresso'
                    : 'bg-olive-100 text-olive-700'"
                >
                  {{ b.taken ? 'Вже обрано' : 'Вільна' }}
                </span>
              </li>
            </ul>
          </div>

          <!-- Footer -->
          <div class="border-t border-olive-200 px-6 py-4 text-center">
            <p class="text-sm text-cocoa">
              Обрати книгу можна у формі підтвердження присутності нижче ↓
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.books-modal-enter-active,
.books-modal-leave-active {
  transition: opacity 0.3s var(--ease-soft);
}
.books-modal-enter-from,
.books-modal-leave-to {
  opacity: 0;
}
.books-modal-enter-active > div,
.books-modal-leave-active > div {
  transition: transform 0.35s var(--ease-soft);
}
.books-modal-enter-from > div,
.books-modal-leave-to > div {
  transform: translateY(2rem);
}
</style>
