<script setup lang="ts">
withDefaults(
  defineProps<{
    as?: 'button' | 'a'
    href?: string
    variant?: 'solid' | 'outline'
    type?: 'button' | 'submit'
    disabled?: boolean
    block?: boolean
  }>(),
  { as: 'button', variant: 'solid', type: 'button', disabled: false, block: false },
)
</script>

<template>
  <component
    :is="as"
    :href="as === 'a' ? href : undefined"
    :type="as === 'button' ? type : undefined"
    :target="as === 'a' ? '_blank' : undefined"
    :rel="as === 'a' ? 'noopener noreferrer' : undefined"
    :disabled="as === 'button' ? disabled : undefined"
    :aria-disabled="disabled || undefined"
    class="group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium tracking-wide transition-all duration-300 ease-[var(--ease-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-500 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory disabled:cursor-not-allowed disabled:opacity-50"
    :class="[
      block ? 'w-full' : '',
      variant === 'solid'
        ? 'bg-olive-600 text-ivory hover:bg-olive-700 shadow-sm hover:shadow-md'
        : 'border border-olive-400 text-olive-700 hover:bg-olive-100/60',
    ]"
  >
    <slot />
  </component>
</template>
