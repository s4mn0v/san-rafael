<!-- components/animal/SaleInfoCard.vue -->
<template>
  <UCard class="mt-8 shadow-md print:shadow-none" :class="{ 'print:hidden': !show }">
    <template #header>
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-bold">Información de Venta</h2>
        <UButton v-if="userRole === 'admin'" icon="i-heroicons-pencil-square" @click="openEditModal"
          class="print:hidden bg-[var(--color-custom-50)] text-[var(--color-custom-500)] dark:bg-[var(--color-custom-500)] dark:text-[var(--color-custom-50)] rounded-full p-2" />
      </div>
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

    <!-- Modal de Edición -->
    <UModal v-model:open="isEditModalOpen" title="Editar Información de Venta" description="Formulario para editar la venta.">
      <template #body>
        <h3 class="text-lg font-semibold">Editar Información de Venta</h3>

        <UForm :state="editForm" @submit="handleEditSubmit" class="space-y-4">
          <UFormField label="Fecha de Venta" name="fecha_venta" required>
            <UInput type="date" v-model="editForm.fecha_venta" :max="new Date().toISOString().split('T')[0]" />
          </UFormField>

          <UFormField label="Monto" name="monto" required>
            <UInput type="number" step="0.01" v-model="editForm.monto" min="0" />
          </UFormField>

          <UFormField label="Notas" name="notas">
            <UTextarea v-model="editForm.notas" />
          </UFormField>

          <div class="flex justify-end gap-3 mt-4">
            <UButton type="button" @click="isEditModalOpen = false">Cancelar</UButton>
            <UButton type="submit" :loading="isSubmitting">Guardar Cambios</UButton>
          </div>
        </UForm>
      </template>
    </UModal>
  </UCard>
</template>

<script setup lang="ts">
import type { Venta } from '~/types/animal'
import { useUserRole } from '~/composables/arestricted'

const { userRole } = useUserRole()
const toast = useToast()

const props = defineProps({
  venta: {
    type: Object as () => Venta,
    required: true
  },
  show: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['updated'])

// Estado del modal y formulario
const isEditModalOpen = ref(false)
const isSubmitting = ref(false)
const editForm = reactive({
  fecha_venta: '',
  monto: null as number | null,
  notas: ''
})

// Abrir modal y cargar datos
const openEditModal = () => {
  editForm.fecha_venta = new Date(props.venta.fecha_venta).toISOString().split('T')[0]
  editForm.monto = props.venta.monto
  editForm.notas = props.venta.notas || ''
  isEditModalOpen.value = true
}

// Manejar envío del formulario
const handleEditSubmit = async () => {
  isSubmitting.value = true
  try {
    const response = await $fetch(`/api/sales/specific/${props.venta.id_venta}`, {
      method: 'PUT',
      body: editForm
    })

    emit('updated', response.venta)
    isEditModalOpen.value = false

    toast.add({
      title: 'Actualización exitosa',
      description: 'La información de venta se actualizó correctamente',
      color: 'success',
      icon: 'i-heroicons-check-circle'
    })
  } catch (error: any) {
    toast.add({
      title: 'Error al actualizar',
      description: error.data?.message || error.message,
      color: 'error',
      icon: 'i-heroicons-exclamation-circle'
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>