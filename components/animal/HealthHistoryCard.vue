<!-- components/animal/HealthHistoryCard.vue -->
<template>
  <UCard class="mt-8 shadow-md print:shadow-none" :class="{ 'print:hidden': !show }">
    <template #header>
      <h2 class="text-xl font-bold">Historial de Salud</h2>
    </template>

    <div v-if="historialSalud?.length" class="max-h-96 overflow-y-auto space-y-4 pr-2">
      <div v-for="registro in historialSalud" :key="registro.id_historial" class="border-b pb-4 last:border-b-0">
        <div class="flex justify-between items-start">
          <div class="space-y-1">
            <p class="font-semibold">{{ registro.descripcion }}</p>
            <p class="text-sm text-gray-500" v-if="registro.observaciones">
              {{ registro.observaciones }}
            </p>
          </div>
          <p class="text-sm text-gray-500 shrink-0 ml-4">
            {{ new Date(registro.fecha_evento).toLocaleDateString() }}
          </p>
        </div>
      </div>
    </div>

    <UAlert v-else title="Sin registros de salud" description="No se encontró historial médico para este animal"
      icon="i-heroicons-information-circle" color="warning" variant="subtle" />
  </UCard>
</template>

<script setup lang="ts">
import type { HistorialSalud } from '~/types/animal'

defineProps({
  historialSalud: {  // Nombre de prop corregido
    type: Array as () => HistorialSalud[],
    default: () => []
  },
  show: {
    type: Boolean,
    default: true
  }
})
</script>