<!-- components/animal/SaleInfoCard.vue -->
<template>
  <UCard class="mt-8 shadow-md print:shadow-none" :class="{ 'print:hidden': !show }">
    <template #header>
      <h2 class="text-xl font-bold">Información de Venta</h2>
    </template>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 print:grid print:grid-cols-2">
      <div>
        <label class="text-sm text-gray-500">Fecha de Venta</label>
        <p class="text-lg font-medium">{{ new Date(venta.fecha_venta).toLocaleDateString() }}</p>
      </div>
      <div>
        <label class="text-sm text-gray-500">Monto</label>
        <p class="text-lg font-medium">
          {{ venta.monto !== null
            ? new Intl.NumberFormat('es-CO', {
              style: 'currency',
              currency: 'COP',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }).format(venta.monto)
            : 'No especificado' }}
        </p>
      </div>
    </div>
    <div>
      <label class="text-sm text-gray-500">Notas</label>
      <p class="text-lg font-medium">{{ venta.notas || 'Sin notas' }}</p>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { Venta } from '~/types/animal'

defineProps({
  venta: {
    type: Object as () => Venta,
    required: true
  },
  show: {
    type: Boolean,
    default: true
  }
})
</script>