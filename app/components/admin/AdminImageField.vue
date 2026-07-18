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
  <div class="block">
    <span class="field-label">{{ label }}</span>

    <div class="flex items-start gap-3">
      <!-- Preview -->
      <div class="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-olive-200 bg-olive-50">
        <img v-if="model" :src="model" alt="" class="h-full w-full object-cover">
        <div v-else class="flex h-full w-full items-center justify-center">
          <Icon name="ph:image" class="h-5 w-5 text-olive-400" />
        </div>
      </div>

      <div class="min-w-0 flex-1">
        <input
          v-model="model"
          :placeholder="placeholder"
          class="field-input"
        >
        <div class="mt-2 flex items-center gap-2">
          <button
            type="button"
            class="rounded-full border border-olive-300 px-3 py-1.5 text-xs text-olive-700 transition hover:bg-olive-100 disabled:opacity-50"
            :disabled="uploading"
            @click="input?.click()"
          >
            <Icon
              :name="uploading ? 'ph:spinner' : 'ph:upload-simple'"
              class="mr-1 inline h-3.5 w-3.5"
              :class="uploading ? 'animate-spin' : ''"
            />
            {{ uploading ? 'Завантаження…' : 'Завантажити файл' }}
          </button>
          <span v-if="error" class="text-xs text-red-600">{{ error }}</span>
        </div>
        <input
          ref="input"
          type="file"
          accept="image/*"
          class="hidden"
          @change="onSelect"
        >
      </div>
    </div>
  </div>
</template>
