export default defineAppConfig({
  ui: {
    colors: { primary: "zinc-800", neutral: "gray" },
    input: {
      slots: {
        base: "focus:border-transparent transition-all hover:shadow-md dark:text-[var(--color-m2)]",
      },
    },
    button: {
      slots: {
        base: "bg-[var(--color-m2)] text-white hover:bg-[var(--color-m5)] dark:bg-[var(--color-m7)] dark:text-[var(--color-m2)] dark:hover:bg-[var(--color-m5)] dark:hover:text-[var(--color-m2)] cursor-pointer",
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
    table: {
      slots: {
        root: "bg-[var(--color-m7)] text-[var(--color-m7)] dark:bg-[var(--color-m2)] dark:text-[var(--color-m2)] rounded-xl",
        thead: "uppercase tracking-widest mb-4",
        tr: "data-[selected=true]:bg-[var(--color-m6)]",
        td: "text-[var(--color-m2)] dark:text-[var(--color-m7)] tracking-wider font-medium",
      },
    },
    checkbox: {
      slots: {
        base: "text-[var(--color-m2)] dark:text-[var(--color-m7)] ring-[var(--color-m6)]",
      },
    },
    card: {
      slots: {
        root: "rounded-xl text-[var(--color-m7)] bg-[var(--color-m2)] dark:bg-[var(--color-m7)] dark:text-[var(--color-m7)]",
        header:
          "border-0 px-4 py-3 text-sm bg-[var(--color-m2)] dark:bg-[var(--color-m7)] font-medium uppercase tracking-widest text-[var(--color-m7)] dark:text-[var(--color-m2)] rounded-t-xl",
        body: "pt-0 bg-[var(--color-m2)] dark:bg-[var(--color-m7)] rounded-b-xl text-[var(--color-m7)] dark:text-[var(--color-m2)]",
      },
    },
  },
});
