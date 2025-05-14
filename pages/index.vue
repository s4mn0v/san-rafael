<!-- pages/index.vue -->
<template>
  <!-- Breadcrumb + Header -->
  <BreadNav :items="breadcrumbItems" />

  <div class="flex justify-between items-center mb-4">
    <h1
      class="text-2xl font-semibold uppercase tracking-widest text-gray-800 dark:text-white"
    >
      Dashboard
    </h1>
    <NuxtLink to="/sales" class="text-blue-600 hover:underline">
      Ventas
    </NuxtLink>
  </div>

  <!-- Toggle Métricas / Gráficos -->
  <div class="flex gap-2 mb-4">
    <UButton
      :color="!viewCharts ? 'primary' : 'secondary'"
      @click="viewCharts = false"
    >
      Métricas
    </UButton>
    <UButton
      :color="viewCharts ? 'primary' : 'secondary'"
      @click="viewCharts = true"
    >
      Gráficos
    </UButton>
  </div>

  <!-- VISTA MÉTRICAS -->
  <div v-if="!viewCharts">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
      <DashboardCard title="Total de Animales" icon="i-healthicons-animal-cow">
        <div
          class="text-2xl font-semibold text-center text-gray-800 dark:text-white"
        >
          {{ pending ? "…" : metrics.totalAnimals }}
        </div>
      </DashboardCard>

      <DashboardCard
        title="Incremento de Peso (Mensual)"
        icon="i-healthicons-cardiogram-outline-24px"
      >
        <div
          class="p-4 bg-[var(--color-m7)] dark:bg-[var(--color-m2)] rounded-2xl text-2xl font-semibold text-center text-gray-800 dark:text-white"
        >
          {{ pending ? "…" : weightPctDisplay }}
        </div>
      </DashboardCard>

      <DashboardCard
        title="Ventas Totales"
        icon="i-heroicons-currency-dollar-20-solid"
      >
        <div
          class="p-4 bg-[var(--color-m7)] dark:bg-[var(--color-m2)] rounded-2xl text-2xl font-semibold text-center text-gray-800 dark:text-white"
        >
          {{ pending ? "…" : `$${metrics.totalSales.toLocaleString()}` }}
        </div>
      </DashboardCard>
    </div>

    <DashboardCard title="Control de Inventario">
      <div class="flex flex-col sm:flex-row gap-6 w-full">
        <DashboardContainer
          title="Total Insumos"
          icon="i-healthicons-ui-menu-grid-outline"
          class="w-full"
        >
          <div
            class="text-2xl font-semibold text-center text-gray-800 dark:text-white"
          >
            {{ pending ? "…" : metrics.totalInsumos }}
          </div>
        </DashboardContainer>
        <DashboardContainer
          title="Stock Bajo"
          icon="i-heroicons-arrow-trending-down-16-solid"
          class="w-full"
        >
          <div
            class="text-2xl font-semibold text-center text-gray-800 dark:text-white"
          >
            {{ pending ? "…" : metrics.lowStock }}
          </div>
        </DashboardContainer>
        <DashboardContainer
          title="Gastos Inventario"
          icon="i-heroicons-currency-dollar-20-solid"
          class="w-full"
        >
          <div
            class="text-2xl font-semibold text-center text-gray-800 dark:text-white"
          >
            {{ pending ? "…" : `$${metrics.totalExpenses.toLocaleString()}` }}
          </div>
        </DashboardContainer>
      </div>
    </DashboardCard>
  </div>

  <!-- VISTA GRÁFICOS -->
  <div v-else class="space-y-6">
    <!-- Fila 1: tres gráficos -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <DashboardCard title="Animales y Peso" icon="i-heroicons-chart-bar">
        <div
          class="p-4 bg-[var(--color-m7)] dark:bg-[var(--color-m2)] rounded-2xl text-gray-800 dark:text-white"
        >
          <ClientOnly>
            <BarChart :data="animalBarData" :options="chartOptions" />
          </ClientOnly>
        </div>
      </DashboardCard>

      <DashboardCard title="Inventario y Gastos" icon="i-heroicons-chart-bar">
        <div
          class="p-4 bg-[var(--color-m7)] dark:bg-[var(--color-m2)] rounded-2xl text-gray-800 dark:text-white"
        >
          <ClientOnly>
            <BarChart :data="inventoryBarData" :options="chartOptions" />
          </ClientOnly>
        </div>
      </DashboardCard>

      <DashboardCard
        title="Gastos Totales"
        icon="i-heroicons-currency-dollar-20-solid"
      >
        <div
          class="p-4 bg-[var(--color-m7)] dark:bg-[var(--color-m2)] rounded-2xl text-gray-800 dark:text-white"
        >
          <ClientOnly>
            <BarChart :data="costBarData" :options="chartOptions" />
          </ClientOnly>
        </div>
      </DashboardCard>
    </div>

    <!-- Fila 2: ventas por animal y comparativa -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <DashboardCard title="Ventas por Animal" icon="i-heroicons-chart-bar">
        <div
          class="p-4 bg-[var(--color-m7)] dark:bg-[var(--color-m2)] rounded-2xl text-gray-800 dark:text-white"
        >
          <ClientOnly>
            <BarChart :data="salesBarData" :options="chartOptions" />
          </ClientOnly>
        </div>
      </DashboardCard>

      <DashboardCard
        title="Comparativa de Ventas"
        icon="i-heroicons-presentation-chart-line"
      >
        <div
          class="p-4 bg-[var(--color-m7)] dark:bg-[var(--color-m2)] rounded-2xl text-gray-800 dark:text-white"
        >
          <ClientOnly>
            <LineChart :data="salesLineData" :options="chartOptions" />
          </ClientOnly>
        </div>
      </DashboardCard>
    </div>
  </div>

  <div v-if="error" class="mt-4 text-red-500">
    Error al cargar métricas: {{ error.message }}
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "logged" });

