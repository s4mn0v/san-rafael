<template>
  <UDrawer v-model:open="drawerOpen" direction="right">
    <UButton
      label="Open"
      color="neutral"
      variant="subtle"
      trailing-icon="i-lucide-chevron-up"
    />

    <template #content>
      <div class="flex-1 w-full">
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
        <div
          class="px-4 py-3.5 border-t border-accented text-sm text-muted flex justify-between items-center"
        >
          <div>
            {{
              table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0
            }}
            de
            {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }}
            fila(s) seleccionada(s)
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
          v-if="selectedIds.length > 0"
          label="Seleccionar reproducción"
          color="primary"
          @click="onSelectReproducciones"
        />
      </div>
    </template>
  </UDrawer>
</template>

<script setup lang="ts">
import { h, resolveComponent, computed, ref } from "vue";
import { useFetch } from "#app";
import type { TableColumn } from "@nuxt/ui";
import type { Database } from "~/types/supabase";

// ——— Emit para comunicar con el componente padre ———
const props = defineProps<{ modelValue: boolean }>()
const emit  = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'select', id: number): void
}>()

const drawerOpen = computed({
  get:  () => props.modelValue,
  set:  v  => emit('update:modelValue', v)
})

// ——— Tipos ———
type Reproduccion = Database["public"]["Tables"]["reproduccion"]["Row"];

// ——— Componentes ———
const UCheckbox = resolveComponent("UCheckbox");
const UPagination = resolveComponent("UPagination");

// ——— Estado ———
const page = ref(1);
const pageSize = ref(10);
const globalFilter = ref("");
const rowSelection = ref<Record<string, boolean>>({});

// ——— Fetch datos ———
const { data, pending } = useFetch<{
  reproducciones: Reproduccion[];
  total: number;
}>(
  () =>
    `/api/reproduction/reproductions?page=${page.value}&pageSize=${pageSize.value}`
);

const reproducciones = computed(() => data.value?.reproducciones || []);
const total = computed(() => data.value?.total || 0);

// ——— Tabla ———
const columns: TableColumn<Reproduccion>[] = [
  {
    id: "select",
    header: ({ table }) =>
      h(UCheckbox, {
        modelValue: table.getIsSomePageRowsSelected()
          ? "indeterminate"
          : table.getIsAllPageRowsSelected(),
        "onUpdate:modelValue": (v: boolean | "indeterminate") =>
          table.toggleAllPageRowsSelected(!!v),
        "aria-label": "Select all",
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        modelValue: row.getIsSelected(),
        "onUpdate:modelValue": (v: boolean | "indeterminate") =>
          row.toggleSelected(!!v),
        "aria-label": "Select row",
      }),
  },
  { accessorKey: "madre_id", header: "Madre" },
  { accessorKey: "padre_id", header: "Padre" },
  { accessorKey: "tipo_concepcion", header: "Tipo de Concepción" },
];

const table = useTemplateRef("table");

// ——— IDs seleccionados ———
const selectedIds = computed(() =>
  Object.keys(rowSelection.value).filter((id) => rowSelection.value[id])
);

// ——— Cambio de página ———
function onPageChange(newPage: number) {
  page.value = newPage;
}

function onPageSizeChange(newSize: number) {
  pageSize.value = newSize;
  page.value = 1;
}

// ——— Seleccionar reproducción y emitir al padre ———
function onSelectReproducciones() {
  const idStr = selectedIds.value[0]
  if (idStr) {
    emit('select', parseInt(idStr))
    drawerOpen.value = false      // <— aquí cierras el Drawer
  }
}
</script>
