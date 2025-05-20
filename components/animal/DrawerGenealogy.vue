<template>
          <UDrawer direction="right">
    <UButton label="Open" color="neutral" variant="subtle" trailing-icon="i-lucide-chevron-up" />

    <template #content>
      <div class="flex-1 w-full">
        <div class="flex px-4 py-3.5 border-b border-accented">
      <UInput v-model="globalFilter" class="max-w-sm" placeholder="Filter..." />
    </div>

        <UTable ref="table" v-model:row-selection="rowSelection" v-model:global-filter="globalFilter" :data="data" :columns="columns" />
        
        <div class="px-4 py-3.5 border-t border-accented text-sm text-muted">
          {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} of
          {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} row(s) selected.
        </div>
        <UButton v-if="selectedIds.length > 0" label="Seleccionar reproduccion" color="neutral" variant="subtle" />
      </div>
    </template>
  </UDrawer>
</template>

<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn, TableRow } from '@nuxt/ui'

const UCheckbox = resolveComponent('UCheckbox')
const UBadge = resolveComponent('UBadge')

type Genealogy = {
  id: string
  madre_id: string
  padre_id: string
  tipo_concepcion: string
}

const data = ref<Genealogy[]>([
  {
    id: '4600',
    madre_id: 'M100',
    padre_id: 'P200',
    tipo_concepcion: 'natural'
  },
  {
    id: '4599',
    madre_id: 'M101',
    padre_id: 'P201',
    tipo_concepcion: 'inseminación'
  },
  {
    id: '4598',
    madre_id: 'M102',
    padre_id: 'P202',
    tipo_concepcion: 'transferencia embrionaria'
  },
  {
    id: '4597',
    madre_id: 'M103',
    padre_id: 'P203',
    tipo_concepcion: 'natural'
  },
  {
    id: '4596',
    madre_id: 'M104',
    padre_id: 'P204',
    tipo_concepcion: 'inseminación'
  }
])

const columns: TableColumn<Genealogy>[] = [
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
    accessorKey: 'madre_id',
    header: 'Madre'
  },
  {
    accessorKey: 'padre_id',
    header: 'Padre'
  },
  {
    accessorKey: 'tipo_concepcion',
    header: 'Tipo de Concepción',
  }
]

const table = useTemplateRef('table')

const rowSelection = ref<Record<string, boolean>>({})

const selectedIds = computed(() => {
  return Object.keys(rowSelection.value).filter(id => rowSelection.value[id])
})

function onSelect(row: TableRow<Genealogy>, e?: Event) {
  /* If you decide to also select the column you can do this  */
  row.toggleSelected(!row.getIsSelected())

  console.log(e)
}

const globalFilter = ref('')
</script>