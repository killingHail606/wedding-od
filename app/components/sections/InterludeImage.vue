<script setup lang="ts">
import type { GalleryPhoto } from '#shared/types'

const props = defineProps<{
  photo: GalleryPhoto
  index: number
  tint?: boolean
}>()

const { open } = useGallery()

const sizeClass = computed(() => {
  switch (props.photo.orientation) {
    case 'portrait':
      return 'max-w-md aspect-[4/5]'
    case 'square':
      return 'max-w-lg aspect-square'
    default:
      return 'max-w-4xl aspect-[16/10]'
  }
})
</script>

<template>
  <section class="py-8 sm:py-12" :class="tint ? 'bg-cream/60' : ''">
    <div class="container-page">
      <RevealOnScroll :y="36">
        <button
          type="button"
          class="group mx-auto block w-full overflow-hidden rounded-2xl shadow-sm ring-1 ring-espresso/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-500 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
          :class="sizeClass"
          @click="open(index)"
        >
          <span class="sr-only">Відкрити фото: {{ photo.alt }}</span>
          <NuxtImg
            :src="photo.src"
            :alt="photo.alt"
            loading="lazy"
            class="h-full w-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-soft)] group-hover:scale-[1.05]"
            sizes="100vw md:60vw"
          />
        </button>
      </RevealOnScroll>
    </div>
  </section>
</template>
