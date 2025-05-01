<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type { Database } from "~/types/supabase";

type Animal = Database["public"]["Tables"]["animals"]["Row"];
type ReproduccionRow = Database["public"]["Tables"]["reproduccion"]["Row"];
type Reproduccion = ReproduccionRow & {
  madre: Animal | null;
  padre: Animal | null;
  descendencia: Animal[];
};

definePageMeta({ layout: "logged", middleware: "role-guard" });

const toast = useToast();
const userRole = useState<string | null>("userRole");

const rowSelection = ref<Record<string, boolean>>({});
const selected = ref<Reproduccion[]>([]);

const { data: resp, pending, error, refresh: fetchReproductions } = await useFetch<{
  reproducciones: Reproduccion[];
}>("/api/reproduction/reproductions", { params: { page: 1, pageSize: 1000 } });
const reproducciones = computed(() => resp.value?.reproducciones || []);

const { data: aResp } = await useFetch<{ animals: Animal[] }>(
  "/api/animal/animals",
  { params: { page: 1, pageSize: 1000 } }
);
const animals = computed(() => aResp.value?.animals || []);

const form = ref<Partial<ReproduccionRow> & { child_id?: string }>({
  madre_id: "",
  padre_id: "",
  tipo_concepcion: undefined,
  fecha_evento: "",
  raza: "",
  child_id: "",
});

const isAdding = ref(false);
const isEditing = ref(false);
const isUpdating = ref(false);
const isDeleting = ref(false);

watch(selected, (v) => {
  if (isEditing.value && v.length !== 1) cancelEdit();
});

function startEdit() {
  if (selected.value.length !== 1) return;
  Object.assign(form.value, selected.value[0], {
    child_id: selected.value[0].descendencia[0]?.id_animal,
  });
  isEditing.value = true;
}

function cancelEdit() {
  isEditing.value = false;
  Object.assign(form.value, {
    madre_id: "",
    padre_id: "",
    tipo_concepcion: undefined,
    fecha_evento: "",
    raza: "",
    child_id: "",
  });
}

function validate() {
  const f = form.value as any;
  if (!f.child_id || !f.madre_id || !f.tipo_concepcion || !f.fecha_evento || !f.raza) {
    toast.add({
      color: "error",
      icon: "i-heroicons-exclamation-circle",
      title: "Completa todos los campos.",
    });
    return false;
  }
  return true;
}

async function addRec() {
  if (isAdding.value || !validate()) return;
  isAdding.value = true;
  try {
    const { toast: t } = await $fetch("/api/reproduction/reproductions", {
      method: "POST",
      body: form.value,
    });
    if (t)
      toast.add({
        color: "success",
        icon: "i-heroicons-check-circle",
        title: t.message,
      });
    await fetchReproductions();
    cancelEdit();
  } catch (e: any) {
    toast.add({
      color: "error",
      title: e.data?.statusMessage || "Error al agregar.",
    });
  } finally {
    isAdding.value = false;
  }
}

async function updateRec() {
  if (isUpdating.value || !validate() || !form.value.id_reproduccion) return;
  isUpdating.value = true;
  try {
    const { toast: t } = await $fetch("/api/reproduction/reproductions", {
      method: "PUT",
      body: form.value,
    });
    if (t)
      toast.add({
        color: "success",
        icon: "i-heroicons-check-circle",
        title: t.message,
      });
    await fetchReproductions();
    cancelEdit();
  } catch (e: any) {
    toast.add({
      color: "error",
      title: e.data?.statusMessage || "Error al actualizar.",
    });
  } finally {
    isUpdating.value = false;
  }
}

async function deleteRecs() {
  if (!selected.value.length || isDeleting.value) return;
  isDeleting.value = true;
  try {
    const ids = selected.value.map((r) => r.id_reproduccion);
    const { toast: t } = await $fetch("/api/reproduction/reproductions", {
      method: "DELETE",
      body: { ids },
    });
    if (t)
      toast.add({
        color: "success",
        icon: "i-heroicons-check-circle",
        title: t.message,
      });
    await fetchReproductions();
    rowSelection.value = {};
    selected.value = [];
  } catch (e: any) {
    toast.add({
      color: "error",
      title: e.data?.statusMessage || "Error al eliminar.",
    });
  } finally {
    isDeleting.value = false;
  }
}

