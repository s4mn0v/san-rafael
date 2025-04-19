<!-- components/ReportSection.vue -->
<template>
  <div class="mb-8">
    <h2 class="text-xl font-semibold mb-4 border-b pb-2">{{ title }}</h2>
    <div class="px-4">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>