<template>
  <h1>Usuarios</h1>
  <Table :columns="columns" :data="users" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Profile } from '~/types/supabase'

definePageMeta({
  layout: 'logged',
  middleware: 'role-guard'
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

// Opción 1: Usar onMounted con $fetch (client-side only)
onMounted(fetchUsers)

// Opción 2: Mejor práctica - Usar useAsyncData (SSR + client-side)
// const { data, error } = await useAsyncData('users', fetchUsers)
</script>