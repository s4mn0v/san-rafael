export default defineAppConfig({
  ui: {
    breadcrumb: {
      variants: {
        active: {
          true: {
            link: "text-[var(--color-custom-50)] dark:text-[var(--color-custom-500)] font-semibold",
          },
          false: {
            link: "text-[var(--color-custom-300)] dark:text-[var(--color-custom-300)]",
          },
        },
      },
    },
    button: {
      variants: {
        color: {
          secondary: "bg-[var(--color-custom-50)] hover:bg-[var(--color-custom-300)] dark:bg-[var(--color-custom-500)] dark:hover:bg-[var(--color-custom-500)] dark:hover:shadow-lg text-[var(--color-custom-500)] dark:text-[var(--color-custom-50)]",
        },
        variant: {
          subtle: 'bg-[var(--color-custom-50)] dark:bg-[var(--color-custom-500)] text-[var(--color-custom-500)] dark:text-[var(--color-custom-50)]',
        }
      },
    },
  },
});
