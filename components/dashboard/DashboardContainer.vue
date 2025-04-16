<script setup lang="ts">
defineProps<{ title: string; icon?: string }>();
</script>

<template>
  <!-- Este es el contenedor individual con su propio fondo y estilos -->
  <div class="bg-[var(--color-m7)] dark:bg-[var(--color-m2)] p-4 rounded-2xl flex flex-col">
    <div class="flex items-center justify-between w-full text-[var(--color-m2)] dark:text-[var(--color-m7)] mb-2 uppercase tracking-widest gap-x-2">
      <span class="text-xs font-bold">{{ title }}</span>
      <UIcon v-if="icon" :name="icon" class="w-6 h-6 flex-shrink-0" />
    </div>
    <div class="w-full text-[var(--color-m2)] dark:text-[var(--color-m7)] text-left font-semibold">
      <slot />
    </div>
  </div>
</template>