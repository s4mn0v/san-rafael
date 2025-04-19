<!-- components/InfoItem.vue -->
<template>
  <div class="py-2">
    <strong class="block text-sm font-medium text-gray-700">{{ label }}:</strong>
    <span class="text-gray-900">
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