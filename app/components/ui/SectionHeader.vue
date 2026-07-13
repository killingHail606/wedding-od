<script setup lang="ts">
withDefaults(
  defineProps<{
    eyebrow?: string
    title: string
    align?: 'center' | 'left'
  }>(),
  { align: 'center' },
)
</script>

<template>
  <RevealOnScroll
    class="flex flex-col gap-4"
    :class="align === 'center' ? 'items-center text-center' : 'items-start text-left'"
  >
    <span v-if="eyebrow" class="eyebrow">{{ eyebrow }}</span>
    <h2 class="text-3xl sm:text-4xl md:text-5xl text-espresso">
      {{ title }}
    </h2>
    <div class="hairline" :class="align === 'center' ? '' : 'ml-0'" />
  </RevealOnScroll>
</template>
