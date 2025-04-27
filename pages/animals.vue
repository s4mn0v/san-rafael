<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type { Animal } from "~/types/supabase";

const toast = useToast();

definePageMeta({
  layout: "logged",
  middleware: "role-guard",
});

// Estados para creación y edición
const newAnimal = ref<Partial<Animal>>({
  id_animal: "",
  fecha_nacimiento: "",
  raza: "",
  tipo_animal: undefined,
  peso_actual: undefined,
  estado_salud: "",
});
const editAnimal = ref<Partial<Animal>>({ ...newAnimal.value });

const isAdding = ref(false);
const isEditing = ref(false);
const isUpdating = ref(false);

// Selección
const rowSelection = ref<Record<string, boolean>>({});
const selectedAnimals = ref<Animal[]>([]);
const isDeleting = ref(false);

// Fetch de animales
const {
  data: resp,
  pending,
  error,
  refresh: refreshAnimals,
} = await useFetch<{
  animals: Animal[];
  total: number;
  page: number;
  pageSize: number;
}>("/api/animal/animals", {
  params: { page: 1, pageSize: 1000 },
});
const animals = computed(() => resp.value?.animals || []);

// Sincroniza selección con objeto reactivo
watch(selectedAnimals, (val) => {
  // al iniciar edición, limpiamos
  if (isEditing.value && val.length !== 1) {
    isEditing.value = false;
  }
});

// Funciones CRUD
async function addAnimal() {
  if (isAdding.value) return;
  const {
    id_animal,
    fecha_nacimiento,
    raza,
    tipo_animal,
    peso_actual,
    estado_salud,
  } = newAnimal.value;
  if (
    !id_animal ||
    !fecha_nacimiento ||
    !raza ||
    !tipo_animal ||
    peso_actual == null ||
    !estado_salud
  ) {
    return toast.add({
      color: "error",
      icon: "i-heroicons-exclamation-circle",
      title: "Completa todos los campos.",
    });
  }
  isAdding.value = true;
  try {
    const { toast: successToast } = await $fetch("/api/animal/animals", {
      method: "POST",
      body: newAnimal.value,
    });
    if (successToast)
      toast.add({
        color: "success",
        icon: "i-heroicons-check-circle",
        title: successToast.message,
      });
    await refreshAnimals();
    Object.assign(newAnimal.value, {
      id_animal: "",
      fecha_nacimiento: "",
      raza: "",
      tipo_animal: undefined,
      peso_actual: undefined,
      estado_salud: "",
    });
  } catch (err: any) {
    toast.add({
      color: "error",
      icon: "i-heroicons-exclamation-circle",
      title: err.data?.toast?.message || "Error al agregar el animal.",
    });
  } finally {
    isAdding.value = false;
  }
}

function startEdit() {
  if (selectedAnimals.value.length !== 1) return;
  Object.assign(editAnimal.value, selectedAnimals.value[0]);
  isEditing.value = true;
}

function cancelEdit() {
  isEditing.value = false;
}

async function updateAnimal() {
  if (isUpdating.value) return;
  const {
    id_animal,
    fecha_nacimiento,
    raza,
    tipo_animal,
    peso_actual,
    estado_salud,
  } = editAnimal.value;
  if (
    !id_animal ||
    !fecha_nacimiento ||
    !raza ||
    !tipo_animal ||
    peso_actual == null ||
    !estado_salud
  ) {
    return toast.add({
      color: "error",
      icon: "i-heroicons-exclamation-circle",
      title: "Completa todos los campos.",
    });
  }
  isUpdating.value = true;
  try {
    const { toast: successToast } = await $fetch("/api/animal/animals", {
      method: "PUT",
      body: editAnimal.value,
    });
    if (successToast)
      toast.add({
        color: "success",
        icon: "i-heroicons-check-circle",
        title: successToast.message,
      });
    await refreshAnimals();
    isEditing.value = false;
    rowSelection.value = {};
  } catch (err: any) {
    toast.add({
      color: "error",
      icon: "i-heroicons-exclamation-circle",
      title: err.data?.toast?.message || "Error al actualizar el animal.",
    });
  } finally {
    isUpdating.value = false;
  }
}

