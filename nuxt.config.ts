import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  future: { compatibilityVersion: 4 },

  devtools: { enabled: true },

  modules: [
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxt/fonts',
    '@vueuse/nuxt',
    '@vueuse/motion/nuxt',
  ],

  css: ['~/assets/css/main.css'],

  components: [{ path: '~/components', pathPrefix: false }],

  vite: {
    plugins: [tailwindcss()],
  },

  runtimeConfig: {
    // Server-only (override via .env)
    adminPassword: '',
    sessionSecret: '',
    databaseUrl: './server/db/data/wedding.db',
    telegramBotToken: '',
    telegramChatId: '',
    public: {
      siteUrl: 'http://localhost:3000',
    },
  },

  fonts: {
    // Ukrainian text needs the Cyrillic subset on every family.
    defaults: {
      subsets: ['cyrillic-ext', 'cyrillic', 'latin'],
      weights: [400, 500, 600],
    },
    families: [
      { name: 'Cormorant Garamond', provider: 'google', weights: [400, 500, 600] },
      { name: 'Inter', provider: 'google', weights: [300, 400, 500, 600] },
      { name: 'Great Vibes', provider: 'google', weights: [400] },
    ],
  },

  image: {
    format: ['avif', 'webp'],
    quality: 80,
  },

  icon: {
    mode: 'svg',
    serverBundle: 'local',
  },

  app: {
    head: {
      htmlAttrs: { lang: 'uk' },
      viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
      link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    },
  },

  nitro: {
    preset: 'node-server',
  },

  routeRules: {
    // Admin is an authenticated client-side app; never server-render it.
    '/admin/**': { ssr: false },
  },
})
