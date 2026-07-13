<script setup lang="ts">
defineProps<{
  label: string
  type?: string
  textarea?: boolean
  rows?: number
  placeholder?: string
}>()
const model = defineModel<string | number>()
</script>

<template>
  <label class="block">
    <span class="field-label">{{ label }}</span>
    <textarea
      v-if="textarea"
      v-model="model"
      :rows="rows ?? 3"
      :placeholder="placeholder"
      class="field-input resize-y"
    />
    <input
      v-else
      v-model="model"
      :type="type ?? 'text'"
      :placeholder="placeholder"
      class="field-input"
    >
  </label>
</template>
