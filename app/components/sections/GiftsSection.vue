<script setup lang="ts">
// Static wishes about gifts & flowers. Text is intentionally hardcoded —
// it rarely changes and isn't part of the editable CMS content.
const { hasBooks, load } = useBooks()

// Preload the wishlist so the "view list" button only appears when there is
// actually something to show.
onMounted(() => load())

const showBooks = ref(false)
</script>

<template>
  <SectionShell id="gifts" narrow>
    <div class="flex flex-col items-center text-center">
      <SectionHeader eyebrow="Кілька слів" title="Про подарунки" />

      <div class="mt-12 grid w-full gap-6 sm:grid-cols-2">
        <RevealOnScroll :delay="120">
          <div class="flex h-full flex-col items-center rounded-2xl border border-olive-200 bg-ivory p-8 text-center shadow-sm">
            <Icon name="ph:envelope" class="h-9 w-9 text-olive-500" />
            <p class="mt-5 font-sans text-base leading-relaxed text-cocoa">
              Ваша присутність — уже найбільший подарунок для нас. Якщо ж ви захочете
              нас привітати, будемо вдячні за подарунок у вигляді святкового конверта 💌
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll :delay="220">
          <div class="flex h-full flex-col items-center rounded-2xl border border-olive-200 bg-ivory p-8 text-center shadow-sm">
            <Icon name="ph:book-open" class="h-9 w-9 text-olive-500" />
            <p class="mt-5 font-sans text-base leading-relaxed text-cocoa">
              Будь ласка, не даруйте нам квіти. Нам дуже шкода, коли вони швидко
              в'януть, тому, якщо ви планували букет, будемо раді, якщо замість нього
              ви оберете книгу, яка стане частиною нашої домашньої бібліотеки ❤️
            </p>

            <AppButton
              v-if="hasBooks"
              variant="outline"
              class="mt-6"
              @click="showBooks = true"
            >
              <Icon name="ph:books" class="h-4 w-4" />
              Переглянути список книг
            </AppButton>
          </div>
        </RevealOnScroll>
      </div>
    </div>

    <BooksModal :open="showBooks" @close="showBooks = false" />
  </SectionShell>
</template>
