<script setup lang="ts">
const { content } = useSite()
const dressCode = computed(() => content.value.dressCode)
</script>

<template>
  <SectionShell id="dress-code" narrow>
    <div class="flex flex-col items-center text-center">
      <SectionHeader eyebrow="Стиль вечора" title="Dress code" />

      <RevealOnScroll :delay="120">
        <p class="mt-8 max-w-xl font-sans text-base leading-relaxed text-cocoa sm:text-lg">
          {{ dressCode.description }}
        </p>
      </RevealOnScroll>

      <RevealOnScroll :delay="220" class="w-full">
        <ul class="mt-12 flex w-full flex-wrap items-center justify-center gap-5 sm:gap-7">
          <li
            v-for="color in dressCode.colors"
            :key="color.hex"
            class="shrink-0"
          >
            <span
              class="block h-11 w-11 rounded-full shadow-md ring-1 ring-espresso/10 sm:h-16 sm:w-16"
              :style="{ backgroundColor: color.hex }"
            />
          </li>
        </ul>
      </RevealOnScroll>
    </div>
  </SectionShell>
</template>
