<template>
  <!-- Breadcrumb + Header -->
  <UBreadcrumb :items="items" />
  <div class="flex justify-between items-center mb-4">
    <h1 class="text-2xl font-semibold uppercase tracking-widest">Dashboard</h1>
    <NuxtLink to="/sales" class="text-blue-600 hover:underline">Ventas</NuxtLink>
  </div>

  <!-- Toggle Métricas / Gráficos -->
  <div class="flex gap-2 mb-4">
    <UButton :color="viewCharts ? 'secondary' : 'primary'" @click="viewCharts = false">
      Métricas
    </UButton>
    <UButton :color="viewCharts ? 'primary' : 'secondary'" @click="viewCharts = true">
      Gráficos
    </UButton>
  </div>

  <!-- VISTA MÉTRICAS -->
  <div v-if="!viewCharts">
    <!-- Tu bloque original de DashboardCards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
      <!-- ... Total Animales y Peso ... -->
      <DashboardCard title="Total de Animales" icon="i-healthicons-animal-cow">
        <div class="p-4 bg-[var(--color-m7)] dark:bg-[var(--color-m2)] rounded-2xl text-2xl font-semibold text-center">
          {{ pending ? "…" : metrics.totalAnimals }}
        </div>
      </DashboardCard>
      <DashboardCard title="Incremento de Peso (Mensual)" icon="i-healthicons-cardiogram-outline-24px">
        <div class="p-4 bg-[var(--color-m7)] dark:bg-[var(--color-m2)] rounded-2xl text-2xl font-semibold text-center">
          {{ pending ? "…" : weightPctDisplay }}
        </div>
      </DashboardCard>
    </div>

    <DashboardCard title="Control de Inventario">
      <div class="flex flex-col sm:flex-row gap-6 w-full">
        <!-- ... Total Insumos, Stock Bajo, Gastos ... -->
        <DashboardContainer title="Total Insumos" icon="i-healthicons-ui-menu-grid-outline" class="w-full">
          <div class="text-2xl font-semibold text-center">{{ pending ? "…" : metrics.totalInsumos }}</div>
        </DashboardContainer>
        <DashboardContainer title="Stock Bajo" icon="i-heroicons-arrow-trending-down-16-solid" class="w-full">
          <div class="text-2xl font-semibold text-center">{{ pending ? "…" : metrics.lowStock }}</div>
        </DashboardContainer>
        <DashboardContainer title="Gastos Inventario" icon="i-heroicons-currency-dollar-20-solid" class="w-full">
          <div class="text-2xl font-semibold text-center">{{ pending ? "…" : `$${metrics.totalExpenses.toLocaleString()}` }}</div>
        </DashboardContainer>
      </div>
    </DashboardCard>
  </div>

  <!-- VISTA GRÁFICOS -->
  <div v-else class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
      <!-- Gráfico 1: Animales & Peso -->
      <DashboardCard title="Animales y Peso" icon="i-heroicons-chart-bar">
        <div class="p-4 bg-[var(--color-m7)] dark:bg-[var(--color-m2)] rounded-2xl">
          <ClientOnly>
            <BarChart :data="animalBarData" :options="barOptions" />
          </ClientOnly>
        </div>
      </DashboardCard>

      <!-- Gráfico 2: Inventario & Gastos -->
      <DashboardCard title="Inventario y Gastos" icon="i-heroicons-chart-bar">
        <div class="p-4 bg-[var(--color-m7)] dark:bg-[var(--color-m2)] rounded-2xl">
          <ClientOnly>
            <BarChart :data="inventoryBarData" :options="barOptions" />
          </ClientOnly>
        </div>
      </DashboardCard>

      <!-- Gráfico 3: Solo Costos -->
      <DashboardCard title="Gastos Totales" icon="i-heroicons-currency-dollar-20-solid">
        <div class="p-4 bg-[var(--color-m7)] dark:bg-[var(--color-m2)] rounded-2xl">
          <ClientOnly>
            <BarChart :data="costBarData" :options="barOptions" />
          </ClientOnly>
        </div>
      </DashboardCard>
    </div>
  </div>

  <div v-if="error" class="mt-4 text-red-500">Error al cargar métricas: {{ error.message }}</div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "logged" });

import { ref, computed } from "vue";
import { useFetch } from "#app";
import type { BreadcrumbItem } from "@nuxt/ui";

// Chart.js + vue-chartjs
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Bar as BarChart } from "vue-chartjs";
import type { ChartData, ChartOptions } from "chart.js";

// 1) Registra Chart.js
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// 2) Breadcrumb
const items = ref<BreadcrumbItem[]>([
  { label: "Inicio", icon: "i-heroicons-home-solid", to: "/" },
]);

// 3) Interfaz de métricas
interface Metrics {
  totalAnimals: number;
  weightIncreasePercent: number;
  totalInsumos: number;
  lowStock: number;
  totalExpenses: number;
}

// 4) Fetch solo en cliente
const { data: mr, pending, error } = await useFetch<Metrics>(
  "/api/dashboard/metrics",
  { server: false }
);

// 5) Safe metrics
const metrics = computed(() => mr.value ?? {
  totalAnimals: 0,
  weightIncreasePercent: 0,
  totalInsumos: 0,
  lowStock: 0,
  totalExpenses: 0,
});

// 6) Porcentaje con 2 decimales
const weightPctDisplay = computed(() => `${metrics.value.weightIncreasePercent.toFixed(2)}%`);

// 7) Toggle vistas
const viewCharts = ref(false);

// 8) Opciones compartidas
const barOptions = {
  responsive: true,
  plugins: {
    legend: { position: "top" as const },
    title: { display: false },
  },
} as ChartOptions<"bar">;

// 9) Datos gráfico Animales & Peso
const animalBarData = computed<ChartData<"bar", number[], unknown>>(() => ({
  labels: ["Total Animales", "Peso ↑ (%)"],
  datasets: [{ label: "Valor", backgroundColor: "var(--color-primary)", data: [metrics.value.totalAnimals, metrics.value.weightIncreasePercent] }],
}));

// 10) Datos gráfico Inventario & Gastos
const inventoryBarData = computed<ChartData<"bar", number[], unknown>>(() => ({
  labels: ["Total Insumos", "Stock Bajo"],
  datasets: [{
    label: "Inventario",
    backgroundColor: "var(--color-primary)",
    data: [metrics.value.totalInsumos, metrics.value.lowStock],
  }],
}));

// 11) **Nuevo**: Datos gráfico Solo Costos
const costBarData = computed<ChartData<"bar", number[], unknown>>(() => ({
  labels: ["Gastos Totales"],
  datasets: [{ label: "Gastos", backgroundColor: "var(--color-primary)", data: [metrics.value.totalExpenses] }],
}));
</script>
