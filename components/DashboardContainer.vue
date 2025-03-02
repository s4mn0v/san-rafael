<script setup lang="ts">
defineProps<{ title: string; icon?: string }>();
</script>

<template>
  <div class="container">
    <div class="header">
      <span class="title">{{ title }}</span>
      <UIcon v-if="icon" :name="icon" class="w-8 h-8" />
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.container {
  @apply bg-[var(--color-m2)] dark:bg-[var(--color-m2)] p-3 rounded-xl flex flex-col items-center px-6;
}

.header {
  @apply flex items-center justify-between w-full text-[var(--color-m7)] mb-3 uppercase tracking-widest;
}

.title {
  @apply text-xs font-medium;
}

.content {
  @apply w-full;
}
</style>
