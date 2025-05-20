<!-- components/AnimalDetailCard.vue -->
<template>
  <UCard variant="subtle" class="w-full bg-[var(--color-custom-500)] dark:bg-transparent">
    <!-- HEADER -->
    <template #header>
      <div class="flex justify-between items-center">
        <h3 class="text-base font-semibold text-[var(--color-custom-50)]">
          Detalle Animal
        </h3>
        <span class="text-xs text-[var(--color-custom-100)]">
          #{{ animal.id_animal }}
        </span>
      </div>
    </template>

    <!-- CUERPO: GRID 4 COLUMNAS EN DESKTOP -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-3">
      <!-- Columna 1: Nacimiento -->
      <div class="flex flex-col">
        <span class="text-xs text-[var(--color-custom-300)]">Nacimiento</span>
        <span class="text-sm font-medium text-[var(--color-custom-50)]">
          {{ animal.fecha_nacimiento }}
        </span>
      </div>

      <!-- Columna 2: Fallecimiento -->
      <div class="flex flex-col">
        <span class="text-xs text-[var(--color-custom-300)]">Fallecimiento</span>
        <span class="text-sm font-medium text-[var(--color-custom-50)]">
          {{ animal.fecha_fallecimiento || 'N/A' }}
        </span>
      </div>

      <!-- Columna 3: Raza -->
      <div class="flex flex-col">
        <span class="text-xs text-[var(--color-custom-300)]">Raza</span>
        <span class="text-sm font-medium text-[var(--color-custom-50)]">
          {{ animal.raza }}
        </span>
      </div>

      <!-- Columna 4: Tipo -->
      <div class="flex flex-col">
        <span class="text-xs text-[var(--color-custom-300)]">Tipo</span>
        <span class="text-sm font-medium text-[var(--color-custom-50)]">
          {{ animal.tipo_animal }}
        </span>
      </div>

      <!-- Columna 5: Peso Inicial -->
      <div class="flex flex-col">
        <span class="text-xs text-[var(--color-custom-300)]">Peso Inicial</span>
        <span class="text-sm font-medium text-[var(--color-custom-50)]">
          {{ animal.peso_inicial }} kg
        </span>
      </div>

      <!-- Columna 6: Peso Actual -->
      <div class="flex flex-col">
        <span class="text-xs text-[var(--color-custom-300)]">Peso Actual</span>
        <span class="text-sm font-medium text-[var(--color-custom-50)]">
          {{ animal.peso_actual }} kg
        </span>
      </div>

      <!-- Columna 7: Estado de Salud -->
      <div class="flex flex-col">
        <span class="text-xs text-[var(--color-custom-300)]">Salud</span>
        <span class="text-sm font-medium text-[var(--color-custom-50)]">
          {{ animal.estado_salud }}
        </span>
      </div>

      <!-- Columna 8: Venta -->
      <div class="flex flex-col">
        <span class="text-xs text-[var(--color-custom-300)]">Venta</span>
        <span class="text-sm font-medium" :class="animal.venta ? 'text-green-500' : 'text-red-500'">
          {{ animal.venta ? 'Disponible' : 'No disponible' }}
        </span>
      </div>

      <!-- Columna 9 (span 4 cols on lg): Reproducción -->
      <div class="flex flex-col lg:col-span-4">
        <span class="text-xs text-[var(--color-custom-300)]">Reproducción</span>
        <span class="text-sm font-medium text-[var(--color-custom-50)]">
          {{ animal.id_reproduccion || '—' }}
          
        </span>
      </div>
    </div>

    <!-- FOOTER: ACCIONES -->
    <template #footer>
      <div class="flex justify-end space-x-2">
        <UButton size="sm" variant="ghost" color="success" icon="i-heroicons-pencil"
          @click="$emit('edit', animal.id_animal)" />
        <UButton size="sm" variant="ghost" color="error" icon="i-heroicons-trash" @click="isOpen = true" />
      </div>
    </template>
  </UCard>

  <!-- MODAL DE CONFIRMACIÓN -->
  <UModal v-model:open="isOpen" title="Eliminar Animal"
    description="¿Estás seguro de que deseas eliminar este registro?" :dismissible="false">
    <template #body>
      <p class="text-red-500 dark:text-red-400">
        Vas a eliminar el animal <strong>#{{ animal.id_animal }}</strong> de forma
        permanente. Esta acción eliminará permanentemente:
      </p>
      <ul class="list-disc list-inside text-red-400 dark:text-red-300">
        <li>Registro principal del animal</li>
        <li>Historial de salud relacionado</li>
        <li>Información de venta asociada</li>
        <li>Registros genealógicos</li>
      </ul>
      <div class="mt-4 flex justify-end gap-3">
        <UButton color="primary" variant="ghost" :disabled="isDeleting" @click="isOpen = false">
          Cancelar
        </UButton>
        <UButton color="error" :loading="isDeleting" @click="confirmDelete">
          {{ isDeleting ? 'Eliminando...' : 'Confirmar' }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { resolveComponent } from 'vue'

// Componentes de UI
const UCard = resolveComponent('UCard')
const UButton = resolveComponent('UButton')
const UModal = resolveComponent('UModal')

// Definición de la interfaz Animal
interface Animal {
  id_animal: string
  fecha_nacimiento: string
  fecha_fallecimiento: string | null
  raza: string
  tipo_animal: 'NOVILLO' | 'TERNERO' | 'TERNERA' | 'VACA' | 'TORO'
  peso_inicial: number
  peso_actual: number
  estado_salud: string
  venta: boolean
  id_reproduccion: string | null
}

// Props y emits
const props = defineProps<{ animal: Animal }>()
const emit = defineEmits<{
  (e: 'deleted', id: string): void
  (e: 'edit', id: string): void
}>()

// Estados locales
const toast = useToast()
const isOpen = ref(false)
const isDeleting = ref(false)

// Función para confirmar eliminación vía API y emitir evento
async function confirmDelete() {
  isDeleting.value = true
  try {
    // Llamada al endpoint DELETE sin modificar su lógica interna
    const { success, message } = await $fetch<{
      success: boolean
      message?: string
    }>(`/api/animal/specific/${props.animal.id_animal}`, {
      method: 'DELETE'
    })

    toast.add({
      title: success ? 'Eliminado' : 'Error',
      description:
        message ||
        (success
          ? 'Animal eliminado con éxito'
          : 'No se pudo eliminar el animal'),
      icon: success ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle',
      color: success ? 'success' : 'error'
    })

    if (success) {
      emit('deleted', props.animal.id_animal)
      isOpen.value = false
    }
  } catch (error: any) {
    const errMsg =
      error.data?.statusMessage === '409'
        ? 'No se puede eliminar: relaciones activas.'
        : error.data?.message || 'Error al eliminar.'
    toast.add({
      title: 'Error',
      description: errMsg,
      icon: 'i-heroicons-x-circle',
      color: 'error'
    })
  } finally {
    isDeleting.value = false
  }
}
</script>
