<!-- components/dashboard/DashboardCard.vue -->
<script setup lang="ts">
defineProps<{ title: string; icon?: string }>()
</script>

<template>
  <UCard :ui="{
    root: 'bg-[var(--color-m7)] dark:bg-[var(--color-m2)] rounded-2xl',
    body: 'p-4'
  }">
    <template #header>
      <div class="flex justify-between items-center">
        <span class="text-[var(--color-m2)] dark:text-[var(--color-m7)] font-bold">
          {{ title }}
        </span>
        <UIcon
          v-if="icon"
          :name="icon"
          class="w-10 h-10 text-[var(--color-m2)] dark:text-[var(--color-m7)]"
        />
      </div>
    </template>

    <div class="flex flex-col h-[calc(100%-4rem)] text-gray-800 dark:text-white text-left text-2xl font-bold">
      <slot/>
    </div>
  </UCard>
</template>
