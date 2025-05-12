<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Agregar Información de Venta</h3>
      </template>

      <UForm :state="form" @submit="handleSubmit" class="space-y-6">
        <div class="flex space-x-4">
          <UFormField label="Fecha de Venta" name="fecha_venta" required>
            <UInput type="date" v-model="form.fecha_venta" />
          </UFormField>

          <UFormField label="Monto" name="monto" required>
            <UInput type="number" step="0.01" v-model="form.monto" />
          </UFormField>
        </div>

        <UFormField label="Notas" name="notas">
          <UTextarea v-model="form.notas" />
        </UFormField>

        <div class="flex justify-end gap-3 mt-4">
          <UButton type="button" @click="close">Cancelar</UButton>
          <UButton type="submit" :loading="isSubmitting">Guardar</UButton>
        </div>
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const props = defineProps({
  animalId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['submit'])

const isOpen = defineModel<boolean>({ default: false })
const isSubmitting = ref(false)
const form = reactive({
  fecha_venta: '',
  monto: null as number | null,
  notas: ''
})

const close = () => {
  isOpen.value = false
  resetForm()
}

const resetForm = () => {
  form.fecha_venta = ''
  form.monto = null
  form.notas = ''
}

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    await $fetch('/api/sales/sales', {
      method: 'POST',
      body: {
        animal_id: props.animalId,
        ...form
      }
    })

    emit('submit')
    close()
  } catch (error: any) {
    console.error('Error al registrar venta:', error)
    throw error
  } finally {
    isSubmitting.value = false
  }
}
</script>