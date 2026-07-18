<script setup lang="ts">
const { content } = useSite()
const event = computed(() => content.value.event)
const couple = computed(() => content.value.couple)
const banquet = computed(() => content.value.venue.banquet)

const { googleUrl } = useAddToCalendar(() => ({
  title: `Весілля · ${couple.value.displayName}`,
  description: 'Запрошуємо вас на наше весілля!',
  location: `${banquet.value.name}, ${banquet.value.address}`,
  start: new Date(event.value.dateTime),
  durationHours: 8,
}))

const weekday = computed(() =>
  new Intl.DateTimeFormat('uk-UA', { weekday: 'long' }).format(
    new Date(event.value.dateTime),
  ),
)
</script>

<template>
  <SectionShell id="date">
    <div class="flex flex-col items-center text-center">
      <SectionHeader eyebrow="Збережіть дату" title="Коли" />

      <RevealOnScroll :delay="120" class="w-full">
        <div class="mx-auto mt-12 flex max-w-md flex-col items-center rounded-2xl border border-olive-200/70 bg-cream/50 px-8 py-10">
          <span class="eyebrow">{{ weekday }}</span>

          <p class="mt-4 font-serif text-4xl leading-tight text-espresso sm:text-5xl">
            {{ event.dateLabel }}
          </p>

          <div class="mt-5 flex items-center gap-4 text-olive-600">
            <span class="h-px w-8 bg-brass/40" />
            <span class="font-serif text-2xl tracking-wide">{{ event.timeLabel }}</span>
            <span class="h-px w-8 bg-brass/40" />
          </div>
        </div>
      </RevealOnScroll>

      <RevealOnScroll :delay="240">
        <div class="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <AppButton as="a" :href="googleUrl" variant="solid">
            <Icon name="ph:google-logo" class="h-4 w-4" />
            Додати в Google Календар
          </AppButton>
        </div>
      </RevealOnScroll>
    </div>
  </SectionShell>
</template>
