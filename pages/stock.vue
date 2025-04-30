<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue'
import { useState } from '#imports'
import type { TableColumn, BreadcrumbItem } from '@nuxt/ui'
import type { Database } from '~/types/supabase'
import * as z from 'zod'

const toast = useToast()
const userRole = useState<string | null>('userRole')

definePageMeta({
  layout: 'logged',
  middleware: 'role-guard'
})

type Inventario = Omit<Database['public']['Tables']['inventario']['Row'], 'proveedor_id'> & {
  proveedor_id: number; // Cambiar a number
  proveedores: { nombre_empresa: string } | null;
};

// Breadcrumb
const items = ref<BreadcrumbItem[]>([
  { label: 'Inventario', icon: 'i-heroicons-clipboard-document-list', to: '/stock' }
])

// Estados para el modal
const isModalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const formState = reactive<Partial<Inventario>>({
  tipo: undefined,
  descripcion: '',
  cantidad: undefined,
  precio: undefined,
  proveedor_id: undefined
})

// Validación con Zod
// Validación con Zod - Agrega id_inventario condicional
const schema = z.object({
  tipo: z.enum(['SALUD', 'ALIMENTOS', 'ELEMENTOS'], {
    required_error: 'Selecciona un tipo válido'
  }),
  descripcion: z.string().min(3, 'Mínimo 3 caracteres'),
  cantidad: z.number().int().positive('Debe ser un número positivo'),
  precio: z.number().positive('Debe ser un número positivo'),
  proveedor_id: z.number().int().positive('ID inválido'),
  id_inventario: z.number().int().positive().optional()
}).refine(data => modalMode.value === 'edit' ? !!data.id_inventario : true, {
  message: 'ID de inventario requerido para edición',
  path: ['id_inventario']
})

// Estados de la tabla
const rowSelection = ref<Record<string, boolean>>({})
const selectedItems = ref<Inventario[]>([])
const { data: resp, pending, error, refresh: fetchStock } = await useFetch<{
  inventario: Inventario[]
}>('/api/stock/stock', {
  params: { page: 1, pageSize: 1000 }
})

const inventarioItems = computed(() => resp.value?.inventario || [])

watch(isModalOpen, (isOpen) => {
  if (!isOpen) {
    modalMode.value = 'create';
    Object.assign(formState, {
      tipo: undefined,
      descripcion: '',
      cantidad: undefined,
      precio: undefined,
      proveedor_id: undefined
    });
  }
});

// Funciones del modal
const openCreate = () => {
  modalMode.value = 'create'
  Object.assign(formState, {
    tipo: undefined,
    descripcion: '',
    cantidad: undefined,
    precio: undefined,
    proveedor_id: ''
  })
  isModalOpen.value = true
}

const openEdit = () => {
  if (selectedItems.value.length !== 1) return;
  modalMode.value = 'edit'; // <-- ¡Faltaba esta línea!
  const selected = selectedItems.value[0];

  Object.assign(formState, {
    ...selected,
    proveedor_id: Number(selected.proveedor_id)
  });
  isModalOpen.value = true;
};

// Funciones CRUD
const isAdding = ref(false)
const isUpdating = ref(false)
const isDeleting = ref(false)

async function addItem(item: Inventario) {
  isAdding.value = true
  try {
    const { toast: t } = await $fetch('/api/stock/stock', {
      method: 'POST',
      body: { ...item }
    })
    toast.add({ color: 'success', icon: 'i-heroicons-check-circle', title: t?.message || 'Ítem agregado' })
    await fetchStock()
  } catch (e: any) {
    toast.add({
      color: 'error',
      title: e.data?.statusMessage || 'Error al agregar ítem',
      icon: 'i-heroicons-exclamation-circle'
    })
  } finally {
    isAdding.value = false
  }
}

async function updateItem(item: Inventario) {
  if (!item.id_inventario) return
  isUpdating.value = true
  try {
    const { toast: t } = await $fetch('/api/stock/stock', {
      method: 'PUT',
      body: {
        id_inventario: item.id_inventario,
        tipo: item.tipo,
        descripcion: item.descripcion,
        cantidad: item.cantidad,
        precio: item.precio,
        proveedor_id: item.proveedor_id
      }
    })
    toast.add({
      color: 'success',
      icon: 'i-heroicons-check-circle',
      title: t?.message || 'Ítem actualizado correctamente'
    })
    await fetchStock() // Actualizar la lista
  } catch (e: any) {
    toast.add({
      color: 'error',
      title: e.data?.statusMessage || 'Error al actualizar ítem',
      icon: 'i-heroicons-exclamation-circle'
    })
  } finally {
    isUpdating.value = false
  }
}

