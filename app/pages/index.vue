<script setup lang="ts">
import type { SiteResponse } from '#shared/types'

const route = useRoute()
const config = useRuntimeConfig()

const guestToken = computed(() => (route.query.guest as string) || '')

const { data, error } = await useFetch<SiteResponse>('/api/site', {
  key: 'site',
  query: { guest: guestToken },
})

// Provide content + guest to all sections (guarded by v-if below → non-null).
const content = computed(() => data.value!.content)
const guest = computed(() => data.value?.guest ?? null)
provide(SiteKey, { content, guest })

// Photos are scattered between sections; a shared lightbox shows them all.
const gallery = useGallery()
watchEffect(() => {
  gallery.photos.value = data.value?.content.gallery ?? []
})
const photos = computed(() => gallery.photos.value)

// Envelope intro is shown on every visit.
const showEnvelope = ref(route.query.intro !== '0')

// SEO / Open Graph
const siteUrl = config.public.siteUrl
useSeoMeta({
  title: () =>
    `${content.value?.couple.displayName ?? 'Весілля'} · Запрошення на весілля`,
  description: () => content.value?.hero.invitationLine ?? '',
  ogType: 'website',
  ogTitle: () =>
    `${content.value?.couple.displayName} · ${content.value?.event.dateLabel}`,
  ogDescription: () => content.value?.hero.invitationLine ?? '',
  ogImage: `${siteUrl}/images/og.jpg`,
  ogLocale: 'uk_UA',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div>
    <div v-if="error" class="flex min-h-[100svh] items-center justify-center px-6 text-center">
      <p class="font-serif text-xl text-espresso">
        Не вдалося завантажити запрошення. Спробуйте оновити сторінку.
      </p>
    </div>

    <template v-else-if="data">
      <EnvelopeIntro
        v-if="showEnvelope"
        :couple-name="content.couple.displayName"
        :date-label="content.event.dateLabel"
        :guest-name="guest?.firstName"
        :partner-name="guest?.partnerFirstName"
        @opened="showEnvelope = false"
      />

      <main>
        <HeroSection />
        <InvitationSection />
        <InterludeImage v-if="photos[0]" :photo="photos[0]" :index="0" tint />
        <DateSection />
        <CountdownSection />
        <InterludeImage v-if="photos[1]" :photo="photos[1]" :index="1" />
        <VenueSection />
        <TimelineSection />
        <InterludeImage v-if="photos[2]" :photo="photos[2]" :index="2" tint />
        <DressCodeSection />
        <GiftsSection />
        <RsvpSection />
        <InterludeImage v-if="photos[3]" :photo="photos[3]" :index="3" />
        <GuestChatSection />
      </main>
      <FooterSection />

      <ImageLightbox
        :photos="photos"
        :index="gallery.activeIndex.value"
        @close="gallery.close()"
        @navigate="gallery.navigate($event)"
      />
    </template>
  </div>
</template>
