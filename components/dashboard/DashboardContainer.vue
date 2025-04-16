<script setup lang="ts">
defineProps<{ title: string; icon?: string }>();
</script>

<template>
  <div class="bg-[var(--color-m2)] dark:bg-[var(--color-m2)] p-6 rounded-xl flex flex-col items-center">
    <div class="flex items-center justify-between w-full text-[var(--color-m7)] mb-2 uppercase tracking-widest gap-x-4">
      <span class="text-xs font-medium">{{ title }}</span>
      <UIcon v-if="icon" :name="icon" class="w-6 h-6 hidden md:block" />
    </div>
    <div class="w-full">
      <slot></slot>
    </div>
  </div>
</template>