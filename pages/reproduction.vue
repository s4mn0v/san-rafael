<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Registros de Reproducción</h1>
    <Table :columns="columns" :data="reproducciones" />
    <div v-if="pending" class="mt-4 text-gray-500">Cargando registros...</div>
    <div v-if="error" class="mt-4 text-red-500">Error: {{ error.message }}</div>
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Database } from '~/types/supabase'

type Reproduccion = Database['public']['Tables']['reproduccion']['Row'] & {
  madre: Database['public']['Tables']['animals']['Row'] | null
  padre: Database['public']['Tables']['animals']['Row'] | null
  descendencia: Database['public']['Tables']['animals']['Row'][]
}

definePageMeta({
  layout: 'logged',
  middleware: 'role-guard'
});

// Fetch datos
const { data: resp, pending, error } = await useFetch<{
  reproducciones: Reproduccion[]
  total: number
  page: number
  pageSize: number
}>('/api/reproduction/reproductions', {
  params: { page: 1, pageSize: 1000 }
})

const reproducciones = computed(() => resp.value?.reproducciones || [])

// Columnas de la tabla


const columns = ref<TableColumn<Reproduccion>[]>([
  { accessorKey: 'id_reproduccion', header: 'ID' },
  {
    header: 'Madre',
    cell: ({ row }) => row.original.madre
      ? `${row.original.madre.id_animal} (${row.original.madre.raza})`
      : 'N/A'
  },
  {
    header: 'Padre',
    cell: ({ row }) => row.original.padre
      ? `${row.original.padre.id_animal} (${row.original.padre.raza})`
      : 'N/A'
  },
  {
    header: 'Descendencia',
    cell: ({ row }) => row.original.descendencia
      .map(a => `${a.id_animal}`)
      .join(', ') || 'Sin registros'
  },
  {
    accessorKey: 'tipo_concepcion',
    header: 'Método',
    cell: ({ row }) => row.getValue('tipo_concepcion') === 'INSEMINACION'
      ? 'Inseminación'
      : 'Natural'
  },
  {
    accessorKey: 'fecha_evento',
    header: 'Fecha Evento',
    cell: ({ row }) => new Date(row.getValue('fecha_evento'))
      .toLocaleDateString('es-ES')
  },
  {
    accessorKey: 'raza',
    header: 'Raza Objetivo'
  }
])

</script>