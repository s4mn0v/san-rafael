      
<template>
  <div> <!-- Contenedor principal -->
    <h1 class="text-2xl font-semibold uppercase tracking-widest">Gestión de Animales</h1>

    <UDivider class="my-6" />

    <!-- Sección para mostrar la lista de animales -->
    <h2 class="text-xl font-semibold mb-4">Lista de Animales</h2>

    <!-- Botón para refrescar manualmente (útil para pruebas) -->
    <UButton @click="refreshAnimals" :loading="pending" class="mb-4" icon="i-heroicons-arrow-path">
      Refrescar Lista
    </UButton>
     <!-- Podrías añadir aquí un botón para ir a la página/modal de crear animal -->
     <!-- <UButton to="/animals/create" icon="i-heroicons-plus-circle">Agregar Animal</UButton> -->

    <!-- Estado de Carga -->
    <div v-if="pending" class="space-y-2">
       <p>Cargando animales...</p>
       <USkeleton class="h-10 w-full" />
       <USkeleton class="h-10 w-full" />
       <USkeleton class="h-10 w-full" />
    </div>

    <!-- Estado de Error -->
    <div v-else-if="error" class="p-4 bg-red-100 text-red-700 border border-red-300 rounded">
      <p class="font-semibold">Error al cargar los animales:</p>
      <p>{{ error.message || 'Ha ocurrido un error inesperado.' }}</p>
      <!-- Mostrar más detalles si están disponibles -->
      <pre v-if="error.data" class="text-xs mt-2">{{ error.data }}</pre>
    </div>

    <!-- Datos Cargados -->
    <div v-else-if="animals && animals.length > 0">
      <UTable :rows="animals" :columns="animalColumns">
        <!-- Opcional: Personalizar celdas específicas si necesitas formato o acciones -->
        <template #fecha_nacimiento-data="{ row }">
            {{ formatDate(row.fecha_nacimiento) }}
        </template>
         <template #peso_actual-data="{ row }">
            {{ row.peso_actual }} kg
        </template>
        <template #actions-data="{ row }">
           <!-- Aquí irían botones para Editar/Eliminar -->
           <UButton size="xs" color="orange" variant="ghost" icon="i-heroicons-pencil-square" class="mr-1" @click="editAnimal(row)">Editar</UButton>
           <UButton size="xs" color="red"    variant="ghost" icon="i-heroicons-trash"         @click="confirmDeleteAnimal(row)">Eliminar</UButton>
        </template>
      </UTable>
    </div>

    <!-- Sin Datos -->
    <div v-else class="p-4 bg-blue-50 text-blue-700 border border-blue-200 rounded">
      <p>No hay animales registrados todavía.</p>
      <!-- Botón para agregar el primer animal -->
       <!-- <UButton to="/animals/create" icon="i-heroicons-plus-circle">Agregar el primero</UButton> -->
    </div>

    <!-- Tu sección de Dashboard (si sigue en la misma página) -->
    <UDivider class="my-6" />
    <h2 class="text-xl font-semibold mb-4">Dashboard Resumen</h2>
     <div class="grid grid-cols-2 gap-4">
        <DashboardCard title="Total de Animales" icon="i-healthicons-animal-cow">
           <!-- Usar el conteo real -->
           <div class="px-6 text-3xl font-bold">{{ animals ? animals.length : 0 }}</div>
        </DashboardCard>

        <DashboardCard title="Incremento de Peso (Mensual)" icon="i-healthicons-chart-line">
            <!-- Calcular esto requeriría más lógica -->
           <div class="px-6 text-3xl font-bold">-- kg</div>
        </DashboardCard>
     </div>

     <UDivider class="my-6" />

     <DashboardCard title="Control de Inventario" icon="i-heroicons-archive-box">
       <div class="grid grid-cols-3 gap-4 content-container p-4">
         <DashboardContainer title="Total de Insumos" icon="i-heroicons-cube">
           <div class="text-2xl font-semibold">--</div>
         </DashboardContainer>
         <DashboardContainer title="Stock Bajo" icon="i-heroicons-exclamation-triangle">
           <div class="text-2xl font-semibold">--</div>
         </DashboardContainer>
         <DashboardContainer title="Gastos Recientes" icon="i-heroicons-banknotes">
           <div class="text-2xl font-semibold">$ --</div>
         </DashboardContainer>
       </div>
     </DashboardCard>

  </div> <!-- Fin contenedor principal -->
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Animal } from '~/types/supabase'; // Importa el tipo Animal
import type { Database } from '~/types/supabase'; // Necesario para el tipo de useFetch
import { useSupabaseUser } from '#imports'; // O '@nuxtjs/supabase' si #imports no funciona

