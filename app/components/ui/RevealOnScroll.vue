<script setup lang="ts">
import { useReducedMotion } from '@vueuse/motion'

const props = withDefaults(
  defineProps<{
    as?: string
    y?: number
    delay?: number
    duration?: number
  }>(),
  { as: 'div', y: 28, delay: 0, duration: 750 },
)

const reduced = useReducedMotion()

const initial = computed(() =>
  reduced.value ? { opacity: 1, y: 0 } : { opacity: 0, y: props.y },
)

const enter = computed(() => ({
  opacity: 1,
  y: 0,
  transition: {
    duration: reduced.value ? 0 : props.duration,
    delay: reduced.value ? 0 : props.delay,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  },
}))
</script>

<template>
  <component
    :is="as"
    v-motion
    :initial="initial"
    :visible-once="enter"
  >
    <slot />
  </component>
</template>
