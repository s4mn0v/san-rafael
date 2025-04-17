<template>
  <div>
    <h1 class="text-2xl font-semibold mb-4">Gestión de Animales</h1>

    <!-- Manejo de errores -->
    <UAlert v-if="error" icon="i-heroicons-exclamation-triangle" color="error" variant="soft"
      title="Error al cargar los animales"
      :description="error?.data?.message || (error as CustomError)?.statusMessage || (error as Error)?.message || 'Ocurrió un error desconocido.'"
      class="mb-4" />

    <!-- Componente DataTable -->
    <DataTable title="Animales Registrados" :columns="columns" :data="animalsData || []" :loading="pending"
      :rowSelection="rowSelection" @update:rowSelection="rowSelection = $event"
      :emptyState="{ icon: 'i-heroicons-archive-box-x-mark', label: 'No se encontraron animales.' }"
      :showSelectionCount="true" class="mb-4">
      <!-- Puedes añadir slots personalizados aquí si los necesitas más adelante -->
      <!-- Ejemplo:
        <template #actions-data="{ row }">
            <UButton icon="i-heroicons-pencil-square" @click="editAnimal(row)"></UButton>
        </template>
-->
    </DataTable>

    <!-- Botón de refrescar -->
    <div class="flex justify-start items-center mt-4">
      <ClientOnly>
        <UButton label="Refrescar Lista" icon="i-heroicons-arrow-path" :loading="pending"
          @click="() => refreshAnimals()"
          class="bg-[var(--color-m2)] text-white hover:bg-[var(--color-m5)] dark:bg-[var(--color-m7)] dark:text-[var(--color-m2)] dark:hover:bg-[var(--color-m5)] dark:hover:text-[var(--color-m7)] cursor-pointer" />
      </ClientOnly>
      <!-- El contador de selección ya está integrado en DataTable via showSelectionCount -->
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, h, resolveComponent, computed } from 'vue';
import type { TableColumn } from '@nuxt/ui';
import type { Animal } from '~/types/supabase';

type CustomError = {
  data?: { message?: string };
  statusMessage?: string;
  message?: string;
};

// Referencia para la selección de filas
const rowSelection = ref<Record<string, boolean>>({});

// Resuelve componentes de Nuxt UI para usarlos en `h`
const UCheckbox = resolveComponent('UCheckbox');
const UBadge = resolveComponent('UBadge'); // Para mostrar el estado de venta o tipo

// Define las columnas para la tabla de animales usando los campos de `Animal`
const columns: TableColumn<Animal>[] = [
  // --- Columna de Selección ---
  {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox, {
        modelValue: table.getIsSomePageRowsSelected()
          ? 'indeterminate'
          : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
          table.toggleAllPageRowsSelected(!!value),
        'aria-label': 'Seleccionar todo',
        size: 'sm', // Ajusta tamaño si quieres
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        modelValue: row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
        'aria-label': `Seleccionar fila ${row.original.id_animal}`, // Mejor accesibilidad
        size: 'sm', // Ajusta tamaño si quieres
      }),
  },
  // --- Columnas de Datos (basadas en Animal['Row']) ---
  {
    accessorKey: 'id_animal',
    header: 'ID Animal',
  },
  {
    accessorKey: 'tipo_animal',
    header: 'Tipo',
    cell: ({ row }) => { // Usa un Badge para mejor visualización
      const type = row.original.tipo_animal;
      let color: 'primary' | 'blue' | 'green' | 'orange' | 'red' = 'primary'; // Default
      switch (type) {
        case 'VACA': color = 'blue'; break;
        case 'TORO': color = 'red'; break;
        case 'NOVILLO': color = 'orange'; break;
        case 'TERNERO': case 'TERNERA': color = 'green'; break;
      }
      return h(UBadge, { label: type, color: color, variant: 'subtle' });
    }
  },
  {
    accessorKey: 'raza',
    header: 'Raza',
  },
  {
    accessorKey: 'fecha_nacimiento',
    header: 'F. Nacimiento',
    cell: ({ row }) => { // Formatea la fecha
      const dateStr = row.original.fecha_nacimiento;
      try {
        return dateStr ? new Date(dateStr).toLocaleDateString() : 'N/D';
      } catch (e) {
        console.error("Error parsing date:", dateStr, e);
        return dateStr; // Devuelve el string original si falla el parseo
      }
    }
  },
  {
    accessorKey: 'peso_actual',
    header: 'Peso Actual (kg)', // Añade unidad
    cell: ({ row }) => {
      const weight = row.original.peso_actual;
      return weight ? `${weight.toLocaleString()} kg` : 'N/D'; // Formato numérico y unidad
    }
  },
  {
    accessorKey: 'estado_salud',
    header: 'Estado Salud',
  },
  {
    accessorKey: 'venta',
    header: 'En Venta',
    cell: ({ row }) => { // Muestra Sí/No o un Badge
      const enVenta = row.original.venta;
      return h(UBadge, {
        label: enVenta ? 'Sí' : 'No',
        color: enVenta ? 'emerald' : 'gray',
        variant: 'soft'
      });
    }
  },
  // --- Opcional: Columna de Acciones ---
  // Puedes añadir una columna para botones (editar, ver detalles, eliminar)
  // {
  //   id: 'actions',
  //   header: 'Acciones',
  //   cell: ({ row }) => h('div', { class: 'flex space-x-2' }, [
  //     h(resolveComponent('UButton'), { icon: 'i-heroicons-pencil-square', size: 'xs', variant: 'ghost', onClick: () => console.log('Edit:', row.original.id_animal) }),
  //     h(resolveComponent('UButton'), { icon: 'i-heroicons-trash', size: 'xs', variant: 'ghost', color: 'red', onClick: () => console.log('Delete:', row.original.id_animal) })
  //   ]),
  //   meta: {
  //       size: 'w-24'
  //   }
  // }
];

// --- Data Fetching ---
// Llama al endpoint /api/animal/animals
// La API devuelve { animals: [...] }, así que accedemos a esa propiedad.
const { data: animalsApiResponse, pending, error, refresh: refreshAnimals } = await useAsyncData<{ animals: Animal[] }, CustomError>(
  'animalsList', // Usa una clave descriptiva y única
  () => $fetch('/api/animal/animals'), // Tu endpoint GET
  {
    lazy: true,      // Carga en cliente
    server: false,   // No ejecuta en SSR (ajústalo si lo necesitas)
    // No necesitamos 'transform' si accedemos a .animals después
    // transform: (response) => response.animals || [], // Alternativa: transforma aquí
  }
);

// Computed para obtener el array de animales de forma segura
const animalsData = computed(() => animalsApiResponse.value?.animals || []);

// --- Metadatos de la Página ---
definePageMeta({
  layout: 'logged', // Asume que tienes este layout
  middleware: ['role-guard'], // ¡IMPORTANTE! Asegúrate de proteger esta ruta si es necesario
  // roles: ['admin', 'veterinario'], // Si usas roles, especifícalos aquí
});

// --- Opcional: Funciones para acciones ---
// function editAnimal(animal: Animal) {
//   console.log('Edit animal:', animal.id_animal);
//   // Aquí iría la lógica para abrir un modal o navegar a una página de edición
// }

// function deleteAnimal(animal: Animal) {
//   console.log('Delete animal:', animal.id_animal);
//   // Lógica de confirmación y llamada a API de borrado
// }

</script>

<style scoped>
/* Estilos específicos si los necesitas */
</style>