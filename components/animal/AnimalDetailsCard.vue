<!-- components/animal/AnimalDetailsCard.vue -->
<template>
  <UCard class="shadow-lg print:shadow-none print:w-full print:mt-[-55px]" :class="{ 'print:hidden': !show }">
    <template #header>
      <h1 class="text-2xl">
        Animal: <span class="font-bold font-mono">{{ animal.id_animal }} </span>
      </h1>
    </template>

    <div class="grid md:grid-cols-2 gap-6 print:grid print:grid-cols-2">
      <!-- Columna Izquierda -->
      <div class="space-y-4">
        <div>
          <label class="text-sm font-medium text-[var(--color-custom-300)]">Fecha de Nacimiento</label>
          <p class="text-lg font-semibold">
            {{ new Date(animal.fecha_nacimiento).toLocaleDateString() }}
          </p>
        </div>

        <div>
          <label class="text-sm font-medium text-[var(--color-custom-300)]">Raza</label>
          <p class="text-lg font-semibold text-[var(--color-custom-500)]">
            {{ animal.raza }}
          </p>
        </div>

        <div>
          <label class="text-sm font-medium text-[var(--color-custom-300)]">Tipo</label>
          <p class="text-lg font-semibold text-[var(--color-custom-500)]">
            {{ animal.tipo_animal }}
          </p>
        </div>
      </div>

      <!-- Columna Derecha -->
      <div class="space-y-4">
        <div>
          <label class="text-sm font-medium text-[var(--color-custom-300)]">Peso Actual</label>
          <p class="text-2xl font-semibold">
            {{ animal.peso_actual }} kg
          </p>
        </div>

        <div>
          <label class="text-sm font-medium text-[var(--color-custom-300)]">Estado de Salud</label>
          <p class="text-lg font-semibold">
            {{ animal.estado_salud }}
          </p>
        </div>

        <div>
          <label class="text-sm font-medium text-[var(--color-custom-300)]">En Venta</label>
          <p class="text-lg font-semibold">
            {{ animal.venta ? 'Disponible para venta' : 'No disponible' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Sección Adicional -->
    <div class="mt-8 border-t pt-6">
      <div class="grid grid-cols-3 gap-4 text-center">
        <div>
          <label class="text-sm font-medium text-[var(--color-custom-300)]">Peso Inicial</label>
          <p class="text-lg font-semibold">{{ animal.peso_inicial }} kg</p>
        </div>

        <div>
          <label class="text-sm font-medium text-[var(--color-custom-300)]">ID Reproducción</label>
          <p class="text-lg font-semibold">
            {{ animal.id_reproduccion || 'N/A' }}
          </p>
        </div>

        <div>
          <label class="text-sm font-medium text-[var(--color-custom-300)]">Fecha Fallecimiento</label>
          <p class="text-lg font-semibold">
            {{ animal.fecha_fallecimiento
              ? new Date(animal.fecha_fallecimiento).toLocaleDateString()
              : 'N/A' }}
          </p>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { Animal } from '~/types/animal'

defineProps({
  animal: {
    type: Object as () => Animal,
    required: true
  },
  show: {
    type: Boolean,
    default: true
  }
})
</script>