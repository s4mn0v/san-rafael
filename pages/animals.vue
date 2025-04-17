<script setup lang="ts">
import { ref, computed } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Animal } from '~/types/supabase'

// Metadata
definePageMeta({
  layout: 'logged',
  middleware: 'role-guard'
})

// Fetch all animals (para paginación cliente)
const { data: resp, pending, error } = await useFetch<{
  animals: Animal[]
  total: number
  page: number
  pageSize: number
}>(
  '/api/animal/animals',
  { params: { page: 1, pageSize: 1000 } }
)

console.log('🐮 Animales recibidos:', resp.value)
// O bien, si quieres ver solamente el array:
console.log('🐮 Array de animales:', resp.value?.animals)

// Lista de animales
const animals = computed(() => resp.value?.animals || [])

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
  <h1 class="text-2xl font-bold mb-4">Animales</h1>
  <Table :columns="columns" :data="animals" />
  <div v-if="pending" class="mt-4 text-gray-500">Cargando animales...</div>
  <div v-if="error" class="mt-4 text-red-500">Error al cargar: {{ error.message }}</div>
</template>