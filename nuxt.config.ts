export default defineNuxtConfig({
  compatibilityDate: "2025-03-23",

  devtools: { enabled: true },

  app: {
    head: {
      viewport: "width=device-width, initial-scale=1",
      link: [{ rel: "icon", href: "/favicon.ico", sizes: "any" }],
    },
  },

  modules: ["@nuxt/ui"],

  css: ["~/assets/css/main.css"],

  colorMode: {
    preference: "dark",
  },

  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],

  // Variables de entorno públicas para Supabase
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY
    },
  },
  plugins: [
    '~/plugins/supabase.client.ts'
  ]
});