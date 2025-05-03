<script setup lang="ts">
import { h, ref, computed, watch } from 'vue'
import { useSupabaseUser } from '#imports'
import { getPaginationRowModel } from '@tanstack/vue-table'
import type { TableColumn, TableRow } from '@nuxt/ui'
import type { Table } from '@tanstack/vue-table'

const UCheckbox = resolveComponent('UCheckbox')

// Props
const props = defineProps<{
  columns: TableColumn<any>[]
  data: any[]  // Datos inyectados desde el padre
  rowSelection?: Record<string, boolean>
  isLoading?: boolean  // Estado de carga externo
}>()

// Emits
const emit = defineEmits(['update:rowSelection', 'selected', 'refresh'])

// Supabase
const user = useSupabaseUser()

// Estados internos
const globalFilter = ref<string>('')
const pagination = ref({ pageIndex: 0, pageSize: 10 })
const internalRowSelection = ref<Record<string, boolean>>(props.rowSelection || {})
const table = useTemplateRef<{ tableApi: Table<any> }>('table')

// Verificar estado listo
const isReady = computed(() => {
  return user.value !== null && !props.isLoading && props.data !== undefined
})

// Columnas con selección
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

// Datos filtrados
const filteredData = computed(() => {
  if (!isReady.value) return []
  const filter = globalFilter.value.toLowerCase()
  return props.data.filter((row) => {
    return Object.values(row).some((value) => {
      if (!value) return false
      return String(value).toLowerCase().includes(filter)
    })
  })
})

// Filas seleccionadas
const selectedRecords = computed<any[]>(() => {
  if (!isReady.value) return []
  const selected: TableRow<any>[] = table.value?.tableApi?.getFilteredSelectedRowModel().rows || []
  return selected.map((r: TableRow<any>): any => r.original)
})

// Watchers
watch(selectedRecords, (newVal) => {
  if (isReady.value) emit('selected', newVal)
})

watch(() => props.rowSelection, (newVal) => {
  internalRowSelection.value = newVal || {}
})

watch(internalRowSelection, (newVal) => {
  if (isReady.value) emit('update:rowSelection', newVal)
}, { deep: true })
</script>

<template>
  <div class="w-full">
    <!-- Estado de carga combinado -->
    <div v-if="!isReady" class="p-4 text-center text-gray-500">
      <UIcon name="i-heroicons-arrow-path-20-solid" class="animate-spin h-5 w-5 mr-2" />
      Cargando sesión y datos...
    </div>

    <!-- Contenido principal cuando está listo -->
    <div v-else>
      <!-- Pre visualización de selección -->
      <pre v-if="selectedRecords.length" class="p-4 mb-4 bg-gray-50 dark:bg-gray-800 text-sm overflow-auto rounded-lg">
        {{ JSON.stringify(selectedRecords, null, 2) }}
      </pre>

      <!-- Barra de búsqueda y controles -->
      <div class="flex items-center gap-2 px-4 py-3.5 border-b border-gray-200 dark:border-gray-700">
        <UInput 
          v-model="globalFilter" 
          placeholder="Buscar en todos los campos..." 
          icon="i-heroicons-magnifying-glass-20-solid"
          class="flex-1"
        />
        <UButton 
          icon="i-heroicons-arrow-path-20-solid" 
          color="gray" 
          @click="emit('refresh')"
        />
      </div>

      <!-- Tabla -->
      <div class="space-y-4 pb-4">
        <UTable 
          ref="table" 
          v-model:pagination="pagination" 
          v-model:row-selection="internalRowSelection" 
          :data="filteredData"
          :columns="computedColumns" 
          :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
          class="flex-1"
        />

        <!-- Paginación -->
        <div class="flex justify-center border-t border-gray-200 dark:border-gray-700 pt-4">
          <UPagination 
            v-model="pagination.pageIndex"
            :page-count="pagination.pageSize"
            :total="filteredData.length"
            :ui="{
              wrapper: 'flex items-center gap-1',
              rounded: '!rounded-none min-w-[32px] justify-center',
              default: {
                activeButton: {
                  variant: 'outline'
                }
              }
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>