async function deleteSelectedAnimals() {
  if (!selectedAnimals.value.length || isDeleting.value) return;
  isDeleting.value = true;
  try {
    const ids = selectedAnimals.value.map((a) => a.id_animal);
    const { toast: successToast } = await $fetch("/api/animal/animals", {
      method: "DELETE",
      body: { ids },
    });
    if (successToast)
      toast.add({
        color: "success",
        icon: "i-heroicons-check-circle",
        title: successToast.message,
      });
    await refreshAnimals();
    rowSelection.value = {};
    selectedAnimals.value = [];
  } catch (err: any) {
    toast.add({
      color: "error",
      icon: "i-heroicons-exclamation-circle",
      title: err.data?.toast?.message || "Error al eliminar animales.",
    });
  } finally {
    isDeleting.value = false;
  }
}

// Columnas
const columns = ref<TableColumn<Animal>[]>([
  { accessorKey: "id_animal", header: "ID" },
  {
    accessorKey: "fecha_nacimiento",
    header: "Fecha Nacimiento",
    cell: ({ row }) =>
      new Date(row.getValue("fecha_nacimiento")).toLocaleDateString("es-ES"),
  },
  { accessorKey: "raza", header: "Raza" },
  { accessorKey: "tipo_animal", header: "Tipo" },
  {
    accessorKey: "peso_actual",
    header: "Peso Actual",
    cell: ({ row }) => `${row.getValue("peso_actual")} kg`,
  },
  { accessorKey: "estado_salud", header: "Salud" },
]);
</script>

<template>
  <div class="container mx-auto p-4">
    <!-- Formulario -->
    <div class="mb-6 bg-gray-50 dark:bg-gray-800 p-4 rounded shadow">
      <h2 class="text-xl font-semibold mb-2">
        {{ isEditing ? "Editar animal" : "Agregar nuevo animal" }}
      </h2>
      <div class="grid grid-cols-2 gap-4">
        <input
          type="text"
          v-model="(isEditing ? editAnimal : newAnimal).id_animal"
          class="border rounded p-2"
          placeholder="ID del animal"
        />
        <input
          type="date"
          v-model="(isEditing ? editAnimal : newAnimal).fecha_nacimiento"
          class="border rounded p-2"
        />
        <input
          type="text"
          v-model="(isEditing ? editAnimal : newAnimal).raza"
          class="border rounded p-2"
          placeholder="Raza"
        />
        <select
          v-model="(isEditing ? editAnimal : newAnimal).tipo_animal"
          class="border rounded p-2"
        >
          <option disabled :value="undefined">Selecciona tipo</option>
          <option value="NOVILLO">Novillo</option>
          <option value="TERNERO">Ternero</option>
          <option value="TERNERA">Ternera</option>
          <option value="VACA">Vaca</option>
          <option value="TORO">Toro</option>
        </select>
        <input
          type="number"
          v-model.number="(isEditing ? editAnimal : newAnimal).peso_actual"
          class="border rounded p-2"
          placeholder="Peso actual (kg)"
        />
        <input
          type="text"
          v-model="(isEditing ? editAnimal : newAnimal).estado_salud"
          class="border rounded p-2"
          placeholder="Estado de salud"
        />
      </div>
      <div class="mt-4 flex gap-2">
        <UButton
          color="primary"
          @click="isEditing ? updateAnimal() : addAnimal()"
          :disabled="isAdding || isUpdating"
        >
          <span v-if="!(isAdding || isUpdating)">{{
            isEditing ? "Guardar cambios" : "Agregar animal"
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

    <!-- Header con botones -->
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Animales</h1>
      <div class="flex gap-2">
        <UButton
          v-if="selectedAnimals.length === 1 && !isEditing"
          color="secondary"
          @click="startEdit"
          >Editar</UButton
        >
        <UButton
          v-if="selectedAnimals.length"
          color="error"
          @click="deleteSelectedAnimals"
          :disabled="isDeleting"
        >
          <span v-if="!isDeleting"
            >Eliminar ({{ selectedAnimals.length }})</span
          >
          <span v-else>Eliminando...</span>
        </UButton>
      </div>
    </div>

    <div
      v-if="pending"
      class="mt-4 text-[var(--color-m2)] dark:text-[var(--color-m7)]"
    >
      Cargando animales...
    </div>
    <Table
      :columns="columns"
      :data="animals"
      v-model:row-selection="rowSelection"
      @selected="selectedAnimals = $event"
      @refresh="refreshAnimals"
    />
    <div v-if="error" class="mt-4 text-red-500">
      Error al cargar: {{ error.message }}
    </div>
  </div>
</template>
