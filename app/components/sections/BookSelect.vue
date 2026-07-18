<script setup lang="ts">
import type { BookPublic } from '#shared/types'
import { onClickOutside } from '@vueuse/core'

const props = defineProps<{
  options: BookPublic[]
  placeholder?: string
  /** Allow choosing several books; model becomes a number[] in that case. */
  multiple?: boolean
}>()

const model = defineModel<number | number[] | null>()

const open = ref(false)
const root = ref<HTMLElement | null>(null)

onClickOutside(root, () => (open.value = false))

const selectedIds = computed<number[]>(() => {
  if (props.multiple) return Array.isArray(model.value) ? model.value : []
  return typeof model.value === 'number' ? [model.value] : []
})

// Single-select convenience (first pick) for the compact button rendering.
const selected = computed(() =>
  props.options.find(b => b.id === selectedIds.value[0]) ?? null,
)

// Books chosen in multi mode, in the order they were picked.
const selectedBooks = computed(() =>
  selectedIds.value
    .map(id => props.options.find(b => b.id === id))
    .filter((b): b is BookPublic => !!b),
)

function isSelected(id: number) {
  return selectedIds.value.includes(id)
}

function choose(book: BookPublic) {
  if (props.multiple) {
    const current = Array.isArray(model.value) ? [...model.value] : []
    const i = current.indexOf(book.id)
    if (i >= 0) current.splice(i, 1)
    else current.push(book.id)
    model.value = current
    // Keep the dropdown open so several books can be picked in a row.
  }
  else {
    model.value = book.id
    open.value = false
  }
}

function removeBook(id: number) {
  if (!props.multiple) {
    model.value = null
    return
  }
  model.value = (Array.isArray(model.value) ? model.value : []).filter(x => x !== id)
}
</script>

<template>
  <div ref="root" class="relative">
    <!-- Chosen books (multi mode) -->
    <div v-if="multiple && selectedBooks.length" class="mb-2 flex flex-wrap gap-2">
      <span
        v-for="b in selectedBooks"
        :key="b.id"
        class="inline-flex max-w-full items-center gap-1.5 rounded-full border border-olive-300 bg-olive-100 py-1 pr-1 pl-3 text-sm text-olive-700"
      >
        <span class="truncate">{{ b.title }}</span>
        <button
          type="button"
          class="shrink-0 rounded-full p-0.5 text-olive-600 transition hover:bg-olive-200 hover:text-espresso"
          :aria-label="`Прибрати «${b.title}»`"
          @click="removeBook(b.id)"
        >
          <Icon name="ph:x" class="h-3.5 w-3.5" />
        </button>
      </span>
    </div>

    <button
      type="button"
      class="field-input flex w-full items-center justify-between gap-3 text-left"
      :aria-expanded="open"
      @click="open = !open"
    >
      <!-- Multi: a simple prompt; picked books show as chips above -->
      <span v-if="multiple" class="text-cocoa/70">
        {{ selectedBooks.length ? 'Додати ще книгу…' : (placeholder ?? 'Оберіть книги…') }}
      </span>

      <!-- Single: show the chosen book -->
      <template v-else>
        <span v-if="selected" class="flex min-w-0 items-center gap-3">
          <span class="flex h-10 w-7 shrink-0 items-center justify-center overflow-hidden rounded border border-olive-200 bg-olive-50">
            <img
              v-if="selected.imageUrl"
              :src="selected.imageUrl"
              :alt="selected.title"
              class="h-full w-full object-cover"
            >
            <Icon v-else name="ph:book" class="h-4 w-4 text-olive-400" />
          </span>
          <span class="min-w-0">
            <span class="block truncate font-medium text-espresso">{{ selected.title }}</span>
            <span v-if="selected.author" class="block truncate text-xs text-cocoa">{{ selected.author }}</span>
          </span>
        </span>
        <span v-else class="text-cocoa/70">{{ placeholder ?? 'Оберіть книгу…' }}</span>
      </template>

      <Icon
        name="ph:caret-down"
        class="h-4 w-4 shrink-0 text-olive-500 transition-transform"
        :class="open ? 'rotate-180' : ''"
      />
    </button>

    <Transition name="dropdown">
      <ul
        v-if="open"
        class="absolute z-20 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-olive-200 bg-ivory p-1.5 shadow-xl"
        role="listbox"
      >
        <li
          v-if="!options.length"
          class="px-3 py-4 text-center text-sm text-cocoa"
        >
          Усі книги вже розібрали 🤍
        </li>
        <li
          v-for="b in options"
          :key="b.id"
          role="option"
          :aria-selected="isSelected(b.id)"
          class="flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 transition hover:bg-olive-100"
          :class="isSelected(b.id) ? 'bg-olive-100' : ''"
          @click="choose(b)"
        >
          <span class="flex h-12 w-8 shrink-0 items-center justify-center overflow-hidden rounded border border-olive-200 bg-olive-50">
            <img
              v-if="b.imageUrl"
              :src="b.imageUrl"
              :alt="b.title"
              class="h-full w-full object-cover"
            >
            <Icon v-else name="ph:book" class="h-4 w-4 text-olive-400" />
          </span>
          <span class="min-w-0 flex-1">
            <span class="block truncate font-medium text-espresso">{{ b.title }}</span>
            <span v-if="b.author" class="block truncate text-xs text-cocoa">{{ b.author }}</span>
          </span>
          <Icon
            v-if="isSelected(b.id)"
            name="ph:check"
            class="h-4 w-4 shrink-0 text-olive-600"
          />
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity 0.2s var(--ease-soft),
    transform 0.2s var(--ease-soft);
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-0.4rem);
}
</style>
