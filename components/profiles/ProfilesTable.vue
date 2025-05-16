<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { h, resolveComponent } from 'vue'
import type { Row } from '@tanstack/table-core'

const table = useTemplateRef('table')

const UButton = resolveComponent('UButton')
const UCheckbox = resolveComponent('UCheckbox')

type Profile = {
  id: string
  email: string
  name: string | null
  role: 'admin' | 'user'
}

const data = ref<Profile[]>([])
const total = ref(0)
const isPending = ref(false)

const pagination = ref({
  pageIndex: 1,
  pageSize: 10
})

const fetchProfiles = async () => {
  isPending.value = true
  try {
    const params = {
      page: pagination.value.pageIndex,
      pageSize: pagination.value.pageSize
    }
    const response = await $fetch('/api/profiles/profiles', { params }) as { profiles: Profile[], total: number }
    data.value = response.profiles
    total.value = response.total
  } catch (error) {
    console.error('Error fetching profiles:', error)
  } finally {
    isPending.value = false
  }
}

watch([() => pagination.value.pageIndex, () => pagination.value.pageSize], fetchProfiles)

// Carga inicial
fetchProfiles()

const columns: TableColumn<Profile>[] = [
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
    accessorKey: 'email',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Email',
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
    accessorKey: 'name',
    header: 'Nombre'
  },
  {
    accessorKey: 'role',
    header: 'Rol',
    cell: ({ row }) => row.original.role.toUpperCase()
  }
]

const expanded = ref({})

const selectedIds = ref<string[]>([])

// Añadir watch para selecciones
watch(
  () => table.value?.tableApi?.getSelectedRowModel().rows,
  (rows) => {
    selectedIds.value = rows?.map((row) => row.original.id) || []
  }
)

// Función para refrescar después de eliminar
const refreshTable = () => {
  table.value?.tableApi?.resetRowSelection()
  fetchProfiles()
}

defineExpose({
  fetchProfiles,
  tableApi: computed(() => table.value?.tableApi)
})
</script>

<template>
  <div class="w-full space-y-4 pb-4">
    <DeleteProfiles v-if="selectedIds.length > 0" :selected-ids="selectedIds" @deleted="refreshTable" />
    <UTable v-model:expanded="expanded" ref="table" :data="data" :columns="columns" :loading="isPending"
      :row-class="(row: Row<Profile>) => row.original.role"
      class="flex-1">
      <template #expanded="{ row }">
        <p><strong>ID:</strong> {{ row.original.id }}</p>
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