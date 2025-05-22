<template>
  <UDrawer title="Estadísticas" description="Estadísticas de stock" direction="right" :inset="true">
    <UButton title="Abrir estadísticas" color="neutral" trailing-icon="i-heroicons-chart-bar-16-solid" />

    <template #body>
      <div class="p-6 flex flex-col min-h-screen rounded-xl space-y-4">
        <UCard v-for="(item, i) in inventoryList" :key="i"
          class="rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 bg-[var(--color-custom-500)] dark:bg-[var(--color-custom-50)] border border-gray-200 dark:border-gray-700">
          <template #header>
            <div class="flex items-center justify-between">
              <span class="text-lg font-medium">{{ item.title }}</span>
              <UIcon :name="item.icon" class="w-6 h-6" />
            </div>
          </template>
          <div class="text-center">
            <div v-if="pending" class="h-8 w-3/4 mx-auto animate-pulse rounded"></div>
            <div v-else class="text-2xl font-bold">
              {{ item.format(metrics) }}
            </div>
          </div>
        </UCard>
      </div>
    </template>
  </UDrawer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useFetch } from '#app';

interface Metrics {
  totalInsumos: number;
  lowStock: number;
  totalExpenses: number;
}

const { data: mr, pending } = await useFetch<Metrics>(
  '/api/dashboard/metrics',
  { lazy: false }
);

const metrics = computed(
  () =>
    mr.value ?? {
      totalInsumos: 0,
      lowStock: 0,
      totalExpenses: 0,
    }
);

function fmtNum(n: number) {
  return n.toLocaleString();
}

function fmtMoney(n: number) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(n);
}

const inventoryList = [
  {
    title: 'Total Insumos',
    icon: 'i-healthicons-ui-menu-grid-outline',
    format: (m: Metrics) => fmtNum(m.totalInsumos),
  },
  {
    title: 'Stock Bajo',
    icon: 'i-heroicons-arrow-trending-down-16-solid',
    format: (m: Metrics) => fmtNum(m.lowStock),
  },
  {
    title: 'Gastos Inv.',
    icon: 'i-heroicons-currency-dollar-20-solid',
    format: (m: Metrics) => fmtMoney(m.totalExpenses),
  },
];
</script>
