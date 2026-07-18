<script setup lang="ts">
import type { GalleryPhoto } from '#shared/types'
import { onKeyStroke, useSwipe } from '@vueuse/core'

const props = defineProps<{
  photos: GalleryPhoto[]
  index: number | null
}>()

const emit = defineEmits<{ close: [], navigate: [index: number] }>()

const open = computed(() => props.index !== null)
const current = computed(() =>
  props.index !== null ? props.photos[props.index] : undefined,
)

function next() {
  if (props.index === null) return
  emit('navigate', (props.index + 1) % props.photos.length)
}
function prev() {
  if (props.index === null) return
  emit('navigate', (props.index - 1 + props.photos.length) % props.photos.length)
}

onKeyStroke('Escape', () => open.value && emit('close'))
onKeyStroke('ArrowRight', () => open.value && next())
onKeyStroke('ArrowLeft', () => open.value && prev())

// Lock body scroll while open
watch(open, (isOpen) => {
  if (import.meta.client) {
    document.body.style.overflow = isOpen ? 'hidden' : ''
  }
})
onUnmounted(() => {
  if (import.meta.client) document.body.style.overflow = ''
})

// Swipe on touch devices
const stage = ref<HTMLElement | null>(null)
const { direction } = useSwipe(stage, {
  onSwipeEnd() {
    if (direction.value === 'left') next()
    else if (direction.value === 'right') prev()
  },
})
</script>

<template>
  <Teleport to="body">
    <Transition name="lightbox">
      <div
        v-if="open && current"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-espresso/92 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-label="Перегляд фотографії"
        @click.self="emit('close')"
      >
        <button
          class="absolute top-5 right-5 rounded-full p-2 text-ivory/80 transition hover:bg-ivory/10 hover:text-ivory"
          aria-label="Закрити"
          @click="emit('close')"
        >
          <Icon name="ph:x" class="h-7 w-7" />
        </button>

        <button
          class="absolute left-3 hidden rounded-full p-3 text-ivory/70 transition hover:bg-ivory/10 hover:text-ivory sm:block"
          aria-label="Попереднє фото"
          @click="prev"
        >
          <Icon name="ph:caret-left" class="h-8 w-8" />
        </button>

        <!--
          The image is a plain block element (not a flex child): Safari has a
          long-standing flexbox bug that collapses an <img> flex item's width
          and squishes it into a vertical strip. Centering is handled by the
          overlay's flex above; the image keeps its aspect via max-w/max-h.
        -->
        <div
          ref="stage"
          class="px-2"
          @click.self="emit('close')"
        >
          <NuxtImg
            :key="current.src"
            :src="current.src"
            :alt="current.alt"
            class="mx-auto block h-auto w-auto rounded-sm object-contain shadow-2xl"
            style="max-height: 86svh; max-width: 92vw;"
            sizes="92vw"
          />
        </div>

        <button
          class="absolute right-3 hidden rounded-full p-3 text-ivory/70 transition hover:bg-ivory/10 hover:text-ivory sm:block"
          aria-label="Наступне фото"
          @click="next"
        >
          <Icon name="ph:caret-right" class="h-8 w-8" />
        </button>

        <div class="absolute bottom-6 left-1/2 -translate-x-1/2 font-sans text-xs tracking-widest text-ivory/60">
          {{ (index ?? 0) + 1 }} / {{ photos.length }}
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.35s var(--ease-soft);
}
.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
</style>
