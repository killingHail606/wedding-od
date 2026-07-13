<script setup lang="ts">
import type { VenuePlace } from '#shared/types'

const props = defineProps<{
  place: VenuePlace
  label: string
}>()

const embedUrl = computed(
  () =>
    `https://maps.google.com/maps?q=${props.place.lat},${props.place.lng}&z=15&hl=uk&output=embed`,
)
</script>

<template>
  <RevealOnScroll class="overflow-hidden rounded-xl border border-olive-200/70 bg-ivory shadow-sm">
    <div class="aspect-[16/10] w-full bg-olive-100">
      <iframe
        :src="embedUrl"
        :title="`Карта: ${place.name}`"
        class="h-full w-full border-0"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      />
    </div>

    <div class="p-6 sm:p-8">
      <span class="eyebrow">{{ label }}</span>
      <h3 class="mt-2 font-serif text-2xl text-espresso">{{ place.name }}</h3>
      <p class="mt-2 flex items-start gap-2 font-sans text-sm text-cocoa">
        <Icon name="ph:map-pin" class="mt-0.5 h-4 w-4 shrink-0 text-olive-500" />
        <span>{{ place.address }}</span>
      </p>
      <p v-if="place.timeLabel" class="mt-1 flex items-center gap-2 font-sans text-sm text-cocoa">
        <Icon name="ph:clock" class="h-4 w-4 shrink-0 text-olive-500" />
        <span>Початок о {{ place.timeLabel }}</span>
      </p>

      <div class="mt-6 flex flex-col gap-3 sm:flex-row">
        <AppButton as="a" :href="place.googleMapsUrl" variant="solid" block>
          <Icon name="ph:navigation-arrow" class="h-4 w-4" />
          Маршрут (Google)
        </AppButton>
        <AppButton as="a" :href="place.wazeUrl" variant="outline" block>
          <Icon name="ph:car-profile" class="h-4 w-4" />
          Waze
        </AppButton>
      </div>
    </div>
  </RevealOnScroll>
</template>
