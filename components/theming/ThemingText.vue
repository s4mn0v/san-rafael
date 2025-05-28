<script setup lang="ts">
const colorMode = useColorMode()
</script>

<template>
  <ClientOnly>
    <div class="flex items-center gap-2">
      <!-- Botón Modo Claro -->
      <UButton icon="i-heroicons-sun" label="Claro" variant="ghost" size="lg" :class="[
        colorMode.value === 'light'
          ? 'bg-[var(--color-custom-500)] text-[var(--color-custom-50)]  shadow-md'
          : 'opacity-50 hover:opacity-100 text-[var(--color-custom-600)]'
      ]" @click="colorMode.preference = 'light'" />

      <!-- Botón Modo Oscuro -->
      <UButton icon="i-heroicons-moon" label="Oscuro" variant="ghost" size="lg" :class="[
        colorMode.value === 'dark'
          ? 'bg-[var(--color-custom-50)] text-[var(--color-custom-600)] shadow-md'
          : 'opacity-50 hover:opacity-100 text-[var(--color-custom-50)]'
      ]" @click="colorMode.preference = 'dark'" />
    </div>
  </ClientOnly>
</template>
