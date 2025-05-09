<script setup lang="ts">
import { ref, watch } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { h, resolveComponent } from 'vue'

const table = useTemplateRef('table')

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UCheckbox = resolveComponent('UCheckbox')

type Animal = {
  id_animal: string
  fecha_nacimiento: string
  fecha_fallecimiento: string | null
  raza: string
  tipo_animal: 'NOVILLO' | 'TERNERO' | 'TERNERA' | 'VACA' | 'TORO'
  peso_inicial: number
  peso_actual: number
  estado_salud: string
  venta: boolean
  id_reproduccion: string | null
}

const data = ref<Animal[]>([])
const total = ref(0)
const isPending = ref(false)

const pagination = ref({
  pageIndex: 1,
  pageSize: 10
})

const fetchAnimals = async () => {
  isPending.value = true
  try {
    const params = {
      page: pagination.value.pageIndex,
      pageSize: pagination.value.pageSize
    }
    const response = await $fetch('/api/animal/animals', { params })
    data.value = response.animals
    total.value = response.total
  } catch (error) {
    console.error('Error fetching animals:', error)
  } finally {
    isPending.value = false
  }
}

watch([() => pagination.value.pageIndex, () => pagination.value.pageSize], fetchAnimals)

// Carga inicial
fetchAnimals()

// Columnas se mantienen igual
const columns: TableColumn<Animal>[] = [
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
    accessorKey: 'id_animal',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Codigo Animal',
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
    accessorKey: 'fecha_nacimiento',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Fecha de Nacimiento',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    },
    cell: ({ row }) => new Date(row.getValue('fecha_nacimiento')).toLocaleDateString()
  },
  { accessorKey: 'raza', header: 'Raza' },
  { accessorKey: 'tipo_animal', header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Tipo',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    }, }
]

const expanded = ref({})
</script>

<template>
  <div class="w-full space-y-4 pb-4">
    <AnimalSearch />

    <UTable v-model:expanded="expanded" ref="table" :data="data" :columns="columns" :loading="isPending" class="flex-1">
      <template #expanded="{ row }">
        <p><strong>ID:</strong> {{ row.original.id_animal }}</p>
        <p><strong>Fecha de nacimiento:</strong> {{ row.original.fecha_nacimiento }}</p>
        <p><strong>Fexcha de fallecimiento:</strong> {{ row.original.fecha_fallecimiento || 'N/A' }}</p>
        <p><strong>Raza:</strong> {{ row.original.raza }}</p>
        <p><strong>Tipo:</strong> {{ row.original.tipo_animal }}</p>
        <p><strong>Peso inicial:</strong> {{ row.original.peso_inicial }}</p>
        <p><strong>Peso actual:</strong> {{ row.original.peso_actual }}</p>
        <p><strong>Estado de salud:</strong> {{ row.original.estado_salud }}</p>
        <p><strong>Venta:</strong> {{ row.original.venta }}</p>
        <p><strong>ID reproducción:</strong> {{ row.original.id_reproduccion }}</p>
      </template>
    </UTable>

    <div class="px-4 py-3.5 border-t border-accented text-sm text-muted">
      {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} de
      {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} filas seleccionadas.
    </div>

    <div class="flex justify-center border-t border-default pt-4">
      <UPagination v-model:page="pagination.pageIndex" :items-per-page="pagination.pageSize" :total="total"
        @update:page="(newPage) => pagination.pageIndex = newPage" />
    </div>
  </div>
</template>