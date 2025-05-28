<script setup lang="ts">
const props = defineProps<{
  selectedIds: string[]
}>()
const emit = defineEmits(['deleted'])
const toast = useToast()

const isOpen = ref(false)
const isDeleting = ref(false)

const confirmDelete = async () => {
  isDeleting.value = true;
  try {
    const { success, message } = await $fetch('/api/animal/animals', {
      method: 'DELETE',
      body: { ids: props.selectedIds }
    });

    toast.add({
      title: 'Éxito',
      description: message,
      icon: 'i-heroicons-check-circle',
      color: 'success'
    });

    if (success) {
      emit('deleted');
      isOpen.value = false;
    }
  } catch (error: any) {
    const errorMessage = error.data?.statusMessage === '409'
      ? 'Algunos animales no pueden ser eliminados por tener relaciones genealógicas activas'
      : error.data?.message || 'Error al eliminar los animales';

    toast.add({
      title: 'Error',
      description: errorMessage,
      icon: 'i-heroicons-x-circle',
      color: 'error'
    });
  } finally {
    isDeleting.value = false;
  }
}
</script>

<template>
  <UButton color="error" :disabled="props.selectedIds.length === 0" @click="isOpen = true" class="mb-4">
    Eliminar seleccionados [{{ selectedIds.length }}]
  </UButton>

  <UModal v-model:open="isOpen" title="Eliminar animales" description="¿Confirmas la eliminación?" :dismissible="false">
    <template #body>
      <p class="text-red-500 dark:text-red-300">
        Vas a eliminar {{ selectedIds.length }} animales permanentemente
      </p>
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