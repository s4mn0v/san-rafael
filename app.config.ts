export default defineAppConfig({
  ui: {
    colors: {
      primary: "zinc-800",
      neutral: "gray",
    },
    input: {
      slots: {
        base: "focus:border-transparent transition-all hover:shadow-md dark:text-[var(--color-m2)]",
      },
    },
    button: {
      slots: {
        base: "bg-[var(--color-m2)] text-white hover:bg-[var(--color-m5)] dark:bg-[var(--color-m7)] dark:text-[var(--color-m2)] dark:hover:bg-[var(--color-m2)] dark:hover:text-[var(--color-m7)] cursor-pointer",
      },
    },
    toast: {
      slots: {
        root: "bg-[var(--color-m2)] text-[var(--color-m7)] dark:bg-[var(--color-m7)] dark:text-[var(--color-m2)] border-0 ring-0",
        title: "text-[var(--color-m7)] dark:text-[var(--color-m2)]",
        close:
          "bg-[var(--color-m2)] text-[var(--color-m7)] hover:bg-[var(--color-m2)] dark:hover:bg-[var(--color-m7)] dark:bg-[var(--color-m7)] dark:text-[var(--color-m2)]",
      },
    },
  },
});
