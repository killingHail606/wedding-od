<script setup lang="ts">
const { content, guest } = useSite()
const hero = computed(() => content.value.hero)
const couple = computed(() => content.value.couple)
const event = computed(() => content.value.event)
</script>

<template>
  <section
    id="hero"
    class="relative flex min-h-[100svh] items-center justify-center overflow-hidden"
  >
    <!-- Background photo -->
    <div class="absolute inset-0">
      <NuxtImg
        :src="hero.photo"
        alt=""
        width="1920"
        height="1280"
        class="absolute inset-0 h-full w-full object-cover"
        style="object-fit: cover"
        sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw"
        preload
        fetchpriority="high"
      />
      <div class="absolute inset-0 bg-espresso/30" />
      <div class="absolute inset-0 bg-gradient-to-b from-espresso/20 via-espresso/15 to-espresso/50" />
    </div>

    <!-- Content -->
    <div class="container-page relative z-10 flex flex-col items-center text-center text-ivory">
      <RevealOnScroll class="w-full" :y="16">
        <p v-if="guest" class="mb-6 font-sans text-sm tracking-[0.2em] text-ivory/80 uppercase">
          {{ guest.firstName }}, ми запрошуємо вас
        </p>
        <p class="eyebrow !text-ivory/75">
          {{ hero.kicker }}
        </p>
      </RevealOnScroll>

      <RevealOnScroll class="w-full" :delay="120" :y="24">
        <h1 class="mt-6 font-script text-[clamp(2rem,9vw,6.5rem)] leading-[1.12] break-words text-balance">
          {{ couple.displayName }}
        </h1>
      </RevealOnScroll>

      <RevealOnScroll class="w-full" :delay="240">
        <div class="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-ivory/90">
          <span class="h-px w-10 bg-ivory/40" />
          <span class="font-serif text-lg tracking-wide sm:text-xl">
            {{ event.dateLabel }}
          </span>
          <span class="h-px w-10 bg-ivory/40" />
        </div>
      </RevealOnScroll>

      <RevealOnScroll class="w-full" :delay="340">
        <p class="mx-auto mt-8 max-w-xl font-sans text-base leading-relaxed text-ivory/85 sm:text-lg">
          {{ hero.invitationLine }}
        </p>
      </RevealOnScroll>
    </div>

    <!-- Scroll cue -->
    <a
      href="#gallery"
      aria-label="Гортати далі"
      class="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-ivory/70 transition-colors hover:text-ivory"
    >
      <Icon name="ph:caret-down" class="h-6 w-6 animate-bounce" />
    </a>
  </section>
</template>
