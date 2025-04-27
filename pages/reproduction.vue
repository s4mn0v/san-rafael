<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type { Database } from "~/types/supabase";

// Define layouts and middleware
definePageMeta({
  layout: "logged",
  middleware: "role-guard",
});

// Toast
const toast = useToast();

// Types
type Animal = Database["public"]["Tables"]["animals"]["Row"];
type ReproduccionRow = Database["public"]["Tables"]["reproduccion"]["Row"];
type Reproduccion = ReproduccionRow & {
  madre: Animal | null;
  padre: Animal | null;
  descendencia: Animal[];
};

// Selection state
const rowSelection = ref<Record<string, boolean>>({});
const selectedRecords = ref<Reproduccion[]>([]);

// Fetch reproducciones
const { data: resp, pending, error, refresh: fetchReproductions } = await useFetch<{
  reproducciones: Reproduccion[];
}>("/api/reproduction/reproductions", {
  params: { page: 1, pageSize: 1000 },
});
const reproducciones = computed(() => resp.value?.reproducciones || []);

// Form state
const newRec = ref<Partial<ReproduccionRow>>({
  madre_id: "",
  padre_id: "",
  tipo_concepcion: undefined,
  fecha_evento: "",
  raza: "",
});
const editRec = ref<Partial<ReproduccionRow>>({ ...newRec.value });

const isAdding = ref(false);
const isEditing = ref(false);
const isUpdating = ref(false);
const isDeleting = ref(false);

// Reset editing if selection changes
watch(selectedRecords, (val) => {
  if (isEditing.value && val.length !== 1) {
    isEditing.value = false;
  }
});

// Start editing
function startEdit() {
  if (selectedRecords.value.length !== 1) return;
  Object.assign(editRec.value, selectedRecords.value[0]);
  isEditing.value = true;
}

// Cancel edit
function cancelEdit() {
  isEditing.value = false;
}

// Minimal validation
function validate(r: Partial<ReproduccionRow>) {
  const { madre_id, tipo_concepcion, fecha_evento, raza } = r;
  if (!madre_id || !tipo_concepcion || !fecha_evento || !raza) {
    toast.add({ color: "error", title: "Completa todos los campos." });
    return false;
  }
  return true;
}

// Create
async function addRec() {
  if (isAdding.value) return;
  if (!validate(newRec.value)) return;
  isAdding.value = true;
  try {
    const { toast: t } = await $fetch("/api/reproduction/reproductions", {
      method: "POST",
      body: newRec.value,
    });
    if (t) toast.add({ color: "success", title: t.message });
    await fetchReproductions();
    Object.assign(newRec.value, {
      madre_id: "",
      padre_id: "",
      tipo_concepcion: undefined,
      fecha_evento: "",
      raza: "",
    });
  } catch (e: any) {
    toast.add({ color: "error", title: e.data?.statusMessage || "Error al agregar." });
  } finally {
    isAdding.value = false;
  }
}

// Update
async function updateRec() {
  if (isUpdating.value) return;
  if (!validate(editRec.value) || !editRec.value.id_reproduccion) return;
  isUpdating.value = true;
  try {
    const { toast: t } = await $fetch("/api/reproduction/reproductions", {
      method: "PUT",
      body: editRec.value,
    });
    if (t) toast.add({ color: "success", title: t.message });
    await fetchReproductions();
    isEditing.value = false;
    rowSelection.value = {};
    selectedRecords.value = [];
  } catch (e: any) {
    toast.add({ color: "error", title: e.data?.statusMessage || "Error al actualizar." });
  } finally {
    isUpdating.value = false;
  }
}

// Delete
async function deleteRecs() {
  if (!selectedRecords.value.length || isDeleting.value) return;
  isDeleting.value = true;
  try {
    const ids = selectedRecords.value.map((r) => r.id_reproduccion);
    const { toast: t } = await $fetch("/api/reproduction/reproductions", {
      method: "DELETE",
      body: { ids },
    });
    if (t) toast.add({ color: "success", title: t.message });
    await fetchReproductions();
    rowSelection.value = {};
    selectedRecords.value = [];
  } catch (e: any) {
    toast.add({ color: "error", title: e.data?.statusMessage || "Error al eliminar." });
  } finally {
    isDeleting.value = false;
  }
}

// Table columns
const columns = ref<TableColumn<Reproduccion>[]>([
  { accessorKey: "id_reproduccion", header: "ID" },
  { accessorKey: "madre_id", header: "Madre ID" },
  { accessorKey: "padre_id", header: "Padre ID" },
  { accessorKey: "tipo_concepcion", header: "Método" },
  { accessorKey: "fecha_evento", header: "Fecha Evento" },
  { accessorKey: "raza", header: "Raza Objetivo" },
]);
</script>

<template>
  <div class="container mx-auto p-4 space-y-6">
    <!-- Formulario Add/Edit -->
    <div v-if="isEditing || isAdding" class="mb-6 p-4 bg-gray-50 rounded shadow">
      <h2 class="mb-2 font-semibold">
        {{ isEditing ? "Editar Registro" : "Agregar Registro" }}
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          v-model="(isEditing ? editRec : newRec).madre_id"
          placeholder="madre_id"
          class="border rounded p-2"
        />
        <input
          v-model="(isEditing ? editRec : newRec).padre_id"
          placeholder="padre_id"
          class="border rounded p-2"
        />
        <input
          v-model="(isEditing ? editRec : newRec).tipo_concepcion"
          placeholder="tipo_concepcion"
          class="border rounded p-2"
        />
        <input
          type="date"
          v-model="(isEditing ? editRec : newRec).fecha_evento"
          class="border rounded p-2"
        />
        <input
          v-model="(isEditing ? editRec : newRec).raza"
          placeholder="raza"
          class="border rounded p-2"
        />
      </div>
      <div class="flex gap-2">
        <button
          @click="isEditing ? updateRec() : addRec()"
          :disabled="isAdding || isUpdating"
          class="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {{ isEditing
            ? (isUpdating ? "Guardando..." : "Guardar")
            : (isAdding ? "Agregando..." : "Agregar") }}
        </button>
        <button
          v-if="isEditing"
          @click="cancelEdit"
          class="px-4 py-2 bg-gray-400 text-white rounded"
        >
          Cancelar
        </button>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Registros de Reproducción</h1>
      <div class="flex gap-2">
        <button
          v-if="selectedRecords.length === 1 && !isEditing"
          @click="startEdit"
          class="px-3 py-1 bg-yellow-500 text-white rounded"
        >
          Editar
        </button>
        <button
          v-if="selectedRecords.length > 0"
          @click="deleteRecs"
          :disabled="isDeleting"
          class="px-3 py-1 bg-red-600 text-white rounded"
        >
          {{ isDeleting
            ? "Eliminando..."
            : `Eliminar (${selectedRecords.length})` }}
        </button>
      </div>
    </div>

    <!-- Tabla -->
    <Table
      :columns="columns"
      :data="reproducciones"
      v-model:rowSelection="rowSelection"
      @selected="selectedRecords = $event"
      @refresh="fetchReproductions"
    />

    <!-- Loading / Error -->
    <div v-if="pending" class="mt-4 text-gray-500">Cargando...</div>
    <div v-else-if="error" class="mt-4 text-red-500">
      Error: {{ error.message }}
    </div>
  </div>
</template>
