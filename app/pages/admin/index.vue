<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Панель керування · Адмін' })

type Tab = 'rsvp' | 'guests' | 'content'
const tab = ref<Tab>('rsvp')

const tabs: { id: Tab, label: string, icon: string }[] = [
  { id: 'rsvp', label: 'Відповіді (RSVP)', icon: 'ph:envelope-open' },
  { id: 'guests', label: 'Гості та запрошення', icon: 'ph:users-three' },
  { id: 'content', label: 'Контент сайту', icon: 'ph:pencil-simple' },
]
</script>

<template>
  <div>
    <nav class="mb-8 flex flex-wrap gap-2 border-b border-olive-200">
      <button
        v-for="t in tabs"
        :key="t.id"
        class="flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition"
        :class="tab === t.id
          ? 'border-olive-600 text-olive-700'
          : 'border-transparent text-cocoa hover:text-espresso'"
        @click="tab = t.id"
      >
        <Icon :name="t.icon" class="h-4 w-4" />
        {{ t.label }}
      </button>
    </nav>

    <AdminRsvpTab v-if="tab === 'rsvp'" />
    <AdminGuestsTab v-else-if="tab === 'guests'" />
    <AdminContentTab v-else />
  </div>
</template>
