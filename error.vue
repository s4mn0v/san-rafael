<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError
})
</script>

<template>
  <div class="bg-[var(--color-custom-50)] dark:bg-[var(--color-custom-500)] h-screen flex flex-col items-center justify-center gap-4 text-[var(--color-custom-500)] dark:text-[var(--color-custom-50)] space-y-4">
    <UIcon name="i-healthicons-death-alt-24px" class="text-9xl" />
    <h1 class="text-9xl font-mono">{{ error?.statusCode }}</h1>
    <UButton>
      <NuxtLink to="/">VOLVER</NuxtLink>
    </UButton>
  </div>
</template>