async function deleteItems() {
  if (!selectedItems.value.length || isDeleting.value) return
  isDeleting.value = true
  try {
    const ids = selectedItems.value.map(i => i.id_inventario)
    const { toast: t } = await $fetch('/api/stock/stock', {
      method: 'DELETE',
      body: { ids }
    })
    toast.add({ color: 'success', icon: 'i-heroicons-check-circle', title: t?.message || 'Ítems eliminados' })
    await fetchStock()
    selectedItems.value = []
  } catch (e: any) {
    toast.add({
      color: 'error',
      title: e.data?.statusMessage || 'Error al eliminar ítems',
      icon: 'i-heroicons-exclamation-circle'
    })
  } finally {
    isDeleting.value = false
  }
}

async function submitForm() {
  try {
    const formData = schema.parse(formState)

    if (modalMode.value === 'create') {
      await addItem(formData as Inventario)
    } else {
      await updateItem(formData as Inventario)
    }

    isModalOpen.value = false
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach(err => {
        toast.add({
          color: 'error',
          title: err.message,
          icon: 'i-heroicons-exclamation-circle'
        })
      })
    }
  }
}

// Columnas de la tabla (igual que antes)
const columns = ref<TableColumn<Inventario>[]>([
  { accessorKey: 'id_inventario', header: 'ID' },
  { accessorKey: 'tipo', header: 'Tipo' },
  { accessorKey: 'descripcion', header: 'Descripción' },
  {
    accessorKey: 'cantidad',
    header: 'Cantidad',
    cell: ({ row }) => `${row.getValue('cantidad')} uds.`
  },
  {
    accessorKey: 'precio',
    header: 'Precio',
    cell: ({ row }) => `$${Number(row.getValue('precio')).toLocaleString()}`
  },
  {
    header: 'Proveedor',
    cell: ({ row }) => row.original.proveedores?.nombre_empresa || 'N/A'
  }
])
</script>

<template>
  <div class="container mx-auto p-4">
    <UBreadcrumb :items="items" />
    <h1 class="text-2xl font-bold mb-4">Inventario</h1>

    <!-- Acciones principales -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-medium">Lista de inventario</h2>
      <div v-if="userRole === 'admin'" class="flex gap-2">
        <UButton label="Agregar ítem" color="primary" @click="openCreate" />
        <UButton v-if="selectedItems.length === 1" label="Editar" color="secondary" @click="openEdit"
          :disabled="isUpdating" />
        <UButton v-if="selectedItems.length > 0" label="Eliminar" color="error" @click="deleteItems"
          :disabled="isDeleting" />
      </div>
    </div>

    <!-- Modal de formulario -->
    <UModal v-model:open="isModalOpen" :title="modalMode === 'create' ? 'Nuevo ítem' : 'Editar ítem'">
      <template #body>
        <UForm :schema="schema" :state="formState" @submit="submitForm" class="space-y-4 p-4">
          <UFormField label="Tipo" name="tipo" required>
            <USelect v-model="formState.tipo" :items="['SALUD', 'ALIMENTOS', 'ELEMENTOS']"
              placeholder="Selecciona un tipo" />
          </UFormField>

          <UFormField label="Descripción" name="descripcion" required>
            <UInput v-model="formState.descripcion" />
          </UFormField>

          <UFormField label="Cantidad" name="cantidad" required>
            <UInput type="number" v-model.number="formState.cantidad" />
          </UFormField>

          <UFormField label="Precio" name="precio" required>
            <UInput type="number" v-model.number="formState.precio" />
          </UFormField>

          <UFormField label="Proveedor ID" name="proveedor_id" required>
            <UInput type="number" v-model.number="formState.proveedor_id" :min="1" step="1" />
          </UFormField>

          <div class="flex justify-end gap-3 mt-6">
            <UButton label="Cancelar" color="primary" variant="ghost" @click="isModalOpen = false" />
            <UButton type="submit" :label="modalMode === 'create' ? 'Crear' : 'Actualizar'"
              :loading="isAdding || isUpdating" color="primary" />
          </div>
        </UForm>
      </template>
    </UModal>

    <!-- Tabla -->
    <Table :columns="columns" :data="inventarioItems" v-model:row-selection="rowSelection"
      @selected="selectedItems = $event" @refresh="fetchStock" />

    <!-- Estados de carga -->
    <div v-if="pending" class="mt-4 text-gray-500">Cargando inventario...</div>
    <div v-if="error" class="mt-4 text-red-500">Error: {{ error.message }}</div>
  </div>
</template>