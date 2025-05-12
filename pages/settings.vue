<template>
  <div class="h-screen flex items-center justify-center overflow-hidden">
    <div class="w-full max-w-sm sm:max-w-2xl mx-4 sm:mx-auto">
      <h1 class="text-3xl font-bold tracking-widest uppercase text-center mb-6">Ajustes</h1>
      <ProfileEditor />

      <UCard class="mt-6 bg-[var(--color-custom-500)] dark:bg-[var(--color-custom-50)]">
        <h2 class="text-lg font-semibold mb-4 text-[var(--color-custom-50)] dark:text-[var(--color-custom-500)]">Cambio
          de tema</h2>
        <ThemingText />
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'logged',
});
</script>