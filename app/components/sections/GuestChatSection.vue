<script setup lang="ts">
const { content } = useSite()
const chat = computed(() => content.value.guestChat)
</script>

<template>
  <SectionShell id="guest-chat">
    <RevealOnScroll
      class="relative mx-auto flex max-w-3xl flex-col items-center overflow-hidden rounded-2xl border border-olive-200/70 bg-gradient-to-b from-cream to-ivory px-6 py-14 text-center shadow-sm sm:px-14"
    >
      <span class="flex h-14 w-14 items-center justify-center rounded-full bg-olive-600 text-ivory">
        <Icon name="ph:chats-circle" class="h-7 w-7" />
      </span>

      <h2 class="mt-6 text-3xl text-espresso sm:text-4xl">{{ chat.heading }}</h2>
      <p class="mt-4 max-w-xl font-sans text-base leading-relaxed text-cocoa sm:text-lg">
        {{ chat.text }}
      </p>

      <AppButton as="a" :href="chat.telegramUrl" variant="solid" class="mt-8">
        <Icon name="ph:telegram-logo" class="h-5 w-5" />
        {{ chat.buttonLabel }}
      </AppButton>
    </RevealOnScroll>
  </SectionShell>
</template>
