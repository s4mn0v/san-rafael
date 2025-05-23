<!-- components/stock/DrawerProviders.vue -->
<template>
  <div>

    <UDrawer v-model:open="isDrawerOpen" title="Seleccionar proveedor"
      description="Busca y selecciona un proveedor de la lista" :inset="true">
      <UButton icon="i-heroicons-magnifying-glass" @click="isDrawerOpen = true" title="Seleccionar proveedor"
        variant="ghost" />

      <template #body>
        <div class="flex-1 w-full">
          <!-- Filtro -->
          <div class="flex px-4 py-3.5 border-b border-accented">
            <UInput v-model="globalFilter" class="max-w-sm" placeholder="Filtrar..." />
          </div>

          <!-- Tabla de proveedores -->
          <UTable ref="table" v-model:row-selection="rowSelection" v-model:global-filter="globalFilter"
            :data="filteredProveedores" :columns="columns" :loading="pending" />

          <!-- Pie: contador y paginación -->
          <div class="px-4 py-3.5 border-t border-accented text-sm text-muted flex justify-between items-center">
            <div>
              {{ selectedRows.length }} de {{ total }} proveedor(es) seleccionado(s)
            </div>
            <UPagination v-model:page="page" v-model:page-size="pageSize" :total="total" />
          </div>

          <!-- Botón de acción -->
          <UButton v-if="selectedRows.length === 1" label="Seleccionar proveedor" color="primary"
            @click="onSelectProveedor" class="mt-4" />
        </div>
      </template>
    </UDrawer>
  </div>
</template>

<script setup lang="ts">
import { h, resolveComponent, computed, ref, watch } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Database } from '~/types/supabase'

type Proveedor = Database['public']['Tables']['proveedores']['Row']

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'select', item: Proveedor): void
}>()

const isDrawerOpen = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
})

// Componentes UI
const UCheckbox = resolveComponent('UCheckbox')

// Estado reactivo
const page = ref(1)
const pageSize = ref(10)
const globalFilter = ref('')
const rowSelection = ref<Record<string, boolean>>({})

// Fetch datos
const { data, pending, refresh } = useFetch<{
  proveedores: Proveedor[]
  total: number
}>(() => `/api/providers/providers?page=${page.value}&pageSize=${pageSize.value}`)

const proveedores = computed(() => data.value?.proveedores || [])
const total = computed(() => data.value?.total || 0)

// Columnas de la tabla
const columns: TableColumn<Proveedor>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox, {
        modelValue: table.getIsSomePageRowsSelected() ? 'indeterminate' : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (v: boolean | 'indeterminate') => table.toggleAllPageRowsSelected(!!v),
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        modelValue: row.getIsSelected(),
        'onUpdate:modelValue': (v: boolean | 'indeterminate') => row.toggleSelected(!!v),
      })
  },
  { accessorKey: 'nombre_empresa', header: 'Empresa' },
  { accessorKey: 'correo_empresa', header: 'Email' },
  { accessorKey: 'telefono', header: 'Teléfono' }
]

// Ref a la tabla
const table = ref<any>(null)

// Filas seleccionadas
const selectedRows = computed<Proveedor[]>(() => {
  return table.value?.tableApi
    .getFilteredSelectedRowModel()
    .rows
    .map((r: any) => r.original) || []
})

// Filtrar localmente
const filteredProveedores = computed(() => {
  if (!globalFilter.value) return proveedores.value
  const search = globalFilter.value.toLowerCase()
  return proveedores.value.filter(p =>
    p.nombre_empresa.toLowerCase().includes(search) ||
    p.correo_empresa.toLowerCase().includes(search)
  )
})


// Actualizar datos al cambiar paginación
watch([page, pageSize], () => refresh())

// Seleccionar proveedor
const onSelectProveedor = () => {
  const item = selectedRows.value[0]
  if (item) {
    emit('select', item)
    isDrawerOpen.value = false
  }
}
</script>