export default defineAppConfig({
  ui: {
    colors: {
      primary: "zinc-800",
      neutral: "gray",
      color_1: "var(--color-m1)",
      color_2: "var(--color-m2)",
      color_3: "var(--color-m3)",
      color_4: "var(--color-m4)",
      color_5: "var(--color-m5)",
      color_6: "var(--color-m6)",
      color_7: "var(--color-m7)",
    },
    input: {
      slots: {
        base: "focus:border-transparent transition-all hover:shadow-md",
      },
    },
  },
});