const user = useSupabaseUser();

// Comprueba si el usuario está cargado cuando el componente se monta
onMounted(() => {
  console.log('User state on mount:', user.value);
  if (!user.value) {
      console.warn("¡El usuario no parece estar autenticado en el lado del cliente al montar la página!");
  }
});

// Asegura que esta página use el layout que maneja la autenticación
definePageMeta({
  layout: 'logged'
});

// --- Configuración de la Tabla ---
const animalColumns = [
  { key: 'id_animal', label: 'ID', sortable: true },
  { key: 'raza', label: 'Raza', sortable: true },
  { key: 'tipo_animal', label: 'Tipo', sortable: true },
  { key: 'peso_actual', label: 'Peso (kg)', sortable: true },
  { key: 'fecha_nacimiento', label: 'Nacimiento', sortable: true },
  { key: 'estado_salud', label: 'Salud' },
  { key: 'venta', label: 'Vendido' },
  { key: 'actions', label: 'Acciones' } // Columna para botones
];

// --- Data Fetching ---
// Llama a nuestro endpoint API usando useFetch
// Especifica el tipo de retorno esperado: { animals: Animal[] }
const { data, pending, error, refresh: refreshAnimals } = useFetch('/api/animal/get', {
  // `key` es útil para la caché si usas el mismo fetch en varios lugares
  key: 'animal-list',
  // `transform` te permite modificar los datos antes de que lleguen al componente
  transform: (response: { animals: Database['public']['Tables']['animals']['Row'][] }) => {
    // Devuelve solo el array de animales. Podrías hacer más transformaciones aquí.
    return response.animals;
  },
  // `lazy: true` carga los datos en el cliente después de la navegación inicial,
  // puede hacer la carga inicial de la página más rápida. Quítalo si necesitas SSR de los datos.
  lazy: true,
  // `server: false` haría que la petición SÓLO se ejecute en el cliente.
  // Déjalo en `true` (por defecto) si quieres que funcione con SSR/SSG.
});

// Computed property para acceder de forma segura y reactiva al array de animales
// Devuelve un array vacío si data.value es null/undefined o si la carga falló
const animals = computed<Animal[]>(() => data.value || []);

// --- Funciones Auxiliares y de Acción ---

// Función simple para formatear fechas (puedes usar una librería como date-fns)
function formatDate(dateString: string | null): string {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('es-CO', { // Ajusta el locale según necesites
        year: 'numeric', month: 'short', day: 'numeric'
    });
  } catch (e) {
    return dateString; // Devuelve original si falla el parseo
  }
}

// Placeholder para funciones de edición y eliminación
function editAnimal(animal: Animal) {
  console.log('Editar animal:', animal.id_animal);
  // Aquí navegarías a una página de edición o abrirías un modal
  // Ejemplo: await navigateTo(`/animals/edit/${animal.id_animal}`);
   alert(`Funcionalidad Editar para ${animal.id_animal} no implementada.`);
}

async function confirmDeleteAnimal(animal: Animal) {
  console.log('Eliminar animal:', animal.id_animal);
  if (confirm(`¿Estás seguro de eliminar el animal "${animal.id_animal}" (${animal.raza})? Esta acción no se puede deshacer.`)) {
     try {
        // Llama al endpoint DELETE que creaste antes
        await $fetch(`/api/animal/delete?id=${animal.id_animal}`, {
           method: 'DELETE',
        });
        alert('Animal eliminado con éxito.');
        // Refresca la lista para quitar el animal eliminado
        await refreshAnimals();
     } catch (err: any) {
        console.error("Error al eliminar animal:", err);
        alert(`Error al eliminar: ${err.data?.statusMessage || err.message}`);
     }
  }
}

// --- Lógica del Dashboard (si es necesario calcular algo más) ---
// const totalWeightIncrease = computed(() => { ... }); // Ejemplo

</script>

<style scoped>
/* Puedes añadir estilos específicos aquí si es necesario */
.content-container {
  /* background-color: #f9f9f9; */
}
</style>

    