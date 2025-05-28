<template>
  <div class="space-y-6">
    <!-- Fila 1: tres métricas principales -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <UCard v-for="(item, i) in metricsList" :key="i">
        <template #header>
          <div class="flex items-center justify-between">
            <span>{{ item.title }}</span>
            <UIcon :name="item.icon" class="w-6 h-6 ml-2" />
          </div>
        </template>
        <div class="p-4 text-2xl font-semibold text-center">
          <div
            v-if="pending"
            class="animate-pulse text-transparent bg-gray-300 dark:bg-gray-700 rounded"
          >
            &nbsp;
          </div>
          <div v-else>
            {{ item.format(metrics) }}
          </div>
        </div>
      </UCard>
    </div>

    <!-- Fila 2: inventario -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      <UCard v-for="(item, i) in inventoryList" :key="i">
        <template #header>
          <div class="flex items-center justify-between">
            <span>{{ item.title }}</span>
            <UIcon :name="item.icon" class="w-6 h-6 ml-2" />
          </div>
        </template>
        <div class="p-4 text-2xl font-semibold text-center">
          <div
            v-if="pending"
            class="animate-pulse text-transparent bg-gray-300 dark:bg-gray-700 rounded"
          >
            &nbsp;
          </div>
          <div v-else>
            {{ item.format(metrics) }}
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useFetch } from "#app";

interface Metrics {
  totalAnimals: number;
  weightIncreasePercent: number;
  totalInsumos: number;
  lowStock: number;
  totalExpenses: number;
  totalSales: number;
}

const { data: mr, pending } = await useFetch<Metrics>(
  "/api/dashboard/metrics",
  { server: false }
);

const metrics = computed(
  () =>
    mr.value ?? {
      totalAnimals: 0,
      weightIncreasePercent: 0,
      totalInsumos: 0,
      lowStock: 0,
      totalExpenses: 0,
      totalSales: 0,
    }
);

function fmtNum(n: number) {
  return n.toLocaleString();
}
function fmtPct(n: number) {
  return `${n.toFixed(2)}%`;
}
function fmtMoney(n: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(n);
}

const metricsList = [
  {
    title: "Total de Animales",
    icon: "i-healthicons-animal-cow",
    format: (m: Metrics) => fmtNum(m.totalAnimals),
  },
  {
    title: "Incremento de Peso (Mensual)",
    icon: "i-healthicons-cardiogram-outline-24px",
    format: (m: Metrics) => fmtPct(m.weightIncreasePercent),
  },
  {
    title: "Ventas Totales",
    icon: "i-heroicons-currency-dollar-20-solid",
    format: (m: Metrics) => fmtMoney(m.totalSales),
  },
];

const inventoryList = [
  {
    title: "Total Insumos",
    icon: "i-healthicons-ui-menu-grid-outline",
    format: (m: Metrics) => fmtNum(m.totalInsumos),
  },
  {
    title: "Stock Bajo",
    icon: "i-heroicons-arrow-trending-down-16-solid",
    format: (m: Metrics) => fmtNum(m.lowStock),
  },
  {
    title: "Gastos Inventario",
    icon: "i-heroicons-currency-dollar-20-solid",
    format: (m: Metrics) => fmtMoney(m.totalExpenses),
  },
];
</script>
