<script setup lang="ts">
import { useLogout } from '~/composables/useLogout'

const { logout } = useLogout()
</script>

<template>
  <ClientOnly>
    <UButton icon="i-heroicons-arrow-left-start-on-rectangle-16-solid" variant="ghost" aria-label="Theme"
      size="xl" class="p-3 cursor-pointer text-[var(--color-custom-50)] dark:text-[var(--color-custom-500)]" title="Cerrar Sesi&oacute;n" @click="logout">
    </UButton>
    <template #fallback>
      <div class="w-12 h-12" />
    </template>
  </ClientOnly>
</template>