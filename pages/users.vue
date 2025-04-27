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
    
    <!-- Añadir estados de carga y error -->
    <div v-if="pending" class="mt-4 text-[var(--color-m2)] dark:text-[var(--color-m7)]">Cargando usuarios...</div>
    <div v-if="error" class="mt-4 text-[var(--color-error-light)] dark:text-[var(--color-error-dark)]">Error: {{ error.message }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
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

const { data: resp, pending, error, refresh: fetchUsers } = await useAsyncData('users', async () => {
  try {
    return await $fetch<{
      data: Profile[]
      total: number
      page: number
      pageSize: number
    }>('/api/users/users')
  } catch (err) {
    console.error('Error al obtener usuarios:', err)
    throw err
  }
})

const users = computed(() => resp.value?.data || [])

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
</script>