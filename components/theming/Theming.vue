<script setup lang="ts">
const colorMode = useColorMode()
const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})
</script>

<template>
  <ClientOnly>
    <UButton :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun'" variant="ghost"
      aria-label="Theme" @click="isDark = !isDark" size="xl" class="p-3 cursor-pointer text-[var(--color-custom-50)] dark:text-[var(--color-custom-500)]"
      :title="`Tema actual: ${colorMode.value}`" />
    <template #fallback>
      <div class="w-12 h-12" />
    </template>
  </ClientOnly>
</template>
