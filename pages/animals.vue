<script setup lang="ts">
import { ref, computed } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Animal } from '~/types/supabase'

const toast = useToast()

// Metadata
definePageMeta({
  layout: 'logged',
  middleware: 'role-guard'
})

// Estado de selección
const rowSelection = ref({})
const selectedAnimals = ref<Animal[]>([])
const isDeleting = ref(false)

// Fetch de animales
const { data: resp, pending, error, refresh: refreshAnimals } = await useFetch<{
  animals: Animal[]
  total: number
  page: number
  pageSize: number
}>('/api/animal/animals', {
  params: { page: 1, pageSize: 1000 }
})

// Lista de animales
const animals = computed(() => resp.value?.animals || [])

// Función para eliminar animales seleccionados
const deleteSelectedAnimals = async () => {
  if (!selectedAnimals.value.length || isDeleting.value) return

  try {
    isDeleting.value = true
    const ids = selectedAnimals.value.map(a => a.id_animal)

    const { toast: successToast } = await $fetch('/api/animal/animals', {
      method: 'DELETE',
      body: { ids }
    })

    // Mostrar notificación de éxito
    if (successToast) {
      toast.add({
        color: 'success',
        icon: 'i-heroicons-check-circle',
        title: successToast.message,
      })
    }

    await refreshAnimals()
    rowSelection.value = {}
    selectedAnimals.value = []
  } catch (err: any) {
    const errorData = err.data || {}
    // Mostrar notificación de error
    toast.add({
      color: 'error',
      icon: 'i-heroicons-exclamation-circle',
      title: errorData.toast?.message || 'Error inesperado al eliminar animales',
    })
  } finally {
    isDeleting.value = false
  }
}

// Columnas para la tabla
const columns = ref<TableColumn<Animal>[]>([
  { accessorKey: 'id_animal', header: 'ID' },
  {
    accessorKey: 'fecha_nacimiento',
    header: 'Fecha Nacimiento',
    cell: ({ row }) =>
      new Date(row.getValue('fecha_nacimiento')).toLocaleDateString('es-ES')
  },
  { accessorKey: 'raza', header: 'Raza' },
  { accessorKey: 'tipo_animal', header: 'Tipo' },
  {
    accessorKey: 'peso_actual',
    header: 'Peso Actual',
    cell: ({ row }) => `${row.getValue('peso_actual')} kg`
  },
  { accessorKey: 'estado_salud', header: 'Salud' }
])
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Animales</h1>
      <UButton v-if="selectedAnimals.length" color="error" @click="deleteSelectedAnimals" :disabled="isDeleting">
        <span v-if="!isDeleting">Eliminar ({{ selectedAnimals.length }})</span>
        <span v-else>Eliminando...</span>
      </UButton>
    </div>

    <div v-if="pending" class="mt-4 text-[var(--color-m2)] dark:text-[var(--color-m7)]">Cargando animales...</div>
    <Table :columns="columns" :data="animals" v-model:row-selection="rowSelection" @selected="selectedAnimals = $event"
      @refresh="refreshAnimals" />

    <div v-if="error" class="mt-4 text-red-500">Error al cargar: {{ error.message }}</div>
  </div>
</template>