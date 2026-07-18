<script setup lang="ts">
defineProps<{
  label: string
  placeholder?: string
}>()
const model = defineModel<string>()

const uploading = ref(false)
const error = ref('')
const input = ref<HTMLInputElement | null>(null)

async function onSelect(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  error.value = ''
  uploading.value = true
  try {
    const body = new FormData()
    body.append('file', file)
    const res = await $fetch<{ url: string }>('/api/admin/upload', {
      method: 'POST',
      body,
    })
    model.value = res.url
  }
  catch {
    error.value = 'Не вдалося завантажити файл'
  }
  finally {
    uploading.value = false
    if (input.value) input.value.value = ''
  }
}
</script>

<template>
  <label class="block">
    <span class="field-label">{{ label }}</span>

    <div class="flex items-center gap-2">
      <!-- Preview -->
      <div class="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-olive-200 bg-olive-50">
        <img v-if="model" :src="model" alt="" class="h-full w-full object-cover">
        <div v-else class="flex h-full w-full items-center justify-center">
          <Icon name="ph:image" class="h-5 w-5 text-olive-400" />
        </div>
      </div>

      <input
        v-model="model"
        :placeholder="placeholder"
        class="field-input min-w-0 flex-1"
      >

      <!-- Upload button -->
      <button
        type="button"
        class="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-lg border border-olive-300 px-3 text-xs font-medium text-olive-700 transition hover:bg-olive-100 disabled:opacity-50"
        :disabled="uploading"
        :title="uploading ? 'Завантаження…' : 'Завантажити файл'"
        @click.prevent="input?.click()"
      >
        <Icon
          :name="uploading ? 'ph:spinner' : 'ph:upload-simple'"
          class="h-4 w-4"
          :class="uploading ? 'animate-spin' : ''"
        />
        <span class="hidden sm:inline">{{ uploading ? 'Завантаження…' : 'Файл' }}</span>
      </button>

      <input
        ref="input"
        type="file"
        accept="image/*"
        class="hidden"
        @change="onSelect"
      >
    </div>

    <p v-if="error" class="field-error">{{ error }}</p>
  </label>
</template>
