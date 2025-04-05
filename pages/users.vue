<script setup lang="ts">
definePageMeta({
  layout: 'logged',
  middleware: ['role-guard'],
  roles: ['admin']
})

// Define las columnas que quieres mostrar en la tabla.
// La propiedad 'key' debe coincidir con el nombre de la columna en Supabase (o como la devuelva tu API).
// La propiedad 'label' es lo que se mostrará como encabezado de la columna.
const columns = [{
  key: 'id',
  label: 'ID'
}, {
  key: 'email',    // Asume que tienes una columna 'email' (¡Cuidado con la privacidad!)
  label: 'Email'
}, {
  key: 'role', // Asume que tienes una columna 'created_at'
  label: 'Rol',
  sortable: true // Opcional: permite ordenar por esta columna
}]

// Usamos useFetch para llamar a nuestro endpoint API
// Especificamos el tipo de dato esperado para mejor autocompletado y seguridad de tipos
// Reemplaza `Profile[]` con el tipo correcto si lo tienes, o usa `any[]` si no.
const { data: profiles, pending, error, refresh } = await useFetch<Profile[]>('/api/users/users', {
  // lazy: true, // Descomenta si quieres carga diferida (mostrará 'loading' inicialmente)
  // server: false // Descomenta si SÓLO quieres que se ejecute en el cliente (menos común para listas iniciales)
})

// Puedes manejar el error de forma más explícita si lo deseas
if (error.value) {
  console.error('Error fetching profiles:', error.value)
  // Podrías mostrar una notificación al usuario aquí
}

// Función para refrescar los datos (ej. después de una acción)
// function refreshData() {
//   refresh()
// }

</script>

<template>
  <div> <!-- Envuelve en un div o fragmento si tienes más elementos -->
    <h1>User Profiles</h1>

    <!-- Muestra un indicador de carga mientras se obtienen los datos -->
    <div v-if="pending">
      Cargando perfiles...
      <!-- O usa un componente de esqueleto de Nuxt UI -->
      <!-- <USkeleton class="h-12 w-full mb-4" />
           <USkeleton class="h-8 w-full mb-2" v-for="i in 5" :key="i" /> -->
    </div>

    <!-- Muestra un mensaje de error si la carga falló -->
    <div v-else-if="error">
      <p class="text-red-500">No se pudieron cargar los perfiles. Por favor, inténtalo de nuevo.</p>
      <pre>{{ error.message }}</pre>
    </div>

    <!-- Muestra la tabla si los datos se cargaron correctamente -->
    <!-- Usamos `profiles || []` como fallback por si `profiles` es null inicialmente o tras un error -->
    <UTable v-else sticky :columns="columns" :rows="profiles || []" class="flex-1 max-h-[400px]" />

    <!-- Opcional: Botón para refrescar -->
    <!-- <UButton @click="refreshData" :loading="pending" class="mt-4">
      Refresh List
    </UButton> -->

  </div>
</template>