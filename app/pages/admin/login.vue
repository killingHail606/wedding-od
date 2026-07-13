<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Вхід · Адмін' })

const password = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await $fetch('/api/admin/login', {
      method: 'POST',
      body: { password: password.value },
    })
    await navigateTo('/admin')
  }
  catch (e: unknown) {
    const err = e as { statusMessage?: string }
    error.value = err.statusMessage || 'Не вдалося увійти'
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-[80vh] items-center justify-center">
    <form
      class="w-full max-w-sm rounded-2xl border border-olive-200 bg-ivory p-8 shadow-sm"
      @submit.prevent="submit"
    >
      <h1 class="text-center font-serif text-2xl">Панель керування</h1>
      <p class="mt-1 text-center text-sm text-cocoa">Весільне запрошення</p>

      <div class="mt-8">
        <label for="password" class="field-label">Пароль</label>
        <input
          id="password"
          v-model="password"
          type="password"
          class="field-input"
          autocomplete="current-password"
          :aria-invalid="!!error"
        >
        <p v-if="error" class="field-error">{{ error }}</p>
      </div>

      <AppButton type="submit" block class="mt-6" :disabled="loading">
        {{ loading ? 'Входимо…' : 'Увійти' }}
      </AppButton>
    </form>
  </div>
</template>
