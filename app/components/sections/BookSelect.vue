<script setup lang="ts">
import type { BookPublic } from '#shared/types'
import { onClickOutside } from '@vueuse/core'

const props = defineProps<{
  options: BookPublic[]
  placeholder?: string
}>()

const model = defineModel<number | null>()

const open = ref(false)
const root = ref<HTMLElement | null>(null)

onClickOutside(root, () => (open.value = false))

const selected = computed(() =>
  props.options.find(b => b.id === model.value) ?? null,
)

function choose(book: BookPublic) {
  model.value = book.id
  open.value = false
}
</script>

<template>
  <div ref="root" class="relative">
    <button
      type="button"
      class="field-input flex w-full items-center justify-between gap-3 text-left"
      :aria-expanded="open"
      @click="open = !open"
    >
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
          :aria-selected="b.id === model"
          class="flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 transition hover:bg-olive-100"
          :class="b.id === model ? 'bg-olive-100' : ''"
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
            v-if="b.id === model"
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
