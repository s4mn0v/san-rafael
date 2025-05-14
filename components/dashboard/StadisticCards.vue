<template>
  <div>
    <!-- Toggle Métricas / Gráficos -->
    <div class="flex gap-2 mb-4">
      <UButton :color="!viewCharts ? 'primary' : 'secondary'" @click="viewCharts = false">
        Métricas
      </UButton>
      <UButton :color="viewCharts ? 'primary' : 'secondary'" @click="viewCharts = true">
        Gráficos
      </UButton>
    </div>

    <!-- VISTA GRÁFICOS -->
    <div v-if="viewCharts" class="space-y-6">
      <!-- Fila 1: tres gráficos -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Card 1 -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <span>
                Recursos por Animal
              </span>
              <UIcon name="i-heroicons-chart-bar" class="w-6 h-6 ml-2" />
            </div>
          </template>
          <div class="h-64 p-4">
            <ClientOnly>
              <Bar v-if="!pending" :data="animalBarData" :options="chartOptions" />
              <div v-else class="h-full animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg" />
            </ClientOnly>
          </div>
        </UCard>

        <!-- Card 2: Control Inventario -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <span>
                Control de Inventario
              </span>
              <UIcon name="i-heroicons-chart-bar" class="w-6 h-6 ml-2" />
            </div>
          </template>
          <div class="h-64 p-4">
            <ClientOnly>
              <Bar v-if="!pending" :data="inventoryBarData" :options="chartOptions" />
              <div v-else class="h-full animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg" />
            </ClientOnly>
          </div>
        </UCard>

        <!-- Card 3: Gastos Totales -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <span>
                Gastos Totales
              </span>
              <UIcon name="i-heroicons-currency-dollar-20-solid" class="w-6 h-6 ml-2" />
            </div>
          </template>
          <div class="h-64 p-4">
            <ClientOnly>
              <Bar v-if="!pending" :data="costBarData" :options="chartOptions" />
              <div v-else class="h-full animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg" />
            </ClientOnly>
          </div>
        </UCard>
      </div>

      <!-- Fila 2: ventas por animal y comparativa -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Card 4: Ventas por Animal -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between w-full">
              <span>
                Ventas por Animal
              </span>
              <UIcon name="i-heroicons-chart-bar" class="w-6 h-6 ml-2" />
            </div>
          </template>
          <div class="h-64 p-4">
            <ClientOnly>
              <Bar v-if="!pending" :data="salesBarData" :options="chartOptions" />
              <div v-else class="h-full animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg" />
            </ClientOnly>
          </div>
        </UCard>

        <!-- Card 5: Evolución de Ventas -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between w-full">
              <span>
                Evolución de Ventas
              </span>
              <UIcon name="i-heroicons-presentation-chart-line" class="w-6 h-6 ml-2" />
            </div>
          </template>
          <div class="h-64 p-4">
            <ClientOnly>
              <Line v-if="!pending" :data="salesLineData" :options="chartOptions" />
              <div v-else class="h-full animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg" />
            </ClientOnly>
          </div>
        </UCard>
      </div>
    </div>

    <div v-if="error" class="mt-4 text-red-500">
      Error al cargar gráficos: {{ error.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { Bar, Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  TimeSeriesScale
} from 'chart.js';
import type { ChartOptions, ChartData } from 'chart.js';
import { useFetch } from '#app';
import { UIcon } from '#components';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  TimeSeriesScale
);

type SalesData = {
  animal_id: string;
  monto: number;
  fecha_venta?: string;
};

const viewCharts = ref(false);
const { data: metrics, pending, error } = await useFetch<{
  totalAnimals: number;
  weightIncreasePercent: number;
  totalInsumos: number;
  lowStock: number;
  totalExpenses: number;
  totalSales: number;
  salesData: SalesData[];
}>('/api/dashboard/metrics');

// Configuración común para gráficos
const chartOptions = ref<ChartOptions<'bar' | 'line'>>({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          let label = context.dataset.label || '';
          if (label) label += ': ';
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat('es-CL', {
              style: 'currency',
              currency: 'CLP'
            }).format(context.parsed.y);
          }
          return label;
        }
      }
    }
  },
  scales: {
    x: {
      type: 'category',
    },
    y: {
      beginAtZero: true,
      type: 'linear',
      ticks: {
        callback: (value: string | number) => {
          const numValue = typeof value === 'string' ? parseFloat(value) : value;
          return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            maximumFractionDigits: 0
          }).format(numValue);
        }
      }
    }
  }
});

// Datos para gráficos
const animalBarData = computed<ChartData<'bar'>>(() => ({
  labels: ['Total Animales', 'Incremento de Peso'],
  datasets: [{
    label: 'Animales',
    data: [
      metrics.value?.totalAnimals || 0,
      metrics.value?.weightIncreasePercent || 0
    ],
    backgroundColor: ['#6366F1', '#10B981'],
  }]
}));

const inventoryBarData = computed<ChartData<'bar'>>(() => ({
  labels: ['Insumos Totales', 'Stock Bajo'],
  datasets: [{
    label: 'Inventario',
    data: [
      metrics.value?.totalInsumos || 0,
      metrics.value?.lowStock || 0
    ],
    backgroundColor: ['#3B82F6', '#EF4444'],
  }]
}));

const costBarData = computed<ChartData<'bar'>>(() => ({
  labels: ['Gastos Totales'],
  datasets: [{
    label: 'Gastos',
    data: [metrics.value?.totalExpenses || 0],
    backgroundColor: '#F59E0B',
  }]
}));

const salesBarData = computed<ChartData<'bar'>>(() => {
  if (!metrics.value?.salesData) return { labels: [], datasets: [] };

  const salesByAnimal = metrics.value.salesData.reduce((acc: Record<string, number>, sale) => {
    acc[sale.animal_id] = (acc[sale.animal_id] || 0) + sale.monto;
    return acc;
  }, {});

  return {
    labels: Object.keys(salesByAnimal),
    datasets: [{
      label: 'Ventas por Animal',
      data: Object.values(salesByAnimal),
      backgroundColor: '#4F46E5',
    }]
  };
});

const salesLineData = computed<ChartData<'line'>>(() => {
  if (!metrics.value?.salesData) return { labels: [], datasets: [] };

  const salesByDate = metrics.value.salesData.reduce((acc: Record<string, number>, sale) => {
    const date = sale.fecha_venta?.split('T')[0];
    if (date) acc[date] = (acc[date] || 0) + sale.monto;
    return acc;
  }, {});

  const sortedDates = Object.keys(salesByDate).sort();

  return {
    labels: sortedDates,
    datasets: [{
      label: 'Ventas por Fecha',
      data: sortedDates.map(date => salesByDate[date]),
      borderColor: '#10B981',
      tension: 0.1,
      fill: false
    }]
  };
});
</script>