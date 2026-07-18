<script setup lang="ts">
import type { WeddingContent } from '#shared/types'

const { data } = await useFetch<WeddingContent>('/api/admin/content')

// Local editable deep copy.
const model = reactive<WeddingContent>(structuredClone(toRaw(data.value!)))

const status = ref<'idle' | 'saving' | 'saved' | 'error'>('idle')

async function save() {
  status.value = 'saving'
  try {
    await $fetch('/api/admin/content', {
      method: 'PUT',
      body: JSON.parse(JSON.stringify(model)),
    })
    status.value = 'saved'
    setTimeout(() => (status.value = 'idle'), 2500)
  }
  catch {
    status.value = 'error'
  }
}

// Array helpers
function addParagraph() {
  model.invitation.paragraphs.push('')
}
function addTimelineItem() {
  model.timeline.push({ time: '', title: '', description: '', icon: 'ph:heart' })
}
function addColor() {
  model.dressCode.colors.push({ hex: '#cccccc', label: '' })
}
function addPhoto() {
  model.gallery.push({ src: '', alt: '', orientation: 'portrait' })
}
function removeAt<T>(arr: T[], i: number) {
  arr.splice(i, 1)
}
</script>

<template>
  <div class="pb-24">
    <div class="mb-6 flex items-center justify-between">
      <h2 class="font-serif text-2xl">Контент сайту</h2>
      <p class="text-sm text-cocoa">
        Завантажуйте фото кнопкою «Завантажити файл» або вкажіть URL.
      </p>
    </div>

    <div class="grid gap-6">
      <!-- Couple + event -->
      <section class="rounded-xl border border-olive-200 bg-ivory p-6">
        <h3 class="mb-4 font-serif text-lg">Молодята та подія</h3>
        <div class="grid gap-4 sm:grid-cols-3">
          <AdminField v-model="model.couple.brideName" label="Наречена" />
          <AdminField v-model="model.couple.groomName" label="Наречений" />
          <AdminField v-model="model.couple.displayName" label="Відображення (напр. Дарʼя & Олександр)" />
          <AdminField v-model="model.event.dateTime" label="Дата/час ISO (2026-09-26T14:00:00+03:00)" />
          <AdminField v-model="model.event.dateLabel" label="Підпис дати" />
          <AdminField v-model="model.event.timeLabel" label="Підпис часу" />
        </div>
      </section>

      <!-- Hero -->
      <section class="rounded-xl border border-olive-200 bg-ivory p-6">
        <h3 class="mb-4 font-serif text-lg">Головний екран (Hero)</h3>
        <div class="grid gap-4">
          <AdminImageField v-model="model.hero.photo" label="Фото" placeholder="/images/hero.jpg або URL" />
          <AdminField v-model="model.hero.kicker" label="Надпис зверху" />
          <AdminField v-model="model.hero.invitationLine" label="Короткий текст запрошення" textarea />
        </div>
      </section>

      <!-- Gallery -->
      <section class="rounded-xl border border-olive-200 bg-ivory p-6">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="font-serif text-lg">Галерея</h3>
          <button class="text-sm text-olive-700 hover:underline" @click="addPhoto">+ Додати фото</button>
        </div>
        <div class="grid gap-4">
          <div
            v-for="(photo, i) in model.gallery"
            :key="i"
            class="grid items-end gap-3 rounded-lg bg-olive-50 p-3 sm:grid-cols-[2fr_1fr_auto_auto]"
          >
            <AdminImageField v-model="photo.src" label="Зображення" placeholder="/images/gallery-1.jpg або URL" />
            <AdminField v-model="photo.alt" label="Опис (alt)" />
            <label class="block">
              <span class="field-label">Формат</span>
              <select v-model="photo.orientation" class="field-input">
                <option value="portrait">Вертикальне</option>
                <option value="landscape">Горизонтальне</option>
                <option value="square">Квадратне</option>
              </select>
            </label>
            <button class="mb-1 rounded-full border border-blush px-3 py-2 text-xs" @click="removeAt(model.gallery, i)">Видалити</button>
          </div>
        </div>
      </section>

      <!-- Invitation -->
      <section class="rounded-xl border border-olive-200 bg-ivory p-6">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="font-serif text-lg">Запрошення</h3>
          <button class="text-sm text-olive-700 hover:underline" @click="addParagraph">+ Абзац</button>
        </div>
        <AdminField v-model="model.invitation.heading" label="Заголовок" />
        <div class="mt-4 grid gap-3">
          <div v-for="(_, i) in model.invitation.paragraphs" :key="i" class="flex items-end gap-2">
            <AdminField v-model="model.invitation.paragraphs[i]" :label="`Абзац ${i + 1}`" textarea class="flex-1" />
            <button class="mb-1 rounded-full border border-blush px-3 py-2 text-xs" @click="removeAt(model.invitation.paragraphs, i)">✕</button>
          </div>
        </div>
      </section>

      <!-- Venue -->
      <section class="rounded-xl border border-olive-200 bg-ivory p-6">
        <h3 class="mb-4 font-serif text-lg">Місце проведення</h3>
        <div class="grid gap-6 lg:grid-cols-2">
          <div v-for="(place, pi) in [model.venue.banquet, model.venue.ceremony]" :key="pi" class="grid gap-3 rounded-lg bg-olive-50 p-4">
            <p class="text-xs font-semibold tracking-wide text-olive-700 uppercase">
              {{ pi === 0 ? 'Банкет' : 'Церемонія (лише для запрошених)' }}
            </p>
            <AdminField v-model="place.name" label="Назва" />
            <AdminField v-model="place.address" label="Адреса" />
            <AdminField v-model="place.timeLabel" label="Час" />
            <div class="grid grid-cols-2 gap-3">
              <AdminField v-model.number="place.lat" label="Широта" type="number" />
              <AdminField v-model.number="place.lng" label="Довгота" type="number" />
            </div>
            <AdminField v-model="place.googleMapsUrl" label="Google Maps (маршрут)" />
            <AdminField v-model="place.wazeUrl" label="Waze" />
          </div>
        </div>
      </section>

      <!-- Timeline -->
      <section class="rounded-xl border border-olive-200 bg-ivory p-6">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="font-serif text-lg">Програма дня</h3>
          <button class="text-sm text-olive-700 hover:underline" @click="addTimelineItem">+ Етап</button>
        </div>
        <div class="grid gap-3">
          <div
            v-for="(item, i) in model.timeline"
            :key="i"
            class="grid items-end gap-3 rounded-lg bg-olive-50 p-3 sm:grid-cols-[auto_1fr_2fr_1fr_auto_auto]"
          >
            <AdminField v-model="item.time" label="Час" />
            <AdminField v-model="item.title" label="Назва" />
            <AdminField v-model="item.description" label="Опис" />
            <AdminField v-model="item.icon" label="Іконка (ph:...)" />
            <label class="mb-1 flex items-center gap-2 text-xs text-cocoa" title="Показувати лише гостям, запрошеним на церемонію">
              <input v-model="item.ceremony" type="checkbox" class="h-4 w-4 accent-olive-600">
              Церемонія
            </label>
            <button class="mb-1 rounded-full border border-blush px-3 py-2 text-xs" @click="removeAt(model.timeline, i)">✕</button>
          </div>
        </div>
      </section>

      <!-- Dress code -->
      <section class="rounded-xl border border-olive-200 bg-ivory p-6">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="font-serif text-lg">Dress code</h3>
          <button class="text-sm text-olive-700 hover:underline" @click="addColor">+ Колір</button>
        </div>
        <AdminField v-model="model.dressCode.description" label="Опис" textarea />
        <div class="mt-4 flex flex-wrap gap-3">
          <div v-for="(color, i) in model.dressCode.colors" :key="i" class="flex items-center gap-2 rounded-lg bg-olive-50 p-2">
            <input v-model="color.hex" type="color" class="h-9 w-9 rounded border-0 bg-transparent">
            <input v-model="color.label" class="field-input w-28 py-1.5" placeholder="Назва">
            <button class="rounded-full border border-blush px-2 py-1 text-xs" @click="removeAt(model.dressCode.colors, i)">✕</button>
          </div>
        </div>
      </section>

      <!-- Guest chat -->
      <section class="rounded-xl border border-olive-200 bg-ivory p-6">
        <h3 class="mb-4 font-serif text-lg">Чат гостей</h3>
        <div class="grid gap-4">
          <AdminField v-model="model.guestChat.heading" label="Заголовок" />
          <AdminField v-model="model.guestChat.text" label="Текст" textarea />
          <div class="grid gap-4 sm:grid-cols-2">
            <AdminField v-model="model.guestChat.buttonLabel" label="Напис кнопки" />
            <AdminField v-model="model.guestChat.telegramUrl" label="Посилання (Telegram)" />
          </div>
        </div>
      </section>

      <!-- Footer + RSVP -->
      <section class="rounded-xl border border-olive-200 bg-ivory p-6">
        <h3 class="mb-4 font-serif text-lg">Футер та RSVP</h3>
        <div class="grid gap-4 sm:grid-cols-2">
          <AdminField v-model="model.footer.coordinatorName" label="Координатор" />
          <AdminField v-model="model.footer.phone" label="Телефон" />
          <AdminField v-model="model.footer.telegram" label="Telegram (@…)" />
          <AdminField v-model="model.footer.thankYou" label="Текст подяки" textarea />
          <AdminImageField v-model="model.footer.background" label="Фонове зображення футера" placeholder="URL або /images/…" class="sm:col-span-2" />
          <AdminField v-model="model.rsvp.deadline" label="Дедлайн RSVP (2026-09-01)" />
          <AdminField v-model="model.rsvp.deadlineLabel" label="Підпис дедлайну" />
          <AdminField v-model="model.rsvp.closedMessage" label="Текст після дедлайну" textarea class="sm:col-span-2" />
          <AdminField v-model="model.rsvp.giftQuestion" label="Питання про подарунок-книгу (у формі)" class="sm:col-span-2" />
          <AdminField v-model="model.rsvp.giftHint" label="Підказка під питанням про книгу" textarea class="sm:col-span-2" />
        </div>
      </section>
    </div>

    <!-- Sticky save bar -->
    <div class="fixed inset-x-0 bottom-0 z-20 border-t border-olive-200 bg-ivory/95 backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center justify-end gap-4 px-5 py-3">
        <span v-if="status === 'saved'" class="text-sm text-olive-700">Збережено ✓</span>
        <span v-else-if="status === 'error'" class="text-sm text-red-600">Помилка збереження</span>
        <AppButton :disabled="status === 'saving'" @click="save">
          <Icon name="ph:floppy-disk" class="h-4 w-4" />
          {{ status === 'saving' ? 'Зберігаємо…' : 'Зберегти зміни' }}
        </AppButton>
      </div>
    </div>
  </div>
</template>
