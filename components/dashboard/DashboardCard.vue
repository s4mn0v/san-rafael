<script setup lang="ts">
defineProps<{
  title: string;
  icon?: string;
}>();
</script>

<template>
  <div class="p-4 rounded-2xl shadow-md w-full dark:bg-[var(--color-m7)] bg-[var(--color-m2)]">
    <div class="flex justify-between items-center mb-2 text-[var(--color-m7)] dark:text-[var(--color-m2)]">
      <span class="text-sm font-semibold uppercase text-[var(--color-m7)] dark:text-[var(--color-m2)] tracking-widest">{{ title }}</span>
      <UIcon v-if="icon" :name="icon" class="w-8 h-8" />
    </div>
    <div class="p-2 bg-[var(--color-m2)] dark:bg-[var(--color-m2)] rounded-lg text-[var(--color-m7)] text-left text-4xl font-bold">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
</style>