const columns = ref<TableColumn<Reproduccion>[]>([
  { accessorKey: "id_reproduccion", header: "ID" },
  { header: "Hijo", cell: ({ row }) => row.original.descendencia[0]?.id_animal ?? "—" },
  { header: "Madre", cell: ({ row }) => row.original.madre ? row.original.madre.id_animal : "—" },
  { header: "Padre", cell: ({ row }) => row.original.padre ? row.original.padre.id_animal : "—" },
  { accessorKey: "tipo_concepcion", header: "Método" },
  { accessorKey: "fecha_evento", header: "Fecha Evento" },
  { accessorKey: "raza", header: "Raza Objetivo" },
]);
</script>

<template>
  <div class="container mx-auto p-4 space-y-6">
    <!-- Formulario solo para admin -->
    <div v-if="userRole === 'admin'" class="mb-6 p-4 bg-gray-50 rounded shadow">
      <h2 class="font-semibold mb-2">
        {{ isEditing ? "Editar registro" : "Nuevo registro" }}
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <select v-model="form.child_id" class="border rounded p-2">
          <option disabled value="">Selecciona Hijo</option>
          <option v-for="a in animals" :key="a.id_animal" :value="a.id_animal">
            {{ a.id_animal }} — {{ a.raza }}
          </option>
        </select>
        <select v-model="form.madre_id" class="border rounded p-2">
          <option disabled value="">Selecciona Madre</option>
          <option v-for="a in animals" :key="a.id_animal" :value="a.id_animal">
            {{ a.id_animal }} — {{ a.raza }}
          </option>
        </select>
        <select v-model="form.padre_id" class="border rounded p-2">
          <option value="">(Opcional) Padre</option>
          <option v-for="a in animals" :key="a.id_animal" :value="a.id_animal">
            {{ a.id_animal }} — {{ a.raza }}
          </option>
        </select>
        <select v-model="form.tipo_concepcion" class="border rounded p-2">
          <option disabled value="">Método</option>
          <option value="NATURAL">Natural</option>
          <option value="INSEMINACION">Inseminación</option>
        </select>
        <input type="date" v-model="form.fecha_evento" class="border rounded p-2" />
        <input v-model="form.raza" placeholder="Raza" class="border rounded p-2" />
      </div>
      <div class="flex gap-2">
        <UButton
          color="primary"
          @click="isEditing ? updateRec() : addRec()"
          :loading="isAdding || isUpdating"
        >
          {{ isEditing ? "Guardar" : "Agregar" }}
        </UButton>
        <UButton v-if="isEditing" variant="solid" @click="cancelEdit">
          Cancelar
        </UButton>
      </div>
    </div>

    <!-- Acciones globales solo para admin -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Registros de Reproducción</h1>
      <div v-if="userRole === 'admin'" class="flex gap-2">
        <UButton
          v-if="selected.length === 1 && !isEditing"
          color="secondary"
          @click="startEdit"
        >
          Editar
        </UButton>
        <UButton
          v-if="selected.length > 0"
          color="error"
          @click="deleteRecs"
          :loading="isDeleting"
        >
          Eliminar ({{ selected.length }})
        </UButton>
      </div>
    </div>

    <!-- Tabla (visible para todos) -->
    <Table
      :columns="columns"
      :data="reproducciones"
      v-model:row-selection="rowSelection"
      @selected="selected = $event"
      @refresh="fetchReproductions"
    />

    <div v-if="pending" class="mt-4 text-gray-500">Cargando…</div>
    <div v-else-if="error" class="mt-4 text-red-500">Error: {{ error.message }}</div>
  </div>
</template>
