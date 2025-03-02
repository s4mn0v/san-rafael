// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",

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
  
});
