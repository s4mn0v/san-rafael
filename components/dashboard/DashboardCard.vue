<script setup lang="ts">
defineProps<{
  title: string;
  icon?: string;
}>();
</script>

<template>
  <div class="dashboard-card">
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
.dashboard-card {
  @apply bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-md w-full dark:bg-[var(--color-m7)] bg-[var(--color-m2)];
}

.header {
  @apply flex justify-between items-center mb-4 text-[var(--color-m7)] dark:text-[var(--color-m2)];
}

.title {
  @apply text-sm font-semibold uppercase text-[var(--color-m7)] dark:text-[var(--color-m2)] tracking-widest;
}

.content {
  @apply p-2 bg-[var(--color-m2)] dark:bg-[var(--color-m2)] rounded-lg text-[var(--color-m7)] text-left text-4xl font-bold;
}

.content:has(.content-container) {
  @apply bg-transparent p-0;
}
</style>
