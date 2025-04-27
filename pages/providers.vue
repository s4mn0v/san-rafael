<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { TableColumn, BreadcrumbItem } from '@nuxt/ui'
import type { Database } from '~/types/supabase'

type Proveedor = Database['public']['Tables']['proveedores']['Row']

const toast = useToast()

definePageMeta({ layout: 'logged', middleware: 'role-guard' })

const items = ref<BreadcrumbItem[]>([
  { label: 'Inventario', icon: 'i-heroicons-clipboard-document-list', to: '/stock' },
  { label: 'Proveedores', icon: 'i-heroicons-truck', to: '/providers' }
])

// Estados para CRUD
const newProv = ref<Partial<Proveedor>>({ id_proveedor: '', nombre_empresa: '', correo_empresa: '', telefono: '', direccion: '' })
const editProv = ref<Partial<Proveedor>>({ ...newProv.value })

const isAdding = ref(false)
const isEditing = ref(false)
const isUpdating = ref(false)
const isDeleting = ref(false)

// Selección de filas
type RowSel = Record<string, boolean>
const rowSelection = ref<RowSel>({})
const selected = ref<Proveedor[]>([])

// Fetch de proveedores
const { data: resp, pending, error, refresh: refreshProv } = await useFetch<{ proveedores: Proveedor[] }>('/api/provider/providers', {
  params: { page: 1, pageSize: 1000 }
})
const proveedores = computed(() => resp.value?.proveedores || [])

// Reset modo edición si cambian filas seleccionadas
watch(selected, (val) => {
  if (isEditing.value && val.length !== 1) {
    isEditing.value = false
  }
})

// Iniciar edición
function startEdit() {
  if (selected.value.length !== 1) return
  Object.assign(editProv.value, selected.value[0])
  isEditing.value = true
}

function cancelEdit() {
  isEditing.value = false
}

// Crear proveedor
async function addProv() {
  if (isAdding.value) return
  const { id_proveedor, nombre_empresa, correo_empresa, telefono, direccion } = newProv.value
  if (!id_proveedor || !nombre_empresa || !correo_empresa || !telefono || !direccion) {
    return toast.add({ color: 'error', icon: 'i-heroicons-exclamation-circle', title: 'Completa todos los campos.' })
  }
  isAdding.value = true
  try {
    const { toast: t } = await $fetch('/api/provider/providers', {
      method: 'POST',
      body: newProv.value
    })
    if (t) toast.add({ color: 'success', icon: 'i-heroicons-check-circle', title: t.message })
    await refreshProv()
    Object.assign(newProv.value, { id_proveedor: '', nombre_empresa: '', correo_empresa: '', telefono: '', direccion: '' })
  } catch (err: any) {
    toast.add({ color: 'error', icon: 'i-heroicons-exclamation-circle', title: err.data?.statusMessage || 'Error al agregar proveedor.' })
  } finally {
    isAdding.value = false
  }
}

// Actualizar proveedor
async function updateProv() {
  if (isUpdating.value) return
  const { id_proveedor, nombre_empresa, correo_empresa, telefono, direccion } = editProv.value
  if (!id_proveedor || !nombre_empresa || !correo_empresa || !telefono || !direccion) {
    return toast.add({ color: 'error', icon: 'i-heroicons-exclamation-circle', title: 'Completa todos los campos.' })
  }
  isUpdating.value = true
  try {
    const { toast: t } = await $fetch('/api/provider/providers', {
      method: 'PUT',
      body: editProv.value
    })
    if (t) toast.add({ color: 'success', icon: 'i-heroicons-check-circle', title: t.message })
    await refreshProv()
    isEditing.value = false
    rowSelection.value = {}
  } catch (err: any) {
    toast.add({ color: 'error', icon: 'i-heroicons-exclamation-circle', title: err.data?.statusMessage || 'Error al actualizar proveedor.' })
  } finally {
    isUpdating.value = false
  }
}

