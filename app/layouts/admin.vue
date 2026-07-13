<script setup lang="ts">
useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

const route = useRoute()
const showChrome = computed(() => route.path !== '/admin/login')

async function logout() {
  await $fetch('/api/admin/logout', { method: 'POST' })
  await navigateTo('/admin/login')
}
</script>

<template>
  <div class="min-h-screen bg-olive-50 text-espresso">
    <header
      v-if="showChrome"
      class="sticky top-0 z-20 border-b border-olive-200 bg-ivory/90 backdrop-blur"
    >
      <div class="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <NuxtLink to="/admin" class="font-serif text-lg">
          Адмін · <span class="text-olive-600">Дарʼя &amp; Олександр</span>
        </NuxtLink>
        <div class="flex items-center gap-3">
          <NuxtLink to="/" target="_blank" class="text-sm text-cocoa hover:text-espresso">
            Сайт ↗
          </NuxtLink>
          <button
            class="rounded-full border border-olive-300 px-4 py-1.5 text-sm text-olive-700 transition hover:bg-olive-100"
            @click="logout"
          >
            Вийти
          </button>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-5 py-8">
      <slot />
    </main>
  </div>
</template>
