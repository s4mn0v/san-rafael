<!-- components/animal/DeleteAnimalCard.vue -->
<template>
  <UCard class="mt-8 shadow-md print:shadow-none bg-red-50 dark:bg-red-900/20">
    <template #header>
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-bold text-red-600 dark:text-red-300">Eliminar Animal</h2>
        <UButton v-if="userRole === 'admin'" icon="i-heroicons-trash" color="error" @click="confirmDelete"
          class="print:hidden" />
      </div>
    </template>

    <div class="space-y-2 text-red-700 dark:text-red-200">
      <p>Esta acción eliminará permanentemente:</p>
      <ul class="list-disc pl-6">
        <li>Registro principal del animal</li>
        <li>Historial de salud relacionado</li>
        <li>Información de venta asociada</li>
        <li>Registros genealógicos</li>
      </ul>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { useUserRole } from '~/composables/arestricted'

const { userRole } = useUserRole()
const toast = useToast()
const router = useRouter()
const route = useRoute()

const props = defineProps({
  animalId: {
    type: String,
    required: true
  }
})

const confirmDelete = () => {
  toast.add({
    title: '¿Eliminar permanentemente?',
    description: '¡Esta acción no se puede deshacer!',
    color: 'error',
    icon: 'i-heroicons-exclamation-triangle',
    actions: [{
      label: 'Confirmar eliminación',
      color: 'error',
      onClick: () => deleteAnimal()
    }],
    duration: 10000
  })
}

const deleteAnimal = async () => {
  try {
    await $fetch(`/api/animal/specific/${props.animalId}`, {
      method: 'DELETE'
    })

    toast.add({
      title: 'Eliminación exitosa',
      description: 'Todos los registros del animal han sido eliminados',
      color: 'success',
      icon: 'i-heroicons-check-circle'
    })

    router.push('/animals')
  } catch (error: any) {
    toast.add({
      title: 'Error al eliminar',
      description: error.data?.message || error.message,
      color: 'error',
      icon: 'i-heroicons-exclamation-circle'
    })
  }
}
</script>