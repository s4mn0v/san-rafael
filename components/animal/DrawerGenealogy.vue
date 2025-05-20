<template>
  <UDrawer v-model:open="drawerOpen" direction="right">
    <UButton
      label="Open"
      color="neutral"
      variant="subtle"
      trailing-icon="i-lucide-chevron-up"
      @click="drawerOpen = true"
    />

    <template #content>
      <div class="flex-1 w-full">
        <!-- Filtro -->
        <div class="flex px-4 py-3.5 border-b border-accented">
          <UInput
            v-model="globalFilter"
            class="max-w-sm"
            placeholder="Filtrar..."
          />
        </div>

        <!-- Tabla de reproducciones -->
        <UTable
          ref="table"
          v-model:row-selection="rowSelection"
          v-model:global-filter="globalFilter"
          :data="reproducciones"
          :columns="columns"
          :loading="pending"
        />

        <!-- Pie: contador y paginación -->
        <div class="px-4 py-3.5 border-t border-accented text-sm text-muted flex justify-between items-center">
          <div>
            {{ selectedRows.length }} de {{ total }} reproducción(es) seleccionada(s)
          </div>
          <UPagination
            :page="page"
            :page-size="pageSize"
            :total="total"
            @update:page="onPageChange"
            @update:page-size="onPageSizeChange"
          />
        </div>

        <!-- Botón de acción -->
        <UButton
          v-if="selectedRows.length === 1"
          label="Seleccionar reproducción"
          color="primary"
          @click="onSelectReproduccion"
        />
      </div>
    </template>
  </UDrawer>
</template>

<script setup lang="ts">
import { h, resolveComponent, computed, ref } from 'vue'
import { useFetch } from '#app'
import type { TableColumn } from '@nuxt/ui'
import type { Database } from '~/types/supabase'

// — props y emits para v-model y evento select — 
const props = defineProps<{ modelValue: boolean }>()
const emit  = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'select', item: Database['public']['Tables']['reproduccion']['Row']): void
}>()

const drawerOpen = computed({
  get: () => props.modelValue,
  set: v   => emit('update:modelValue', v)
})

// — tipo de fila — 
type Reproduccion = Database['public']['Tables']['reproduccion']['Row']

// — componentes U — 
const UCheckbox   = resolveComponent('UCheckbox')
const UPagination = resolveComponent('UPagination')

// — estado reactivo — 
const page         = ref(1)
const pageSize     = ref(10)
const globalFilter = ref('')
const rowSelection = ref<Record<string, boolean>>({})

// — fetch datos — 
const { data, pending } = useFetch<{
  reproducciones: Reproduccion[]
  total: number
}>(() => `/api/reproduction/reproductions?page=${page.value}&pageSize=${pageSize.value}`)

const reproducciones = computed(() => data.value?.reproducciones || [])
const total          = computed(() => data.value?.total || 0)

// — columnas, incluyendo la columna de id — 
const columns: TableColumn<Reproduccion>[] = [
  {
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
  },
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'madre_id', header: 'Madre' },
  { accessorKey: 'padre_id', header: 'Padre' },
  { accessorKey: 'tipo_concepcion', header: 'Tipo de Concepción' }
]

// — ref a la tabla para API interno — 
const table = ref<any>(null)

// — filas seleccionadas completas — 
const selectedRows = computed<Reproduccion[]>(() => {
  // toma las filas filtradas y seleccionadas
  return table.value?.tableApi
    .getFilteredSelectedRowModel()
    .rows
    .map((r: any) => r.original) || []
})

// — paginación — 
function onPageChange(newPage: number) {
  page.value = newPage
}
function onPageSizeChange(newSize: number) {
  pageSize.value = newSize
  page.value = 1
}

// — al pulsar: emite el objeto completo y cierra — 
function onSelectReproduccion() {
  const item = selectedRows.value[0]
  if (item) {
    emit('select', item)
    drawerOpen.value = false
  }
}
</script>
