<script setup lang="ts">
const { content } = useSite()
const invitation = computed(() => content.value.invitation)
const couple = computed(() => content.value.couple)
</script>

<template>
  <SectionShell id="invitation" narrow>
    <div class="flex flex-col items-center text-center">
      <RevealOnScroll>
        <Icon name="ph:flower-lotus" class="h-9 w-9 text-olive-500" />
      </RevealOnScroll>

      <RevealOnScroll :delay="80">
        <h2 class="mt-6 text-3xl text-espresso sm:text-4xl">
          {{ invitation.heading }}
        </h2>
      </RevealOnScroll>

      <RevealOnScroll
        v-for="(para, i) in invitation.paragraphs"
        :key="i"
        :delay="160 + i * 100"
      >
        <p class="mt-6 font-serif text-xl leading-relaxed text-cocoa sm:text-2xl">
          {{ para }}
        </p>
      </RevealOnScroll>

      <RevealOnScroll :delay="200 + invitation.paragraphs.length * 100">
        <p class="mt-10 font-script text-4xl text-olive-600 sm:text-5xl">
          {{ couple.displayName }}
        </p>
      </RevealOnScroll>
    </div>
  </SectionShell>
</template>
