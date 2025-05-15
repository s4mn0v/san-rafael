<!-- pages/index.vue -->
<template>
  <BreadNav :items="breadcrumbItems" />

  <div class="flex justify-between items-center mb-6">
    <h1
      class="text-2xl font-semibold uppercase tracking-widest text-gray-800 dark:text-white"
    >
      Dashboard
    </h1>

  </div>

  <!-- Único Toggle Métricas / Gráficos -->
  <div class="flex gap-2 mb-8">
    <UButton
      :color="!viewCharts ? 'primary' : 'neutral'"
      @click="viewCharts = false"
    >
      Métricas
    </UButton>
    <UButton
      :color="viewCharts ? 'primary' : 'neutral'"
      @click="viewCharts = true"
    >
      Gráficos
    </UButton>
  </div>

  <!-- Aquí van las tarjetas -->
  <div v-if="!viewCharts">
    <!-- MetricsCards ya envuelve cada métrica en un <UCard> -->
    <MetricsCards />
  </div>
  <div v-else>
    <!-- StadisticCards ya envuelve cada gráfico en un <UCard> -->
    <StadisticCards />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { BreadcrumbItem } from "@nuxt/ui";
import BreadNav from "~/components/navigation/BreadNav.vue";
import MetricsCards from "~/components/dashboard/MetricsCards.vue";
import StadisticCards from "~/components/dashboard/StadisticCards.vue";


definePageMeta({ layout: "logged" });

const breadcrumbItems = ref<BreadcrumbItem[]>([
  {
    label: "Dashboard",
    icon: "i-healthicons-i-exam-multiple-choice-outline",
    to: "/",
  },

  
]);


// Control único de vista
const viewCharts = ref(false);
</script>
