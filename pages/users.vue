<script setup lang="ts">
// Importa el tipo correcto directamente desde @nuxt/ui
import type { DropdownItem } from '#ui/types'; // Import the official type

definePageMeta({
  layout: 'logged',
  middleware: ['role-guard'],
  roles: ['admin']
})

// Importa useToast si quieres usar notificaciones en las acciones
const toast = useToast()

// Define las columnas que quieres mostrar en la tabla.
const columns = [
  {
    key: 'id',
    label: 'ID',
    sortable: true
  },
  {
    key: 'email',
    label: 'Email'
  },
  {
    key: 'role',
    label: 'Rol',
    sortable: true
  },
  {
    key: 'actions', // Nueva columna para las acciones
    label: 'Acciones' // Etiqueta para la columna
  }
]

// Usamos useFetch para llamar a nuestro endpoint API
const { data: profiles, pending, error, refresh } = await useFetch<Profile[]>('/api/users/users')

// Puedes manejar el error de forma más explícita si lo deseas
if (error.value) {
  console.error('Error fetching profiles:', error.value)
  toast.add({ title: 'Error al cargar perfiles', description: error.value.message, color: 'red' })
}

// Función para generar los items del dropdown para cada fila (perfil)
// Usa el tipo importado DropdownItem
function getDropdownItems (row: Profile): DropdownItem[][] { // Use DropdownItem
  return [
    [
      {
        label: 'Editar',
        icon: 'i-heroicons-pencil-square-20-solid',
        // No need for 'as DropdownItem' if the structure matches
        click: () => {
          console.log('Editar perfil:', row.id)
          toast.add({ title: `Editando usuario ${row.id}` })
          // Lógica para editar...
        }
      }
    ],
    [
      {
        label: 'Eliminar',
        icon: 'i-heroicons-trash-20-solid',
        class: 'text-red-500 dark:text-red-400',
         // No need for 'as DropdownItem' if the structure matches
        click: () => {
          console.log('Eliminar perfil:', row.id)
          if (confirm(`¿Estás seguro de que quieres eliminar el perfil ${row.email}?`)) {
             toast.add({ title: `Eliminando usuario ${row.id}`, color: 'red' })
             // Lógica para eliminar...
             // deleteUser(row.id).then(refresh)
          }
        }
      }
    ]
  ]
}

</script>

<template>
  <div>
    <h1>Perfiles de Usuario</h1>

    <!-- Indicador de carga -->
    <div v-if="pending">
      Cargando perfiles...
      <!-- <USkeleton class="h-12 w-full mb-4" />
           <USkeleton class="h-8 w-full mb-2" v-for="i in 5" :key="i" /> -->
    </div>

    <!-- Mensaje de error -->
    <div v-else-if="error">
      <p class="text-red-500">No se pudieron cargar los perfiles. Por favor, inténtalo de nuevo.</p>
      <pre>{{ error.message }}</pre>
    </div>

    <!-- Tabla con la columna de acciones -->
    <UTable
      v-else
      sticky
      :columns="columns"
      :rows="profiles || []"
      class="flex-1 max-h-[400px]"
    >
      <!-- Slot personalizado para la columna 'actions' -->
      <!-- El nombre del slot es `#<key>-data` donde <key> es la 'key' definida en `columns` -->
      <template #actions-data="{ row }">
        <UDropdown :items="getDropdownItems(row)">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-ellipsis-horizontal-20-solid"
            aria-label="Abrir menú de acciones"
          />
        </UDropdown>
      </template>

      <!-- Puedes añadir otros slots si necesitas personalizar otras celdas -->
      <!-- Ejemplo para formatear el email -->
      <!--
      <template #email-data="{ row }">
        <span class="text-blue-600 dark:text-blue-400">{{ row.email }}</span>
      </template>
      -->

    </UTable>

    <!-- Opcional: Botón para refrescar -->
    <!-- <UButton @click="refresh" :loading="pending" class="mt-4">
      Refrescar Lista
    </UButton> -->

  </div>
</template>