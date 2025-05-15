<script setup lang="ts">
const props = defineProps<{
  selectedIds: string[]
}>()
const emit = defineEmits(['deleted'])
const toast = useToast()

// estado de apertura del modal
const isOpen = ref(false)
const isDeleting = ref(false)

const confirmDelete = async () => {
  isDeleting.value = true
  try {
    const { success, message } = await $fetch('/api/profiles/delete', {
      method: 'DELETE',
      body: { ids: props.selectedIds }
    })
    toast.add({
      title: success ? 'Éxito' : 'Error',
      description: message,
      icon: success
        ? 'i-heroicons-check-circle'
        : 'i-heroicons-x-circle',
      color: success ? 'success' : 'error'
    })
    if (success) {
      emit('deleted')
      isOpen.value = false    // cierra el modal
    }
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.data?.message || 'Error al eliminar los perfiles',
      icon: 'i-heroicons-x-circle',
      color: 'error'
    })
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <!-- Botón que abre el modal -->
  <UButton color="red" :disabled="props.selectedIds.length === 0" @click="isOpen = true" class="mb-4">
    Eliminar seleccionados ({{ props.selectedIds.length }})
  </UButton>

  <!-- Modal correctamente enlazado -->
  <UModal v-model:open="isOpen" title="Eliminar perfiles" description="¿Quieres borrar estos perfiles?"
    :dismissible="false">
    <template #body>
      <p class="text-gray-600 dark:text-gray-300">
        Deseas eliminar {{ props.selectedIds.length }} perfiles seleccionados?
      </p>
      <div class="mt-4 flex justify-end gap-3">
        <!-- Ahora funciona -->
        <UButton color="gray" variant="ghost" :disabled="isDeleting" @click="isOpen = false">
          Cancelar
        </UButton>
        <UButton color="red" :loading="isDeleting" @click="confirmDelete">
          {{ isDeleting ? 'Eliminando...' : 'Confirmar' }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
