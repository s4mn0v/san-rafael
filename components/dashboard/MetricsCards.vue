<!-- components/dashboard/MetricsCards.vue -->
<template>
  <div>
    <!-- Fila 1: tres métricas principales -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Card 1: Total de Animales -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <span>Total de Animales</span>
            <UIcon name="i-healthicons-animal-cow" class="w-6 h-6 ml-2" />
          </div>
        </template>
        <div class="p-4 text-2xl font-semibold text-center">
          <client-only>
            <span v-if="!pending">{{ metrics.totalAnimals }}</span>
            <div
              v-else
              class="mx-auto w-6 h-6 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-full"
            />
          </client-only>
        </div>
      </UCard>

      <!-- Card 2: Incremento de Peso (Mensual) -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <span>Incremento de Peso (Mensual)</span>
            <UIcon name="i-healthicons-cardiogram-outline-24px" class="w-6 h-6 ml-2" />
          </div>
        </template>
        <div class="p-4 text-2xl font-semibold text-center">
          <client-only>
            <span v-if="!pending">{{ weightPctDisplay }}</span>
            <div
              v-else
              class="mx-auto w-6 h-6 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-full"
            />
          </client-only>
        </div>
      </UCard>

      <!-- Card 3: Ventas Totales -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <span>Ventas Totales</span>
            <UIcon name="i-heroicons-currency-dollar-20-solid" class="w-6 h-6 ml-2" />
          </div>
        </template>
        <div class="p-4 text-2xl font-semibold text-center">
          <client-only>
            <span v-if="!pending">{{ formatCurrency(metrics.totalSales) }}</span>
            <div
              v-else
              class="mx-auto w-6 h-6 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-full"
            />
          </client-only>
        </div>
      </UCard>
    </div>

    <!-- Fila 2: métricas de inventario -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      <!-- Card 4: Total Insumos -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <span>Total Insumos</span>
            <UIcon name="i-healthicons-ui-menu-grid-outline" class="w-6 h-6 ml-2" />
          </div>
        </template>
        <div class="p-4 text-2xl font-semibold text-center">
          <client-only>
            <span v-if="!pending">{{ metrics.totalInsumos }}</span>
            <div
              v-else
              class="mx-auto w-6 h-6 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-full"
            />
          </client-only>
        </div>
      </UCard>

      <!-- Card 5: Stock Bajo -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <span>Stock Bajo</span>
            <UIcon name="i-heroicons-arrow-trending-down-16-solid" class="w-6 h-6 ml-2" />
          </div>
        </template>
        <div class="p-4 text-2xl font-semibold text-center">
          <client-only>
            <span v-if="!pending">{{ metrics.lowStock }}</span>
            <div
              v-else
              class="mx-auto w-6 h-6 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-full"
            />
          </client-only>
        </div>
      </UCard>

      <!-- Card 6: Gastos Inventario -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <span>Gastos Inventario</span>
            <UIcon name="i-heroicons-currency-dollar-20-solid" class="w-6 h-6 ml-2" />
          </div>
        </template>
        <div class="p-4 text-2xl font-semibold text-center">
          <client-only>
            <span v-if="!pending">{{ formatCurrency(metrics.totalExpenses) }}</span>
            <div
              v-else
              class="mx-auto w-6 h-6 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-full"
            />
          </client-only>
        </div>
      </UCard>
    </div>

    <div v-if="error" class="mt-4 text-red-500">
      Error al cargar métricas: {{ error.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFetch } from '#app'

interface SalesPoint { animal_id: string; monto: number; fecha_venta: string }
interface Metrics {
  totalAnimals: number
  weightIncreasePercent: number
  totalInsumos: number
  lowStock: number
  totalExpenses: number
  totalSales: number
  salesData: SalesPoint[]
}

const { data: mr, pending, error } = await useFetch<Metrics>(
  '/api/dashboard/metrics',
  { server: false }
)

const metrics = computed(() => mr.value ?? {
  totalAnimals: 0,
  weightIncreasePercent: 0,
  totalInsumos: 0,
  lowStock: 0,
  totalExpenses: 0,
  totalSales: 0,
  salesData: []
})

const weightPctDisplay = computed(
  () => `${metrics.value.weightIncreasePercent.toFixed(2)}%`
)

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(value)
}
</script>
