<script setup lang="ts">
withDefaults(
  defineProps<{
    id?: string
    /** Use the narrow reading column instead of the wide page container. */
    narrow?: boolean
    /** Subtle alternating background tint. */
    tint?: boolean
  }>(),
  { narrow: false, tint: false },
)
</script>

<template>
  <section
    :id="id"
    class="scroll-mt-20 py-20 sm:py-28"
    :class="tint ? 'bg-cream/60' : ''"
  >
    <div :class="narrow ? 'container-narrow' : 'container-page'">
      <slot />
    </div>
  </section>
</template>
