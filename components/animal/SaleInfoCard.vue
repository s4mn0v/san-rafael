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
    <UModal v-model:open="isEditModalOpen" title="Editar Información de Venta"
      description="Formulario para editar la venta.">
      <template #body>
        <UForm :state="editForm" @submit="handleEditSubmit" class="space-y-4">
          <div class="flex space-x-4">
            <UFormField name="fecha_venta" required>
              <template #label>
                <span class="text-[var(--color-custom-400)] dark:text-[var(--color-custom-100)]">Fecha de Venta</span>
              </template>
              <UInput type="date" v-model="editForm.fecha_venta" :max="new Date().toISOString().split('T')[0]" />
            </UFormField>

            <UFormField name="monto" required>
              <template #label>
                <span class="text-[var(--color-custom-400)] dark:text-[var(--color-custom-100)]">Monto</span>
              </template>
              <UInputNumber v-model="editForm.monto" :min="0" :step="0.01"
                :format-options="{ useGrouping: true, minimumFractionDigits: 0, maximumFractionDigits: 2 }"
                placeholder="Ingrese el monto" />
            </UFormField>
          </div>
          <UFormField name="notas" class="w-full">
            <template #label>
              <span class="text-[var(--color-custom-400)] dark:text-[var(--color-custom-100)]">Notas</span>
            </template>
            <UTextarea v-model="editForm.notas" :maxlength="200" class="w-full" />
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

const onlyAllowNumericInput = (event: KeyboardEvent) => {
  const allowedKeys = [
    'Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete',
    '.', '-', // decimal and negative sign if needed
  ]

  // Allow control keys
  if (
    allowedKeys.includes(event.key) ||
    (event.ctrlKey || event.metaKey) // for copy/paste
  ) {
    return
  }

  // Block non-numeric keys
  if (!/^\d$/.test(event.key)) {
    event.preventDefault()
  }
}

const preventInvalidPaste = (event: ClipboardEvent) => {
  const pasted = event.clipboardData?.getData('text') ?? ''
  if (!/^\d*\.?\d*$/.test(pasted)) {
    event.preventDefault()
  }
}

</script>