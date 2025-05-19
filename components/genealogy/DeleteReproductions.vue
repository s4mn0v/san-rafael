<script setup lang="ts">
const props = defineProps<{
  selectedIds: number[] // Cambiado a number[] para id_reproduccion
}>()
const emit = defineEmits(['deleted'])
const toast = useToast()

const isOpen = ref(false)
const isDeleting = ref(false)

const confirmDelete = async () => {
  isDeleting.value = true
  try {
    const { success, message } = await $fetch<{ success: boolean; message: string }>('/api/reproduction/reproductions', {
      method: 'DELETE',
      body: { ids: props.selectedIds }
    })
    
    toast.add({
      title: success ? 'Éxito' : 'Error',
      description: message,
      icon: success ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle',
      color: success ? 'success' : 'error'
    })
    
    if (success) {
      emit('deleted')
      isOpen.value = false
    }
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.data?.message || 'Error al eliminar los registros',
      icon: 'i-heroicons-x-circle',
      color: 'error'
    })
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <UButton 
    color="error" 
    :disabled="selectedIds.length === 0" 
    @click="isOpen = true"
    class="mb-4"
  >
    Eliminar seleccionado(s) [{{ selectedIds.length }}]
  </UButton>

  <UModal 
    v-model:open="isOpen" 
    title="Eliminar registros de reproducción" 
    description="¿Confirmas la eliminación de estos registros?"
    :dismissible="false"
  >
    <template #body>
      <p class="text-[var(--color-custom-500)] dark:text-[var(--color-custom-50)]">
        Se eliminarán {{ selectedIds.length }} registros seleccionados
      </p>
      
      <div class="mt-4 flex justify-end gap-3">
        <UButton 
          color="neutral" 
          variant="ghost" 
          :disabled="isDeleting" 
          @click="isOpen = false"
        >
          Cancelar
        </UButton>
        
        <UButton 
          color="error" 
          :loading="isDeleting" 
          @click="confirmDelete"
        >
          {{ isDeleting ? 'Eliminando...' : 'Confirmar' }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>