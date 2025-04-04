export default defineNuxtConfig({
  compatibilityDate: "2025-03-23",

  devtools: { enabled: true },

  app: {
    head: {
      title: "La Leyenda De San Rafael",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      link: [{ rel: "icon", href: "/favicon.ico", sizes: "any" }],
    },
  },

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
    // Desactivar si se necista ver una pagina sin hacer login
    redirect: true,
    redirectOptions: {
      login: "/login",
      callback: "/callback",
      exclude: ["/about"],
    },
  },
});
