<template>
  <UBreadcrumb :items="items" />
  <div>
    <h1 class="text-2xl font-bold my-4">Proveedores</h1>
    <Table :columns="columns" :data="proveedores" @refresh="handleRefresh" />
    
    <!-- Actualizar clases de color -->
    <div v-if="pending" class="mt-4 text-[var(--color-m2)] dark:text-[var(--color-m7)]">Cargando proveedores...</div>
    <div v-if="error" class="mt-4 text-[var(--color-error-light)] dark:text-[var(--color-error-dark)]">Error: {{ error.message }}</div>
  </div>
</template>

<style scoped>
/* Estilos del componente */
</style>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Database } from '~/types/supabase'
type Proveedor = Database['public']['Tables']['proveedores']['Row']
import type { BreadcrumbItem } from '@nuxt/ui'

const items = ref<BreadcrumbItem[]>([
  {
    label: 'Inventario',
    icon: 'i-heroicons-clipboard-document-list',
    to: '/stock'
  },
  {
    label: 'Proveedores',
    icon: 'i-heroicons-truck',
    to: '/providers'
  }
])

const { data: resp, pending, error, refresh: fetchData } = await useFetch<{
  proveedores: Proveedor[]
  total: number
  page: number
  pageSize: number
}>('/api/provider/providers', {
  params: { page: 1, pageSize: 1000 }
})

const handleRefresh = async () => {
  await fetchData()
}

const proveedores = computed(() => resp.value?.proveedores || [])

// Columnas de la tabla
const columns = ref<TableColumn<Proveedor>[]>([
  { accessorKey: 'id_proveedor', header: 'ID Proveedor' },
  { accessorKey: 'nombre_empresa', header: 'Empresa' },
  { accessorKey: 'correo_empresa', header: 'Email' },
  { 
    accessorKey: 'telefono', 
    header: 'Teléfono',
    cell: ({ row }) => {
      const phone = row.getValue('telefono')
      return phone ? `+ ${phone}` : 'N/A'
    }
  },
  { accessorKey: 'direccion', header: 'Dirección' }
])

definePageMeta({
  layout: 'logged'
})
</script>