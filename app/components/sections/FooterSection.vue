<script setup lang="ts">
const { content } = useSite()
const footer = computed(() => content.value.footer)
const couple = computed(() => content.value.couple)

const telegramUrl = computed(() => {
  const handle = footer.value.telegram.replace(/^@/, '')
  return `https://t.me/${handle}`
})
const phoneHref = computed(() => `tel:${footer.value.phone.replace(/\s/g, '')}`)
</script>

<template>
  <footer class="relative overflow-hidden border-t border-olive-200/60 text-ivory">
    <!-- Background image with dark overlay for legibility -->
    <div class="absolute inset-0">
      <NuxtImg
        v-if="footer.background"
        :src="footer.background"
        alt=""
        loading="lazy"
        class="h-full w-full object-cover"
        sizes="100vw"
      />
      <div class="absolute inset-0 bg-espresso/85" />
      <div class="absolute inset-0 bg-gradient-to-b from-espresso/70 to-espresso/95" />
    </div>

    <div class="container-narrow relative z-10 py-16 text-center">
      <RevealOnScroll>
        <p class="font-script text-5xl text-ivory sm:text-6xl">{{ couple.displayName }}</p>
      </RevealOnScroll>

      <RevealOnScroll :delay="100">
        <p class="mx-auto mt-6 max-w-lg font-sans text-sm leading-relaxed text-ivory/75">
          {{ footer.thankYou }}
        </p>
      </RevealOnScroll>

      <RevealOnScroll :delay="180">
        <div class="mt-10 border-t border-ivory/15 pt-8">
          <p class="font-sans text-xs tracking-[0.25em] text-ivory/55 uppercase">
            Координатор весілля
          </p>
          <p class="mt-3 font-serif text-xl">{{ footer.coordinatorName }}</p>
          <div class="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-sans text-sm text-ivory/80">
            <a :href="phoneHref" class="inline-flex items-center gap-2 transition hover:text-ivory">
              <Icon name="ph:phone" class="h-4 w-4" />
              {{ footer.phone }}
            </a>
            <a :href="telegramUrl" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 transition hover:text-ivory">
              <Icon name="ph:telegram-logo" class="h-4 w-4" />
              {{ footer.telegram }}
            </a>
          </div>
        </div>
      </RevealOnScroll>

      <p class="mt-12 font-sans text-xs text-ivory/40">
        © {{ new Date().getFullYear() }} · Зроблено з любовʼю 🤍
      </p>
    </div>
  </footer>
</template>
