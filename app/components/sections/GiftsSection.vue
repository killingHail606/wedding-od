<script setup lang="ts">
// Static wishes about gifts & flowers. Text is intentionally hardcoded —
// it rarely changes and isn't part of the editable CMS content.
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
          </div>
        </RevealOnScroll>
      </div>
    </div>
  </SectionShell>
</template>
