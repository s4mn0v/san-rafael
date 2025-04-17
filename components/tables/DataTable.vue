<template>
  <div>
    <UCard :class="cardClass">
      <template #header v-if="title">
        <span class="text-sm font-semibold">{{ title }}</span>
      </template>
      <template #default>
        <UTable ref="tableRef" v-model:row-selection="rowSelection" :columns="columns" :data="data ?? []"
          :loading="loading"
          :empty-state="emptyState || { icon: 'i-heroicons-circle-stack-20-solid', label: 'No data found.' }">
          <template v-for="(_, name) in $slots" #[name]="slotData">
            <slot :name="name" v-bind="slotData"></slot>
          </template>
          <template #loading-state v-if="!$slots['loading-state']">
            <div class="flex items-center justify-center h-32">
              <i class="loader"></i>
              <span>Loading data...</span>
            </div>
          </template>
        </UTable>
      </template>
    </UCard>

    <!-- Selection count -->
    <div v-if="showSelectionCount && tableRef?.tableApi"
      class="px-4 py-3.5 border-t border-(--ui-border-accented) text-sm text-(--ui-text-muted)">
      {{ tableRef?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} de
      {{ tableRef?.tableApi?.getFilteredRowModel().rows.length || 0 }} elemento(s) seleccionado(s).
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

// In DataTable.vue
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  columns: {
    type: Array as PropType<TableColumn<any>[]>,
    required: true
  },
  data: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  emptyState: {
    type: Object,
    default: null
  },
  cardClass: {
    type: String,
    default: 'bg-[var(--color-m2)] dark:bg-[var(--color-m7)]'
  },
  showSelectionCount: {
    type: Boolean,
    default: true
  }
})

const rowSelection = defineModel<Record<string, boolean>>('rowSelection', {
  default: () => ({})
})

const tableRef = useTemplateRef('tableRef')

defineExpose({
  tableRef
})
</script>

<style scoped>
.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  display: inline-block;
  margin-right: 8px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>