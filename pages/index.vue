<template>
  <!-- Breadcrumb y título -->
  <UBreadcrumb :items="items" />
  <NuxtLink to="/sales">Ventas</NuxtLink>
  <h1 class="text-2xl font-semibold uppercase tracking-widest">Dashboard</h1>

  <!-- Primer bloque: Total de Animales e Incremento de Peso -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
    <DashboardCard title="Total de Animales" icon="i-healthicons-animal-cow">
      <div
        class="p-4 w-full bg-[var(--color-m7)] dark:bg-[var(--color-m2)] rounded-2xl text-2xl font-semibold"
      >
        {{ pending ? "…" : (metrics?.totalAnimals ?? 0) }}
      </div>
    </DashboardCard>

    <DashboardCard
      title="Incremento de Peso (Mensual)"
      icon="i-healthicons-cardiogram-outline-24px"
    >
      <div
        class="p-4 w-full bg-[var(--color-m7)] dark:bg-[var(--color-m2)] rounded-2xl text-2xl font-semibold"
      >
        {{ pending
          ? "…"
          : ((metrics?.weightIncreasePercent ?? 0).toFixed(2) + "%") }}
      </div>
    </DashboardCard>
  </div>

  <!-- Segundo bloque: Control de Inventario -->
  <DashboardCard title="Control de Inventario">
    <div class="flex flex-col sm:flex-row gap-6 w-full">
      <DashboardContainer
        title="Total Insumos"
        icon="i-healthicons-ui-menu-grid-outline"
        class="w-full"
      >
        <div class="text-2xl font-semibold">
          {{ pending ? "…" : (metrics?.totalInsumos ?? 0) }}
        </div>
      </DashboardContainer>

      <DashboardContainer
        title="Stock Bajo"
        icon="i-heroicons-arrow-trending-down-16-solid"
        class="w-full"
      >
        <div class="text-2xl font-semibold">
          {{ pending ? "…" : (metrics?.lowStock ?? 0) }}
        </div>
      </DashboardContainer>

      <DashboardContainer
        title="Gastos (30 D)"
        icon="i-heroicons-currency-dollar-20-solid"
        class="w-full"
      >
        <div class="text-2xl font-semibold">
          {{ pending
            ? "…"
            : ("$" + ((metrics?.totalExpenses ?? 0).toLocaleString())) }}
        </div>
      </DashboardContainer>
    </div>
  </DashboardCard>

  <div v-if="error" class="mt-4 text-red-500">
    Error al cargar métricas: {{ error.message }}
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { BreadcrumbItem } from "@nuxt/ui";

definePageMeta({ layout: "logged" });

const items = ref<BreadcrumbItem[]>([
  { label: "Inicio", icon: "i-heroicons-home-solid", to: "/" },
]);

// Interfaz de las métricas que devuelve tu endpoint
interface Metrics {
  totalAnimals: number;
  weightIncreasePercent: number;
  totalInsumos: number;
  lowStock: number;
  totalExpenses: number;
}

// Llama a tu endpoint de métricas
const { data: metrics, pending, error } = await useFetch<Metrics>(
  "/api/dashboard/metrics"
);
</script>
