<template>
  <div>
    <UBreadcrumb :items="items" />
    <h1 class="text-2xl font-bold my-4">Inventario</h1>
    <NuxtLink to="providers">Proveedores</NuxtLink>
    <Table :columns="columns" :data="inventarioItems" @refresh="handleRefresh" />
    
    <!-- Actualizar clases de color -->
    <div v-if="pending" class="mt-4 text-[var(--color-m2)] dark:text-[var(--color-m7)]">Cargando inventario...</div>
    <div v-if="error" class="mt-4 text-[var(--color-error-light)] dark:text-[var(--color-error-dark)]">Error: {{ error.message }}</div>
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Database } from '~/types/supabase'
import type { BreadcrumbItem } from '@nuxt/ui'

const items = ref<BreadcrumbItem[]>([
  {
    label: 'Inventario',
    icon: 'i-heroicons-clipboard-document-list',
    to: '/stock'
  }
])

type Inventario = Database['public']['Tables']['inventario']['Row'] & {
  proveedores: { nombre_empresa: string } | null
}

definePageMeta({
  layout: 'logged',
  middleware: 'role-guard'
});

// Fetch datos
const { data: resp, pending, error, refresh: fetchStock } = await useFetch<{
  inventario: Inventario[]
  total: number
  page: number
  pageSize: number
}>('/api/stock/stock', {
  params: { page: 1, pageSize: 1000 }
})

const handleRefresh = async () => {
  await fetchStock()
}

const inventarioItems = computed(() => resp.value?.inventario || [])

// Columnas de la tabla
const columns = ref<TableColumn<Inventario>[]>([
  { accessorKey: 'id_inventario', header: 'ID' },
  { accessorKey: 'tipo', header: 'Tipo' },
  { accessorKey: 'descripcion', header: 'Descripción' },
  {
    accessorKey: 'cantidad',
    header: 'Cantidad',
    cell: ({ row }) => `${row.getValue('cantidad')} unidades`
  },
  {
    accessorKey: 'precio',
    header: 'Precio',
    cell: ({ row }) => `$${Number(row.getValue('precio')).toLocaleString()}`
  },
  {
    header: 'Proveedor',
    cell: ({ row }) => row.original.proveedores?.nombre_empresa || 'N/A'
  }
])
</script>