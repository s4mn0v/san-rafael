<script setup>
import { defineAsyncComponent } from "vue";
import { useState, useColorMode } from "#imports"; // Added useColorMode

// Initialize color mode
const colorMode = useColorMode();

// Carga VueApexCharts solo en el cliente
const VueApexCharts = defineAsyncComponent(() => import("vue3-apexcharts"));

// Datos del gráfico
const series = useState("chartSeries", () => [
  {
    name: "kg",
    data: [300, 200, 100, 300, 500, 400, 450, 300, 150, 320, 250, 120, 330, 240, 100],
  },
]);

// Configuración del gráfico
const chartOptions = useState("chartOptions", () => ({
  chart: {
    type: "bar",
    toolbar: { show: false },
    background: colorMode.value === "dark" ? "#ffffff" : "#ffffff", // Now using valid colorMode
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "100%",
      borderRadius: 100,
    },
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: [
      "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul",
      "Ago", "Sep", "Oct", "Nov", "Dic", "Ene", "Feb", "Mar"
    ],
  },
  yaxis: {
    labels: { style: { colors: "#ffffff" } },
  },
  grid: { show: false },
  colors: ["#ffffff"],
  tooltip: { enabled: true },
  theme: { mode: "dark" },
}));
</script>

<template>
  <ClientOnly>
    <VueApexCharts type="bar" :options="chartOptions" :series="series" height="300" />
    <template #fallback>
      <div>Cargando gráfico...</div>
    </template>
  </ClientOnly>
</template>