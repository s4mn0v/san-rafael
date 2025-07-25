<!-- components/inventory/StockTable.vue -->
<script setup lang="ts">
import { ref, watch } from "vue";
import type { TableColumn } from "@nuxt/ui";
import { h, resolveComponent } from "vue";
import type { Table } from "@tanstack/table-core";

type InventoryItem = {
  id_inventario: number;
  tipo: string;
  descripcion: string;
  cantidad: number;
  precio: number;
  proveedor_id: string;
};

interface TableComponent {
  tableApi: Table<InventoryItem>;
}

const table = ref<TableComponent | null>(null);
const UButton = resolveComponent("UButton");
const UCheckbox = resolveComponent("UCheckbox");

const data = ref<InventoryItem[]>([]);
const total = ref(0);
const isPending = ref(false);

const selectedIds = ref<number[]>([]);
const emit = defineEmits(["refreshed"]);

const pagination = ref({
  pageIndex: 1,
  pageSize: 10,
});

const fetchInventory = async () => {
  isPending.value = true;
  try {
    const params = {
      page: pagination.value.pageIndex,
      pageSize: pagination.value.pageSize,
    };
    const response = await $fetch<{ items: InventoryItem[]; total: number }>(
      "/api/stock/stock",
      { params }
    );
    data.value = response.items;
    total.value = response.total;
    emit("refreshed");
  } catch (error) {
    console.error("Error fetching inventory:", error);
  } finally {
    isPending.value = false;
  }
};

watch(
  [() => pagination.value.pageIndex, () => pagination.value.pageSize],
  fetchInventory
);

// Carga inicial
fetchInventory();

const columns: TableColumn<InventoryItem>[] = [
  {
    id: "select",
    header: ({ table }) =>
      h(UCheckbox, {
        modelValue: table.getIsSomePageRowsSelected()
          ? "indeterminate"
          : table.getIsAllPageRowsSelected(),
        "onUpdate:modelValue": (value: boolean | "indeterminate") =>
          table.toggleAllPageRowsSelected(!!value),
        "aria-label": "Select all",
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        modelValue: row.getIsSelected(),
        "onUpdate:modelValue": (value: boolean | "indeterminate") =>
          row.toggleSelected(!!value),
        "aria-label": "Select row",
      }),
  },
  {
    id: "expand",
    cell: ({ row }) =>
      h(UButton, {
        color: "neutral",
        variant: "ghost",
        icon: "i-lucide-chevron-down",
        square: true,
        "aria-label": "Expand",
        ui: {
          leadingIcon: [
            "transition-transform",
            row.getIsExpanded() ? "duration-200 rotate-180" : "",
          ],
        },
        onClick: () => row.toggleExpanded(),
      }),
  },
  {
    accessorKey: "id_inventario",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "ID Inventario",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      });
    },
  },
  {
    accessorKey: "tipo",
    header: "Tipo",
  },
  {
    accessorKey: "descripcion",
    header: "Descripción",
  },
  {
    accessorKey: "cantidad",
    header: "Cantidad",
    cell: ({ row }) => row.original.cantidad.toLocaleString(),
  },
  {
    accessorKey: "precio",
    header: "Precio",
    cell: ({ row }) =>
      new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(row.original.precio),
  },
  {
    accessorKey: "proveedor_id",
    header: "ID Proveedor",
  },
];

const expanded = ref({});

defineExpose({
  fetchInventory,
});

watch(
  () => table.value?.tableApi?.getSelectedRowModel().rows,
  (rows) => {
    selectedIds.value = rows?.map((row) => row.original.id_inventario) || [];
  }
);

// Función para refrescar la tabla
const refreshTable = () => {
  table.value?.tableApi?.resetRowSelection();
  fetchInventory();
};
</script>

<template>
  <div class="w-full space-y-4 pb-4">
    <DeleteStock
      v-if="selectedIds.length > 0"
      :selected-ids="selectedIds"
      @deleted="refreshTable"
    />
    <UTable
      v-model:expanded="expanded"
      ref="table"
      :data="data"
      :columns="columns"
      :loading="isPending"
      class="flex-1"
    >
      <template #expanded="{ row }">
        <StockExpandedCard :item="row.original" @updated="refreshTable" />
      </template>
    </UTable>

    <div class="px-4 py-3.5 border-t border-accented text-sm text-muted">
      {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} de
      {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} filas
      seleccionadas.
    </div>

    <div class="flex justify-center border-t border-default pt-4">
      <UPagination
        v-model:page="pagination.pageIndex"
        :items-per-page="pagination.pageSize"
        :total="total"
        @update:page="(newPage: number) => pagination.pageIndex = newPage"
      />
    </div>
  </div>
</template>
