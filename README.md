# Весільне запрошення — Дарʼя &amp; Олександр 🤍

Сучасний сайт-запрошення на весілля: анімований конверт, галерея, таймер, програма
дня, dress code, RSVP із базою даних, персональні запрошення для гостей та
адмін-панель (CMS) для редагування контенту.

## Технології

- **Nuxt 4** (SSR, node-server) · **Vue 3** `<script setup>` · **TypeScript**
- **Tailwind CSS v4** — дизайн-система «Ivory &amp; Light Olive»
- **SQLite + Drizzle ORM** — RSVP, гості, контент
- **@vueuse/motion** — reveal / fade / slide анімації (з підтримкою `prefers-reduced-motion`)
- **@nuxt/image** (WebP/AVIF), **@nuxt/fonts** (Cormorant Garamond, Inter, Great Vibes), **@nuxt/icon** (Phosphor)

## Можливості

- 💌 Анімований конверт із восковою печаткою (показується щоразу)
- 🖼 Галерея з lightbox (клавіатура + свайп на мобільному)
- ⏳ Живий зворотний відлік до дати
- 📍 Локації (Google Maps embed) + кнопки маршруту (Google &amp; Waze)
- 🗓 Кнопка «Додати в календар» (Google Calendar + `.ics`)
- 👗 Dress code палітрою кольорів
- ✅ RSVP-форма з валідацією → SQLite + сповіщення в Telegram
- 🎟 Персональні запрошення: `/?guest=<token>` — церемонія показується лише запрошеним
- 🛠 Адмін-панель `/admin`: перегляд RSVP + CSV-експорт, керування гостями, повне редагування контенту

## Локальний запуск

```bash
pnpm install
cp .env.example .env        # відредагуйте значення
pnpm db:migrate             # створити таблиці
pnpm db:seed                # заповнити дефолтним контентом
node scripts/generate-placeholders.mjs   # (за потреби) плейсхолдери фото + favicon
pnpm dev                    # http://localhost:3000
```

Адмінка: `http://localhost:3000/admin` (пароль — `NUXT_ADMIN_PASSWORD` з `.env`).

## Змінні середовища

Див. `.env.example`. Ключові:

| Змінна | Призначення |
| --- | --- |
| `NUXT_ADMIN_PASSWORD` | Пароль до `/admin` |
| `NUXT_SESSION_SECRET` | Секрет для підпису сесії (≥32 символи) |
| `NUXT_DATABASE_URL` | Шлях до файлу SQLite |
| `NUXT_TELEGRAM_BOT_TOKEN` / `NUXT_TELEGRAM_CHAT_ID` | Сповіщення про RSVP у Telegram (необовʼязково) |
| `NUXT_PUBLIC_SITE_URL` | Публічний URL (для OG-тегів і sitemap) |

## Редагування контенту

Увесь текст, дати, фото, програму, dress code та контакти можна змінювати у
**`/admin` → Контент сайту** — дані зберігаються в SQLite. Дефолтні значення для
першого запуску лежать у `config/wedding.config.ts`.

**Фото:** покладіть файли у `public/images/` і вкажіть шлях у полі галереї/Hero
(напр. `/images/gallery-1.jpg`). Плейсхолдери генерує `scripts/generate-placeholders.mjs`.

## Персональні запрошення

У **`/admin` → Гості** створіть гостя — згенерується персональне посилання
`https://ваш-домен/?guest=<token>`. Позначка «церемонія» відкриває блок церемонії
лише цьому гостю; спільне посилання (без токена) показує тільки банкет.

## Telegram-сповіщення про RSVP

1. Створіть бота через [@BotFather](https://t.me/BotFather) → отримайте `bot token`.
2. Дізнайтеся `chat id` (напр. через [@userinfobot](https://t.me/userinfobot)) — свій або групи.
3. Пропишіть `NUXT_TELEGRAM_BOT_TOKEN` і `NUXT_TELEGRAM_CHAT_ID`.

## Деплой (Railway)

1. Створіть сервіс із цього репозиторію — Railway підхопить `Dockerfile`.
2. Додайте **Volume**, змонтований у `/data` (там житиме `wedding.db`).
3. Задайте змінні середовища з таблиці вище (`NUXT_DATABASE_URL=/data/wedding.db`).
4. Деплой. Контейнер сам застосує міграції та сид, потім підніме сервер на `:3000`.

> SQLite вимагає постійного диска, тому платформи без persistent storage
> (звичайний Vercel/Cloudflare Pages) не підходять. Підійдуть Railway, Render,
> Fly.io або будь-який VPS.

## Корисні команди

```bash
pnpm dev            # розробка
pnpm build          # продакшн-збірка
pnpm preview        # локальний перегляд збірки
pnpm db:studio      # Drizzle Studio (перегляд БД)
pnpm db:generate    # згенерувати нову міграцію після зміни схеми
pnpm typecheck      # перевірка типів
```
