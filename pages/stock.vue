<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { TableColumn, BreadcrumbItem } from "@nuxt/ui";
import type { Database } from "~/types/supabase";

definePageMeta({ layout: "logged", middleware: "role-guard" });
const toast = useToast();

// Breadcrumb items
type Inventario = Database["public"]["Tables"]["inventario"]["Row"] & {
  proveedores: { nombre_empresa: string } | null;
};
const items = ref<BreadcrumbItem[]>([
  {
    label: "Inventario",
    icon: "i-heroicons-clipboard-document-list",
    to: "/stock",
  },
]);

// CRUD form state
const newItem = ref<Partial<Inventario>>({
  tipo: undefined,
  descripcion: "",
  cantidad: undefined,
  precio: undefined,
  proveedor_id: "",
});
const editItem = ref<Partial<Inventario>>({ ...newItem.value });

// Flags
const isAdding = ref(false);
const isEditing = ref(false);
const isUpdating = ref(false);
const isDeleting = ref(false);

// Table selection
const rowSelection = ref<Record<string, boolean>>({});
const selectedItems = ref<Inventario[]>([]);

// Fetch inventory
const {
  data: resp,
  pending,
  error,
  refresh: fetchStock,
} = await useFetch<{ inventario: Inventario[] }>("/api/stock/stock", {
  params: { page: 1, pageSize: 1000 },
});
const inventarioItems = computed(() => resp.value?.inventario || []);

// Cancel edit mode if selection changes
watch(selectedItems, (vals) => {
  if (isEditing.value && vals.length !== 1) isEditing.value = false;
});

// Start edit
function startEdit() {
  if (selectedItems.value.length !== 1) return;
  Object.assign(editItem.value, selectedItems.value[0]);
  isEditing.value = true;
}
function cancelEdit() {
  isEditing.value = false;
}

// Create item
async function addItem() {
  if (isAdding.value) return;
  const { tipo, descripcion, cantidad, precio, proveedor_id } = newItem.value;
  if (
    !tipo ||
    !descripcion ||
    cantidad == null ||
    precio == null ||
    !proveedor_id
  ) {
    return toast.add({
      color: "error",
      icon: "i-heroicons-exclamation-circle",
      title: "Completa todos los campos.",
    });
  }
  isAdding.value = true;
  try {
    const { toast: t } = await $fetch("/api/stock/stock", {
      method: "POST",
      body: newItem.value,
    });
    if (t)
      toast.add({
        color: "success",
        icon: "i-heroicons-check-circle",
        title: t.message,
      });
    await fetchStock();
    Object.assign(newItem.value, {
      tipo: undefined,
      descripcion: "",
      cantidad: undefined,
      precio: undefined,
      proveedor_id: "",
    });
  } catch (e: any) {
    toast.add({
      color: "error",
      icon: "i-heroicons-exclamation-circle",
      title: e.data?.statusMessage || "Error al agregar ítem.",
    });
  } finally {
    isAdding.value = false;
  }
}

// Update item
async function updateItem() {
  if (isUpdating.value) return;
  const { id_inventario, tipo, descripcion, cantidad, precio, proveedor_id } =
    editItem.value;
  if (
    !id_inventario ||
    !tipo ||
    !descripcion ||
    cantidad == null ||
    precio == null ||
    !proveedor_id
  ) {
    return toast.add({
      color: "error",
      icon: "i-heroicons-exclamation-circle",
      title: "Completa todos los campos.",
    });
  }
  isUpdating.value = true;
  try {
    const { toast: t } = await $fetch("/api/stock/stock", {
      method: "PUT",
      body: editItem.value,
    });
    if (t)
      toast.add({
        color: "success",
        icon: "i-heroicons-check-circle",
        title: t.message,
      });
    await fetchStock();
    isEditing.value = false;
    rowSelection.value = {};
  } catch (e: any) {
    toast.add({
      color: "error",
      icon: "i-heroicons-exclamation-circle",
      title: e.data?.statusMessage || "Error al actualizar ítem.",
    });
  } finally {
    isUpdating.value = false;
  }
}

