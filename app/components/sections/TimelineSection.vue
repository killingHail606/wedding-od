<script setup lang="ts">
const { content } = useSite()

// Ceremony is stripped to null for guests not invited to it.
const invitedToCeremony = computed(() => content.value.venue.ceremony !== null)
const items = computed(() =>
  content.value.timeline.filter(i => !i.ceremony || invitedToCeremony.value),
)
</script>

<template>
  <SectionShell id="timeline" tint narrow>
    <SectionHeader eyebrow="Розклад" title="Програма дня" />

    <ol class="relative mt-16 border-l border-olive-200 pl-8 sm:pl-10">
      <RevealOnScroll
        v-for="(item, i) in items"
        :key="i"
        as="li"
        :delay="i * 90"
        class="relative pb-12 last:pb-0"
      >
        <!-- Node -->
        <span
          class="absolute -left-[3.05rem] flex h-11 w-11 items-center justify-center rounded-full border border-olive-200 bg-ivory text-olive-600 shadow-sm sm:-left-[3.55rem]"
        >
          <Icon :name="item.icon" class="h-5 w-5" />
        </span>

        <time class="font-sans text-sm font-medium tracking-[0.2em] text-olive-600">
          {{ item.time }}
        </time>
        <h3 class="mt-1 font-serif text-2xl text-espresso">{{ item.title }}</h3>
        <p class="mt-1 font-sans text-base text-cocoa">{{ item.description }}</p>
      </RevealOnScroll>
    </ol>
  </SectionShell>
</template>
