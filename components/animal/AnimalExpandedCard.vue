<template>
  <UCard variant="subtle" class="w-full bg-[var(--color-custom-500)] dark:bg-transparent rounded-xl">
    <!-- HEADER -->
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-[var(--color-custom-50)]">Detalle del Animal</h3>
        <span class="text-sm text-[var(--color-custom-100)]">ID: {{ animal.id_animal }}</span>
      </div>
    </template>

    <!-- CUERPO: GRID DE PROPIEDADES -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
      <div>
        <p class="text-sm text-[var(--color-custom-300)]">Nacimiento</p>
        <p class="font-medium text-[var(--color-custom-50)]">{{ animal.fecha_nacimiento }}</p>
      </div>
      <div>
        <p class="text-sm text-[var(--color-custom-300)]">Fallecimiento</p>
        <p class="font-medium text-[var(--color-custom-50)]">
          {{ animal.fecha_fallecimiento || 'N/A' }}
        </p>
      </div>
      <div>
        <p class="text-sm text-[var(--color-custom-300)]">Raza</p>
        <p class="font-medium text-[var(--color-custom-50)]">{{ animal.raza }}</p>
      </div>
      <div>
        <p class="text-sm text-[var(--color-custom-300)]">Tipo</p>
        <p class="font-medium text-[var(--color-custom-50)]">{{ animal.tipo_animal }}</p>
      </div>
      <div>
        <p class="text-sm text-[var(--color-custom-300)]">Peso Inicial</p>
        <p class="font-medium text-[var(--color-custom-50)]">{{ animal.peso_inicial }} kg</p>
      </div>
      <div>
        <p class="text-sm text-[var(--color-custom-300)]">Peso Actual</p>
        <p class="font-medium text-[var(--color-custom-50)]">{{ animal.peso_actual }} kg</p>
      </div>
      <div class="sm:col-span-2">
        <p class="text-sm text-[var(--color-custom-300)]">Estado de Salud</p>
        <p class="font-medium text-[var(--color-custom-50)]">{{ animal.estado_salud }}</p>
      </div>
      <div>
        <p class="text-sm text-[var(--color-custom-300)]">Venta</p>
        <p class="font-medium">
          <span :class="{
            'text-green-600': animal.venta,
            'text-red-600': !animal.venta
          }">
            {{ animal.venta ? 'Disponible' : 'No disponible' }}
          </span>
        </p>
      </div>
      <div>
        <p class="text-sm text-[var(--color-custom-300)]">Reproducción</p>
        <p class="font-medium text-[var(--color-custom-50)]">{{ animal.id_reproduccion || '—' }}</p>
      </div>
    </div>

    <!-- FOOTER: ACCIONES -->
    <template #footer>
      <div class="flex justify-end space-x-2">
        <UButton color="success" variant="soft" icon="i-heroicons-pencil" size="md">Editar</UButton>
        <UButton color="error" variant="soft" icon="i-heroicons-trash" size="md">Eliminar</UButton>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { resolveComponent } from 'vue'
const UCard = resolveComponent('UCard')
const UButton = resolveComponent('UButton')

interface Animal {
  id_animal: string
  fecha_nacimiento: string
  fecha_fallecimiento: string | null
  raza: string
  tipo_animal: string
  peso_inicial: number
  peso_actual: number
  estado_salud: string
  venta: boolean
  id_reproduccion: string | null
}

defineProps<{ animal: Animal }>()
</script>