// Delete items
async function deleteItems() {
  if (!selectedItems.value.length || isDeleting.value) return;
  isDeleting.value = true;
  try {
    const ids = selectedItems.value.map((i) => i.id_inventario);
    const { toast: t } = await $fetch("/api/stock/stock", {
      method: "DELETE",
      body: { ids },
    });
    if (t)
      toast.add({
        color: "success",
        icon: "i-heroicons-check-circle",
        title: t.message,
      });
    await fetchStock();
    selectedItems.value = [];
    rowSelection.value = {};
  } catch (e: any) {
    toast.add({
      color: "error",
      icon: "i-heroicons-exclamation-circle",
      title: e.data?.statusMessage || "Error al eliminar ítems.",
    });
  } finally {
    isDeleting.value = false;
  }
}

// Table columns
const columns = ref<TableColumn<Inventario>[]>([
  { accessorKey: "id_inventario", header: "ID" },
  { accessorKey: "tipo", header: "Tipo" },
  { accessorKey: "descripcion", header: "Descripción" },
  {
    accessorKey: "cantidad",
    header: "Cantidad",
    cell: ({ row }) => `${row.getValue("cantidad")} uds.`,
  },
  {
    accessorKey: "precio",
    header: "Precio",
    cell: ({ row }) => `$${Number(row.getValue("precio")).toLocaleString()}`,
  },
  {
    header: "Proveedor",
    cell: ({ row }) => row.original.proveedores?.nombre_empresa || "N/A",
  },
]);
</script>

<template>
  <div class="container mx-auto p-4">
    <UBreadcrumb :items="items" />
    <h1 class="text-2xl font-bold mb-4">Inventario</h1>

    <!-- Formulario CRUD -->
    <div class="mb-6 bg-gray-50 dark:bg-gray-800 p-4 rounded shadow">
      <h2 class="text-xl font-semibold mb-2">
        {{ isEditing ? "Editar ítem" : "Agregar ítem" }}
      </h2>
      <div class="grid grid-cols-2 gap-4">
        <select
          v-model="(isEditing ? editItem : newItem).tipo"
          class="border rounded p-2"
        >
          <option disabled value="">Selecciona tipo</option>
          <option value="SALUD">Salud</option>
          <option value="ALIMENTOS">Alimentos</option>
          <option value="ELEMENTOS">Elementos</option>
        </select>
        <input
          v-model="(isEditing ? editItem : newItem).descripcion"
          class="border rounded p-2"
          placeholder="Descripción"
        />
        <input
          type="number"
          v-model.number="(isEditing ? editItem : newItem).cantidad"
          class="border rounded p-2"
          placeholder="Cantidad"
        />
        <input
          type="number"
          v-model.number="(isEditing ? editItem : newItem).precio"
          class="border rounded p-2"
          placeholder="Precio"
        />
        <input
          v-model="(isEditing ? editItem : newItem).proveedor_id"
          class="border rounded p-2"
          placeholder="ID Proveedor"
        />
      </div>
      <div class="mt-4 flex gap-2">
        <UButton
          color="primary"
          @click="isEditing ? updateItem() : addItem()"
          :disabled="isAdding || isUpdating"
        >
          <span v-if="!(isAdding || isUpdating)">{{
            isEditing ? "Guardar cambios" : "Agregar ítem"
          }}</span>
          <span v-else>{{
            isEditing ? "Actualizando..." : "Agregando..."
          }}</span>
        </UButton>
        <UButton v-if="isEditing" variant="solid" @click="cancelEdit"
          >Cancelar</UButton
        >
      </div>
    </div>

    <!-- Table header actions -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-medium">Lista de inventario</h2>
      <div class="flex gap-2">
        <UButton
          v-if="selectedItems.length === 1 && !isEditing"
          color="secondary"
          @click="startEdit"
          >Editar</UButton
        >
        <UButton
          v-if="selectedItems.length"
          color="error"
          @click="deleteItems"
          :disabled="isDeleting"
        >
          <span v-if="!isDeleting">Eliminar ({{ selectedItems.length }})</span>
          <span v-else>Eliminando...</span>
        </UButton>
      </div>
    </div>

    <!-- Data table -->
    <Table
      :columns="columns"
      :data="inventarioItems"
      v-model:row-selection="rowSelection"
      @selected="selectedItems = $event"
      @refresh="fetchStock"
    />

    <div
      v-if="pending"
      class="mt-4 text-[var(--color-m2)] dark:text-[var(--color-m7)]"
    >
      Cargando inventario...
    </div>
    <div
      v-if="error"
      class="mt-4 text-[var(--color-error-light)] dark:text-[var(--color-error-dark)]"
    >
      Error: {{ error.message }}
    </div>
  </div>
</template>
