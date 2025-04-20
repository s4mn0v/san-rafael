<!-- components/InfoItem.vue -->
<template>
  <div class="py-2">
    <strong class="block text-sm font-medium text-[var(--color-m2)] dark:text-[var(--color-m7)]">{{ label }}:</strong>
    <span class="text-[var(--color-m2)] dark:text-[var(--color-m6)]">
      <slot>{{ value || 'N/A' }}</slot>
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value?: string
}>()
</script>