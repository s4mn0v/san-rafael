<script setup lang="ts">
import { ref, watch } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { h, resolveComponent } from 'vue'

const table = ref()

const UButton = resolveComponent('UButton')
const UCheckbox = resolveComponent('UCheckbox')

type Provider = {
  id_proveedor: string
  nombre: string
  nombre_empresa: string
  telefono: string
  correo_empresa: string | null
  direccion: string | null
}

const data = ref<Provider[]>([])
const total = ref(0)
const isPending = ref(false)

const pagination = ref({
  pageIndex: 1,
  pageSize: 10
})

const fetchProviders = async () => {
  isPending.value = true
  try {
    const params = {
      page: pagination.value.pageIndex,
      pageSize: pagination.value.pageSize
    }
    const response = await $fetch('/api/providers/providers', { params }) as { proveedores: Provider[], total: number }
    data.value = response.proveedores
    total.value = response.total
  } catch (error) {
    console.error('Error fetching providers:', error)
  } finally {
    isPending.value = false
  }
}

watch([() => pagination.value.pageIndex, () => pagination.value.pageSize], fetchProviders)

// Carga inicial
fetchProviders()

const columns: TableColumn<Provider>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox, {
        modelValue: table.getIsSomePageRowsSelected()
          ? 'indeterminate'
          : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
          table.toggleAllPageRowsSelected(!!value),
        'aria-label': 'Select all'
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        modelValue: row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
        'aria-label': 'Select row'
      })
  },
  {
    id: 'expand',
    cell: ({ row }) =>
      h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        icon: 'i-lucide-chevron-down',
        square: true,
        'aria-label': 'Expand',
        ui: {
          leadingIcon: [
            'transition-transform',
            row.getIsExpanded() ? 'duration-200 rotate-180' : ''
          ]
        },
        onClick: () => row.toggleExpanded()
      })
  },
  {
    accessorKey: 'id_proveedor',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'ID Proveedor',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    }
  },
  
  {
    accessorKey: 'nombre_empresa',
    header: 'Empresa',
  },
  {
    accessorKey: 'telefono',
    header: 'Teléfono',
  },
  {
    accessorKey: 'correo_empresa',
    header: 'Email',
  },
  {
    accessorKey: 'direccion',
    header: 'Dirección',
  }
]

const expanded = ref({})
</script>

<template>
  <div class="w-full space-y-4 pb-4">
    <UTable v-model:expanded="expanded" ref="table" :data="data" :columns="columns" :loading="isPending" class="flex-1">
      <template #expanded="{ row }">
        <div class="grid grid-cols-2 gap-4 p-4">
          <UCard>
            
          </UCard>
          <div>
            <p><strong>ID Proveedor:</strong> {{ row.original.id_proveedor }}</p>
            <p><strong>Nombre:</strong> {{ row.original.nombre }}</p>
            <p><strong>Empresa:</strong> {{ row.original.nombre_empresa }}</p>
          </div>
          <div>
            <p><strong>Teléfono:</strong> {{ row.original.telefono }}</p>
            <p><strong>Email:</strong> {{ row.original.correo_empresa || 'No especificado' }}</p>
            <p><strong>Dirección:</strong> {{ row.original.direccion || 'No especificada' }}</p>
          </div>
        </div>
      </template>
    </UTable>

    <div class="px-4 py-3.5 border-t border-accented text-sm text-muted">
      {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} de
      {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} filas seleccionadas.
    </div>

    <div class="flex justify-center border-t border-default pt-4">
      <UPagination v-model:page="pagination.pageIndex" :items-per-page="pagination.pageSize" :total="total"
        @update:page="(newPage: number) => pagination.pageIndex = newPage" />
    </div>
  </div>
</template>