import BreadNav from "~/components/navigation/BreadNav.vue";
import DashboardCard from "~/components/dashboard/DashboardCard.vue";
import DashboardContainer from "~/components/dashboard/DashboardContainer.vue";
import { useFetch } from "#app";
import type { BreadcrumbItem } from "@nuxt/ui";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js/auto";
import { Bar as BarChart, Line as LineChart } from "vue-chartjs";
import type { ChartData, ChartOptions } from "chart.js/auto";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);

// Breadcrumb
const breadcrumbItems: BreadcrumbItem[] = [
  { label: "Inicio", icon: "i-heroicons-home-solid", to: "/" },
];

// Fetch metrics
interface SalesPoint {
  animal_id: string;
  monto: number;
  fecha_venta: string;
}
interface Metrics {
  totalAnimals: number;
  weightIncreasePercent: number;
  totalInsumos: number;
  lowStock: number;
  totalExpenses: number;
  totalSales: number;
  salesData: SalesPoint[];
}

const {
  data: mr,
  pending,
  error,
} = await useFetch<Metrics>("/api/dashboard/metrics", { server: false });
const metrics = computed(
  () =>
    mr.value ?? {
      totalAnimals: 0,
      weightIncreasePercent: 0,
      totalInsumos: 0,
      lowStock: 0,
      totalExpenses: 0,
      totalSales: 0,
      salesData: [],
    }
);

const weightPctDisplay = computed(
  () => `${metrics.value.weightIncreasePercent.toFixed(2)}%`
);
const viewCharts = ref(false);

// Dark mode detector
const isDark = ref(false);
onMounted(() => {
  isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
});

// Sorted sales data
const sortedSales = computed(() =>
  [...metrics.value.salesData].sort(
    (a, b) =>
      new Date(a.fecha_venta).getTime() - new Date(b.fecha_venta).getTime()
  )
);

// Chart options
const chartOptions = computed<ChartOptions<any>>(() => ({
  responsive: true,
  plugins: { legend: { position: "top" } },
  datasets: {
    bar: { backgroundColor: isDark.value ? "#FFA500" : "var(--color-primary)" },
    line: {
      borderColor: isDark.value ? "#FFA500" : "var(--color-primary)",
      borderWidth: 2,
      pointBackgroundColor: isDark.value ? "#FFA500" : "var(--color-primary)",
      pointRadius: 6,
      pointHoverRadius: 8,
    },
  },
  scales: {
    x: { title: { display: true, text: "Categoría / Fecha" } },
    y: { title: { display: true, text: "Valor" } },
  },
}));

// Chart data generators
const animalBarData = computed<ChartData<"bar", number[]>>(() => ({
  labels: ["Total Animales", "Peso ↑ (%)"],
  datasets: [
    { data: [metrics.value.totalAnimals, metrics.value.weightIncreasePercent] },
  ],
}));
const inventoryBarData = computed<ChartData<"bar", number[]>>(() => ({
  labels: ["Total Insumos", "Stock Bajo"],
  datasets: [{ data: [metrics.value.totalInsumos, metrics.value.lowStock] }],
}));
const costBarData = computed<ChartData<"bar", number[]>>(() => ({
  labels: ["Gastos Totales"],
  datasets: [{ data: [metrics.value.totalExpenses] }],
}));
const salesBarData = computed<ChartData<"bar", number[]>>(() => ({
  labels: sortedSales.value.map((p) => p.animal_id),
  datasets: [{ data: sortedSales.value.map((p) => p.monto) }],
}));
const salesLineData = computed<ChartData<"line", number[], string>>(() => ({
  labels: sortedSales.value.map((p) =>
    new Date(p.fecha_venta).toLocaleDateString()
  ),
  datasets: [
    {
      label: "Ventas",
      data: sortedSales.value.map((p) => p.monto),
      fill: false,
    },
  ],
}));
</script>