// Eliminar proveedores
async function deleteProviders() {
  if (!selected.value.length || isDeleting.value) return
  isDeleting.value = true
  try {
    const ids = selected.value.map(p => p.id_proveedor)
    const { toast: t } = await $fetch('/api/provider/providers', {
      method: 'DELETE',
      body: { ids }
    })
    if (t) toast.add({ color: 'success', icon: 'i-heroicons-check-circle', title: t.message })
    await refreshProv()
    selected.value = []
    rowSelection.value = {}
  } catch (err: any) {
    toast.add({ color: 'error', icon: 'i-heroicons-exclamation-circle', title: err.data?.statusMessage || 'Error al eliminar proveedores.' })
  } finally {
    isDeleting.value = false
  }
}

// Columnas de la tabla
const columns = ref<TableColumn<Proveedor>[]>([
  { accessorKey: 'id_proveedor', header: 'ID' },
  { accessorKey: 'nombre_empresa', header: 'Empresa' },
  { accessorKey: 'correo_empresa', header: 'Email' },
  { accessorKey: 'telefono', header: 'Teléfono' },
  { accessorKey: 'direccion', header: 'Dirección' }
])
</script>

<template>
  <div class="container mx-auto p-4">
    <UBreadcrumb :items="items" />
    <h1 class="text-2xl font-bold mb-4">Proveedores</h1>

    <!-- Formulario CRUD -->
    <div class="mb-6 bg-gray-50 dark:bg-gray-800 p-4 rounded shadow">
      <h2 class="text-xl font-semibold mb-2">{{ isEditing ? 'Editar proveedor' : 'Agregar proveedor' }}</h2>
      <div class="grid grid-cols-2 gap-4">
        <input v-model="(isEditing ? editProv : newProv).id_proveedor" class="border rounded p-2" placeholder="ID Proveedor" />
        <input v-model="(isEditing ? editProv : newProv).nombre_empresa" class="border rounded p-2" placeholder="Empresa" />
        <input v-model="(isEditing ? editProv : newProv).correo_empresa" class="border rounded p-2" placeholder="Email" />
        <input v-model="(isEditing ? editProv : newProv).telefono" class="border rounded p-2" placeholder="Teléfono" />
        <input v-model="(isEditing ? editProv : newProv).direccion" class="border rounded p-2" placeholder="Dirección" />
      </div>
      <div class="mt-4 flex gap-2">
        <UButton color="primary" @click="isEditing ? updateProv() : addProv()" :disabled="isAdding || isUpdating">
          <span v-if="!(isAdding || isUpdating)">{{ isEditing ? 'Guardar cambios' : 'Agregar proveedor' }}</span>
          <span v-else>{{ isEditing ? 'Actualizando...' : 'Agregando...' }}</span>
        </UButton>
        <UButton v-if="isEditing" variant="solid" @click="cancelEdit">Cancelar</UButton>
      </div>
    </div>

    <!-- Botones sobre la tabla -->
    <div class="flex justify-between items-center mb-4">
      <div class="text-xl font-bold">Lista de Proveedores</div>
      <div class="flex gap-2">
        <UButton v-if="selected.length === 1 && !isEditing" color="secondary" @click="startEdit">Editar</UButton>
        <UButton v-if="selected.length" color="error" @click="deleteProviders" :disabled="isDeleting">
          <span v-if="!isDeleting">Eliminar ({{ selected.length }})</span>
          <span v-else>Eliminando...</span>
        </UButton>
      </div>
    </div>

    <!-- Tabla -->
    <Table
      :columns="columns"
      :data="proveedores"
      v-model:row-selection="rowSelection"
      @selected="selected = $event"
      @refresh="refreshProv"
    />
    <div v-if="pending" class="mt-4 text-[var(--color-m2)] dark:text-[var(--color-m7)]">Cargando proveedores...</div>
    <div v-if="error" class="mt-4 text-[var(--color-error-light)] dark:text-[var(--color-error-dark)]">Error: {{ error.message }}</div>
  </div>
</template>
