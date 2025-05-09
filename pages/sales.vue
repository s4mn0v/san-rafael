<!-- pages/sales.vue -->
<script setup lang="ts">
import { ref, computed, watch, reactive, onMounted } from 'vue'
import { useState, useRouter } from '#imports'
import type { TableColumn, BreadcrumbItem } from '@nuxt/ui'
import type { Database } from '~/types/supabase'
import * as z from 'zod'

const toast = useToast()
const userRole = useState<string | null>('userRole')
const router = useRouter()

// Si no es admin, redirige al inicio
onMounted(() => {
  if (userRole.value !== 'admin') {
    toast.add({ color: 'error', title: 'Acceso denegado: solo administradores' })
    router.replace('/')
  }
})

definePageMeta({
  layout: 'logged',
  middleware: 'role-guard'
})

// Tipos
type Sale = Database['public']['Tables']['ventas']['Row']
type Animal = Database['public']['Tables']['animals']['Row']

// Breadcrumb
const items = ref<BreadcrumbItem[]>([
  { label: 'Ventas', icon: 'i-heroicons-currency-dollar', to: '/sales' }
])

// Carga lista de animales
const { data: animalResp, pending: animalsLoading } =
  await useFetch<{ animals: Animal[] }>('/api/animal/animals', {
    params: { page: 1, pageSize: 1000 }
  })
const animals = computed(() => animalResp.value?.animals || [])

// Modal state
const isModalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const formState = reactive<Partial<Sale>>({
  animal_id: '',
  fecha_venta: '',
  monto: undefined
})

// Zod schema
const schema = z.object({
  animal_id: z.string().min(1, 'Selecciona un animal'),
  fecha_venta: z.string().refine(s => !isNaN(Date.parse(s)), 'Fecha inválida'),
  monto: z.number().positive('Monto debe ser positivo'),
  id_venta: z.number().optional()
}).refine(data => modalMode.value === 'edit' ? !!data.id_venta : true, {
  message: 'ID de venta requerido para edición',
  path: ['id_venta']
})

// Fetch ventas
const rowSelection = ref<Record<string, boolean>>({})
const selectedItems = ref<Sale[]>([])
const { data: resp, pending, error, refresh: fetchSales } = await useFetch<{
  ventas: Sale[]
}>('/api/sales/sales', { params: { page: 1, pageSize: 1000 } })
const salesItems = computed(() => resp.value?.ventas || [])

watch(isModalOpen, open => {
  if (!open) {
    modalMode.value = 'create'
    Object.assign(formState, { animal_id: '', fecha_venta: '', monto: undefined })
  }
})

// Abrir / Editar modal
function openCreate() {
  modalMode.value = 'create'
  Object.assign(formState, { animal_id: '', fecha_venta: '', monto: undefined })
  isModalOpen.value = true
}
function openEdit() {
  if (selectedItems.value.length !== 1) return
  modalMode.value = 'edit'
  const s = selectedItems.value[0]
  Object.assign(formState, { ...s, monto: Number(s.monto) })
  isModalOpen.value = true
}

// CRUD flags
const isAdding = ref(false)
const isUpdating = ref(false)
const isDeleting = ref(false)

// Funciones CRUD
async function addSale(item: Sale) {
  isAdding.value = true
  try {
    await $fetch('/api/sales/sales', { method: 'POST', body: item })
    toast.add({ color: 'success', icon: 'i-heroicons-check-circle', title: 'Venta registrada.' })
    await fetchSales()
  } catch (e: any) {
    toast.add({ color: 'error', icon: 'i-heroicons-exclamation-circle', title: e.data?.statusMessage || 'Error al registrar' })
  } finally { isAdding.value = false }
}

async function updateSale(item: Sale) {
  if (!item.id_venta) return
  isUpdating.value = true
  try {
    await $fetch('/api/sales/sales', { method: 'PUT', body: item })
    toast.add({ color: 'success', icon: 'i-heroicons-check-circle', title: 'Venta actualizada.' })
    await fetchSales()
  } catch (e: any) {
    toast.add({ color: 'error', icon: 'i-heroicons-exclamation-circle', title: e.data?.statusMessage || 'Error al actualizar' })
  } finally { isUpdating.value = false }
}

