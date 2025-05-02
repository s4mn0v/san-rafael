<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Usuarios</h1>
      <div class="flex items-center gap-2">
        <ModalUserCreate @refresh="fetchUsers" />
        <UButton v-if="selectedUsers.length" color="error" @click="deleteSelectedUsers" :disabled="isDeleting">
          <span v-if="!isDeleting">Eliminar ({{ selectedUsers.length }})</span>
          <span v-else>Eliminando...</span>
        </UButton>
      </div>
    </div>

    <Table :columns="columnsWithActions" :data="users" v-model:row-selection="rowSelection"
      @selected="selectedUsers = $event" @refresh="fetchUsers" />

    <ModalUserEdit ref="editModal" @refresh="fetchUsers" />

    <div v-if="pending" class="mt-4 text-[var(--color-m2)] dark:text-[var(--color-m7)]">Cargando usuarios...</div>
    <div v-if="error" class="mt-4 text-[var(--color-error-light)] dark:text-[var(--color-error-dark)]">
      Error: {{ error.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Profile } from '~/types/supabase'
import { h } from 'vue'
import { UButton } from '#components'
import type { Row } from '@tanstack/vue-table'

definePageMeta({
  layout: 'logged',
  middleware: 'role-guard',
  role: 'admin'
})

// Columnas con acciones
const columnsWithActions = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'email', header: 'Correo Electrónico' },
  { accessorKey: 'role', header: 'Rol' },
  {
    accessorKey: 'actions',
    header: 'Acciones',
    cell: ({ row }: { row: Row<Profile> }) =>
      h(UButton, {
        icon: 'i-heroicons-pencil',
        color: 'success',
        onClick: () => editUser(row.original),
      }),
  },
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
const editModal = ref()

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
  } finally {
    isDeleting.value = false
  }
}

const editUser = (user: Profile) => {
  editModal.value.openModal(user)
}
</script>