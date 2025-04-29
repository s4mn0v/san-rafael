export default defineNuxtConfig({
  compatibilityDate: "2025-03-23",

  devtools: { enabled: true },

  app: {
    head: {
      title: "La Leyenda De San Rafael",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      link: [
        { rel: "icon", href: "/favicon.ico", sizes: "any" },
        // Google Font
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "", // Boolean attribute 'crossorigin'
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&display=swap",
        },
      ],
    },
  },

  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith("UFormGroup"),
    },
  },

  // routeRules: {
  //   "/login": { ssr: false },
  // },

  modules: ["@nuxt/ui", "@nuxtjs/supabase"],

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

  // Config supabase conection
  supabase: {
    url: process.env.NUXT_SUPABASE_URL,
    key: process.env.NUXT_SUPABASE_KEY,
    serviceKey: process.env.NUXT_SUPABASE_SERVICE_KEY,
    redirect: true,
    redirectOptions: {
      login: "/login",
      callback: "/callback",
      exclude: ["/about"],
    },
  },

  build: {
    transpile: ["@vue-flow/core", "@vue-flow/additional-components"],
  },
});