async function deleteSales() {
  if (!selectedItems.value.length || isDeleting.value) return
  isDeleting.value = true
  try {
    const ids = selectedItems.value.map(i => i.id_venta)
    await $fetch('/api/sales/sales', { method: 'DELETE', body: { ids } })
    toast.add({ color: 'success', icon: 'i-heroicons-check-circle', title: 'Ventas eliminadas.' })
    selectedItems.value = []
    await fetchSales()
  } catch (e: any) {
    toast.add({ color: 'error', icon: 'i-heroicons-exclamation-circle', title: e.data?.statusMessage || 'Error al eliminar' })
  } finally { isDeleting.value = false }
}

async function submitForm() {
  try {
    const data = schema.parse(formState)
    if (modalMode.value === 'create') await addSale(data as Sale)
    else await updateSale(data as Sale)
    isModalOpen.value = false
  } catch (err: any) {
    if (err.errors) err.errors.forEach((e: any) =>
      toast.add({ color: 'error', icon: 'i-heroicons-exclamation-circle', title: e.message })
    )
  }
}

// Columnas tabla
const columns = ref<TableColumn<Sale>[]>([
  { accessorKey: 'id_venta', header: 'ID Venta' },
  { accessorKey: 'animal_id', header: 'Animal' },
  {
    accessorKey: 'fecha_venta',
    header: 'Fecha',
    cell: ({ row }) => new Date(row.getValue('fecha_venta')).toLocaleDateString()
  },
  {
    accessorKey: 'monto',
    header: 'Monto',
    cell: ({ row }) => `$${Number(row.getValue('monto')).toLocaleString()}`
  }
])
</script>

<template>
  <div class="container mx-auto p-4" v-if="userRole==='admin'">
    <UBreadcrumb :items="items" />
    <h1 class="text-2xl font-bold mb-4">Ventas de Animales</h1>

    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-medium">Registro de Ventas</h2>
      <div class="flex gap-2">
        <UButton label="Agregar venta" color="primary" @click="openCreate" />
        <UButton v-if="selectedItems.length===1" label="Editar" color="secondary" @click="openEdit" :disabled="isUpdating" />
        <UButton v-if="selectedItems.length>0" label="Eliminar" color="error" @click="deleteSales" :disabled="isDeleting" />
      </div>
    </div>

    <UModal v-model:open="isModalOpen" :title="modalMode==='create' ? 'Nueva Venta' : 'Editar Venta'">
      <template #body>
        <UForm :schema="schema" :state="formState" @submit="submitForm" class="space-y-4 p-4">
          <UFormField label="Animal" name="animal_id" required>
            <USelect v-model="formState.animal_id" :items="animals.map(a => a.id_animal)" :loading="animalsLoading" />
          </UFormField>
          <UFormField label="Fecha de Venta" name="fecha_venta" required>
            <UInput type="date" v-model="formState.fecha_venta" />
          </UFormField>
          <UFormField label="Monto" name="monto" required>
            <UInput type="number" v-model.number="formState.monto" />
          </UFormField>
          <div class="flex justify-end gap-3 mt-6">
            <UButton label="Cancelar" variant="ghost" @click="isModalOpen=false" />
            <UButton type="submit" :loading="isAdding||isUpdating" color="primary" :label="modalMode==='create'?'Crear':'Actualizar'" />
          </div>
        </UForm>
      </template>
    </UModal>

    <Table :columns="columns" :data="salesItems" v-model:row-selection="rowSelection" @selected="selectedItems=$event" @refresh="fetchSales" />
    <div v-if="pending" class="mt-4 text-gray-500">Cargando ventas...</div>
    <div v-if="error" class="mt-4 text-red-500">Error: {{ error.message }}</div>
  </div>

  <div v-else class="p-4 text-center text-red-500">
    No tienes permiso para ver esta página.
  </div>
</template>
