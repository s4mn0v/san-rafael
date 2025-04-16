<script setup lang="ts">
defineProps<{ title: string; icon?: string }>();
</script>

<template>
  <div class="bg-[var(--color-m2)] dark:bg-[var(--color-m2)] p-3 rounded-xl flex flex-col items-center px-6">
    <div class="flex items-center justify-between w-full text-[var(--color-m7)] mb-3 uppercase tracking-widest">
      <span class="text-xs font-medium">{{ title }}</span>
      <UIcon v-if="icon" :name="icon" class="w-8 h-8" />
    </div>
    <div class="w-full">
      <slot></slot>
    </div>
  </div>
</template>