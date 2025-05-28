<template>
  <BreadNav :items="breadcrumbItems" />

  <div class="flex justify-between items-center mb-6">
    <h1
      class="text-2xl font-semibold uppercase tracking-widest text-gray-800 dark:text-white"
    >
      Dashboard
    </h1>
  </div>

  <!-- Único Toggle Métricas / Gráficos / Ventas -->
  <div class="flex gap-2 mb-8">
    <UButton
      :color="currentView === 'metrics' ? 'primary' : 'neutral'"
      @click="currentView = 'metrics'"
    >
      Métricas
    </UButton>
    <UButton
      :color="currentView === 'charts' ? 'primary' : 'neutral'"
      @click="currentView = 'charts'"
    >
      Gráficos
    </UButton>
    <UButton
      :color="currentView === 'sales' ? 'primary' : 'neutral'"
      @click="currentView = 'sales'"
    >
      Ventas
    </UButton>
  </div>

  <!-- Contenido según la vista seleccionada -->
  <MetricsCards v-if="currentView === 'metrics'" />
  <StadisticCards v-if="currentView === 'charts'" />
  <SalesCharts v-if="currentView === 'sales'" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { BreadcrumbItem } from "@nuxt/ui";
import BreadNav from "~/components/navigation/BreadNav.vue";
import MetricsCards from "~/components/dashboard/MetricsCards.vue";
import StadisticCards from "~/components/dashboard/StadisticCards.vue";
import SalesCharts from "~/components/dashboard/SalesCharts.vue";

definePageMeta({ layout: "logged" });

const breadcrumbItems = ref<BreadcrumbItem[]>([
  {
    label: "Dashboard",
    icon: "i-healthicons-i-exam-multiple-choice-outline",
    to: "/",
  },
]);

// Control de vista con tres opciones
const currentView = ref('metrics');
</script>