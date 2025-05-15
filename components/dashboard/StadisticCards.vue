<!-- components/dashboard/StadisticCards.vue -->
<template>
  <div>
    <!-- Fila 1: tres gráficos -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Card 1: Recursos por Animal -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <span>Recursos por Animal</span>
            <UIcon name="i-heroicons-chart-bar" class="w-6 h-6 ml-2" />
          </div>
        </template>
        <div class="h-64 p-4">
          <client-only>
            <Bar v-if="!pending" :data="animalBarData" :options="chartOptions" />
            <div v-else class="h-full animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg"/>
          </client-only>
        </div>
      </UCard>

      <!-- Card 2: Control de Inventario -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <span>Control de Inventario</span>
            <UIcon name="i-heroicons-chart-bar" class="w-6 h-6 ml-2" />
          </div>
        </template>
        <div class="h-64 p-4">
          <client-only>
            <Bar v-if="!pending" :data="inventoryBarData" :options="chartOptions" />
            <div v-else class="h-full animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg"/>
          </client-only>
        </div>
      </UCard>

      <!-- Card 3: Gastos Totales -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <span>Gastos Totales</span>
            <UIcon name="i-heroicons-currency-dollar-20-solid" class="w-6 h-6 ml-2" />
          </div>
        </template>
        <div class="h-64 p-4">
          <client-only>
            <Bar v-if="!pending" :data="costBarData" :options="chartOptions" />
            <div v-else class="h-full animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg"/>
          </client-only>
        </div>
      </UCard>
    </div>

    <!-- Fila 2: Ventas por Animal y Evolución -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <!-- Ventas por Animal -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <span>Ventas por Animal</span>
            <UIcon name="i-heroicons-chart-bar" class="w-6 h-6 ml-2" />
          </div>
        </template>
        <div class="h-64 p-4">
          <client-only>
            <Bar v-if="!pending" :data="salesBarData" :options="chartOptions" />
            <div v-else class="h-full animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg"/>
          </client-only>
        </div>
      </UCard>

      <!-- Evolución de Ventas -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <span>Evolución de Ventas</span>
            <UIcon name="i-heroicons-presentation-chart-line" class="w-6 h-6 ml-2" />
          </div>
        </template>
        <div class="h-64 p-4">
          <client-only>
            <Line v-if="!pending" :data="salesLineData" :options="chartOptions" />
            <div v-else class="h-full animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg"/>
          </client-only>
        </div>
      </UCard>
    </div>

    <div v-if="error" class="mt-4 text-red-500">
      Error al cargar gráficos: {{ error.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Bar, Line } from 'vue-chartjs'
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
} from 'chart.js'
import type { ChartOptions, ChartData } from 'chart.js'
import { useFetch } from '#app'

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
)

type SalesPoint = { animal_id: string; monto: number; fecha_venta?: string }

const { data: mr, pending, error } = await useFetch<{
  totalAnimals: number
  weightIncreasePercent: number
  totalInsumos: number
  lowStock: number
  totalExpenses: number
  totalSales: number
  salesData: SalesPoint[]
}>('/api/dashboard/metrics')

const metrics = computed(() => mr.value ?? {
  totalAnimals: 0,
  weightIncreasePercent: 0,
  totalInsumos: 0,
  lowStock: 0,
  totalExpenses: 0,
  totalSales: 0,
  salesData: []
})

const chartOptions = computed<ChartOptions<'bar' | 'line'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: { 
    legend: { 
      position: 'top',
      labels: {
        color: '#6B7280' // Color gris-500 para dark mode
      }
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          let label = context.dataset.label || ''
          if (label) label += ': '
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat('es-CL', {
              style: 'currency',
              currency: 'CLP'
            }).format(context.parsed.y)
          }
          return label
        }
      }
    }
  },
  scales: {
    x: { 
      ticks: {
        color: '#6B7280' // Color gris-500 para dark mode
      }
    },
    y: { 
      ticks: {
        color: '#6B7280', // Color gris-500 para dark mode
        callback: (value: string | number) => {
          const numValue = typeof value === 'string' ? parseFloat(value) : value
          return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            maximumFractionDigits: 0
          }).format(numValue)
        }
      }
    }
  }
}))

// Resto de las computed properties para los datos se mantienen igual
const animalBarData = computed<ChartData<'bar'>>(() => ({
  labels: ['Total Animales', 'Peso ↑ (%)'],
  datasets: [{ 
    label: 'Animales', 
    data: [metrics.value.totalAnimals, metrics.value.weightIncreasePercent],
    backgroundColor: ['#c3791b', '#c3791b']
  }]
}))

const inventoryBarData = computed<ChartData<'bar'>>(() => ({
  labels: ['Insumos Totales', 'Stock Bajo'],
  datasets: [{ 
    label: 'Inventario', 
    data: [metrics.value.totalInsumos, metrics.value.lowStock],
    backgroundColor: ['#c3791b', '#c3791b']
  }]
}))

const costBarData = computed<ChartData<'bar'>>(() => ({
  labels: ['Gastos Totales'],
  datasets: [{ 
    label: 'Gastos', 
    data: [metrics.value.totalExpenses],
    backgroundColor: '#c3791b'
  }]
}))

const salesBarData = computed<ChartData<'bar'>>(() => {
  const byAnimal = metrics.value.salesData.reduce((acc, s) => {
    acc[s.animal_id] = (acc[s.animal_id] || 0) + s.monto
    return acc
  }, {} as Record<string,number>)
  return { 
    labels: Object.keys(byAnimal), 
    datasets: [{
      label: 'Ventas por Animal',
      data: Object.values(byAnimal),
      backgroundColor: '#c3791b'
    }]
  }
})

const salesLineData = computed<ChartData<'line'>>(() => {
  const byDate = metrics.value.salesData.reduce((acc, s) => {
    const d = s.fecha_venta?.split('T')[0]!
    acc[d] = (acc[d] || 0) + s.monto
    return acc
  }, {} as Record<string,number>)
  const dates = Object.keys(byDate).sort()
  return { 
    labels: dates, 
    datasets: [{
      label: 'Ventas por Fecha',
      data: dates.map(d => byDate[d]),
      borderColor: '#c3791b',
      tension: 0.1,
      fill: false
    }]
  }
})
</script>