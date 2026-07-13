<script setup lang="ts">
const { content } = useSite()
const venue = computed(() => content.value.venue)
const hasCeremony = computed(() => venue.value.ceremony !== null)
</script>

<template>
  <SectionShell id="venue">
    <SectionHeader eyebrow="Локація" title="Місце проведення" />

    <div
      class="mt-14 grid gap-6"
      :class="hasCeremony ? 'lg:grid-cols-2' : 'mx-auto max-w-2xl'"
    >
      <VenuePlaceCard
        v-if="venue.ceremony"
        :place="venue.ceremony"
        label="Церемонія"
      />
      <VenuePlaceCard
        :place="venue.banquet"
        label="Банкет"
      />
    </div>
  </SectionShell>
</template>
