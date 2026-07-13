<script setup lang="ts">
const { content } = useSite()
const event = computed(() => content.value.event)
const parts = useCountdown(() => event.value.dateTime)

const units = computed(() => [
  { value: parts.value.days, label: 'днів' },
  { value: parts.value.hours, label: 'годин' },
  { value: parts.value.minutes, label: 'хвилин' },
  { value: parts.value.seconds, label: 'секунд' },
])

function pad(n: number) {
  return String(n).padStart(2, '0')
}
</script>

<template>
  <SectionShell id="countdown" tint>
    <SectionHeader eyebrow="Зворотний відлік" title="До нашого дня" />

    <RevealOnScroll :delay="120">
      <div v-if="parts.finished" class="mt-14 text-center font-serif text-2xl text-espresso">
        Цей день настав 💫
      </div>
      <div v-else class="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
        <div
          v-for="unit in units"
          :key="unit.label"
          class="flex flex-col items-center rounded-lg border border-olive-200/70 bg-ivory/70 px-4 py-7 shadow-sm"
        >
          <span class="font-serif text-5xl tabular-nums text-espresso sm:text-6xl">
            {{ pad(unit.value) }}
          </span>
          <span class="mt-2 font-sans text-xs tracking-[0.25em] text-olive-600 uppercase">
            {{ unit.label }}
          </span>
        </div>
      </div>
    </RevealOnScroll>
  </SectionShell>
</template>
