<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Usuarios</h1>
      <UButton v-if="selectedUsers.length" color="error" @click="deleteSelectedUsers" :disabled="isDeleting">
        <span v-if="!isDeleting">Eliminar ({{ selectedUsers.length }})</span>
        <span v-else>Eliminando...</span>
      </UButton>
    </div>

    <Table :columns="columns" :data="users" v-model:row-selection="rowSelection" @selected="selectedUsers = $event" @refresh="fetchUsers" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Profile } from '~/types/supabase'

definePageMeta({
  layout: 'logged',
  middleware: 'role-guard',
  role: 'admin'
})

const columns = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'email', header: 'Correo Electrónico' },
  { accessorKey: 'role', header: 'Rol' },
]

const users = ref<Profile[]>([])

// Función modificada usando $fetch
const fetchUsers = async () => {
  try {
    const response = await $fetch<{
      data: Profile[]
      total: number
      page: number
      pageSize: number
    }>('/api/users/users')

    users.value = response.data || []
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
    // Puedes agregar manejo de errores UI aquí
  }
}

const rowSelection = ref({})
const selectedUsers = ref<Profile[]>([])
const isDeleting = ref(false)

const deleteSelectedUsers = async () => {
  if (!selectedUsers.value.length || isDeleting.value) return

  try {
    isDeleting.value = true
    const ids = selectedUsers.value.map(u => u.id)

    await $fetch('/api/users/users', {
      method: 'DELETE',
      body: { ids }
    })

    await fetchUsers()
    rowSelection.value = {}
    selectedUsers.value = []
  } catch (error) {
    console.error('Error eliminando usuarios:', error)
    // Mostrar notificación de error
  } finally {
    isDeleting.value = false
  }
}

// Opción 1: Usar onMounted con $fetch (client-side only)
onMounted(fetchUsers)

// Opción 2: Mejor práctica - Usar useAsyncData (SSR + client-side)
// const { data, error } = await useAsyncData('users', fetchUsers)
</script>