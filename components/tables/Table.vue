<script setup lang="ts">
import { h, defineProps, ref, computed } from 'vue'
import { getPaginationRowModel } from '@tanstack/vue-table'
import type { TableColumn, TableRow } from '@nuxt/ui'
import type { Table } from '@tanstack/vue-table'

// Componente de checkbox (para selección)
import { resolveComponent } from 'vue'
const UCheckbox = resolveComponent('UCheckbox')

// Props: columnas y datos crudos
const props = defineProps<{
  columns: TableColumn<any>[]
  data: any[]
}>()

// Referencia al componente de tabla para acceder al API de tanstack
const table = useTemplateRef<{ tableApi: Table<any> }>('table')

// Estado del filtro global (búsqueda)
const globalFilter = ref<string>('')

// Estado de paginación
const pagination = ref({ pageIndex: 0, pageSize: 10 })

// Estado de selección de filas
const rowSelection = ref<Record<string, boolean>>({})

// Columnas computadas con columna de selección al inicio
const computedColumns = computed(() => {
  const selectColumn: TableColumn<any> = {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox, {
        modelValue: table.getIsSomePageRowsSelected() ? 'indeterminate' : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (v: boolean | 'indeterminate') => table.toggleAllPageRowsSelected(!!v),
        'aria-label': 'Select all'
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        modelValue: row.getIsSelected(),
        'onUpdate:modelValue': (v: boolean | 'indeterminate') => row.toggleSelected(!!v),
        'aria-label': 'Select row'
      })
  }
  return [selectColumn, ...props.columns]
})

// Filtro aplicado a los datos
const filteredData = computed(() => {
  const filter = globalFilter.value.toLowerCase()

  if (!filter) return props.data

  return props.data.filter((row) => {
    return Object.values(row).some((value) => {
      if (!value) return false
      return String(value).toLowerCase().includes(filter)
    })
  })
})

// Filas seleccionadas (para mostrar debajo como JSON)
const selectedRecords = computed<any[]>(() => {
  const selected: TableRow<any>[] = table.value?.tableApi?.getFilteredSelectedRowModel().rows || []
  return selected.map((r: TableRow<any>): any => r.original)
})
</script>

<template>
  <div class="w-full">
    <!-- Mostrar los registros seleccionados -->
    <pre class="p-4 mb-4 bg-(--ui-bg-muted) text-sm overflow-auto">
      {{ JSON.stringify(selectedRecords, null, 2) }}
    </pre>

    <!-- Campo de búsqueda -->
    <div class="flex px-4 py-3.5 border-b border-(--ui-border-accented)">
      <UInput v-model="globalFilter" class="max-w-sm" placeholder="Buscar..." />
    </div>

    <!-- Tabla con filtros, paginación, y selección -->
    <div class="space-y-4 pb-4">
      <UTable ref="table" v-model:pagination="pagination" v-model:row-selection="rowSelection" :data="filteredData"
        :columns="computedColumns" :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
        class="flex-1" />

      <!-- Controles de paginación -->
      <div class="flex justify-center border-t border-(--ui-border) pt-4">
        <UPagination :default-page="1" :items-per-page="pagination.pageSize" :total="filteredData.length"
          @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)" />
      </div>
    </div>
  </div>
</template>
