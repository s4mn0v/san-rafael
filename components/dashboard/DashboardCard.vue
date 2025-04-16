<script setup lang="ts">
defineProps<{
  title: string;
  icon?: string;
}>();
</script>

<template>
  <UCard :ui="{
    root: 'bg-[var(--color-m2)] dark:bg-[var(--color-m7)]',
    body: 'p-4',
    rounded: 'rounded-2xl',
  }">
    <template #header>
      <div class="flex justify-between items-center">
        <span class="text-[var(--color-m7)] dark:text-[var(--color-m2)] font-bold">
          {{ title }}
        </span>
        <UIcon v-if="icon" :name="icon" class="w-10 h-10 text-[var(--color-m7)] dark:text-[var(--color-m2)]" />
      </div>
    </template>

    <div class="rounded-2xl flex flex-col h-[calc(100%-4rem)] text-[var(--color-m2)] dark:text-[var(--color-m7)] text-left text-2xl font-bold">
      <slot />
    </div>

  </UCard>
</template>