<template>
  <div>
    <h1>Perfiles de Usuario</h1>

    <!-- Envuelve el div condicional con el componente Transition -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-2 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-2 opacity-0"
    >
      <!-- El v-if se mantiene en el elemento que quieres animar -->
      <div v-if="selectedRows.length > 0"
        class="mb-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700">
        <span>{{ selectedRows.length }} usuario(s) seleccionado(s).</span>
        <!-- Añade botones para acciones en lote -->
        <UButton size="xs" color="red" variant="outline" class="ml-4">Eliminar Seleccionados</UButton>
        <UButton size="xs" color="blue" variant="outline" class="ml-2">Cambiar Rol...</UButton>
      </div>
    </Transition>

    <!-- El resto de tu template (Tabla, etc.) -->
    <div v-if="pending">
      Cargando perfiles...
    </div>
    <div v-else-if="error">
      <p class="text-red-500">No se pudieron cargar los perfiles. Por favor, inténtalo de nuevo.</p>
      <pre>{{ error.message }}</pre>
    </div>
    <UTable
      v-else
      ref="userTable"
      v-model="selectedRows"
      sticky
      :columns="columns"
      :rows="profiles || []"
      class="flex-1 max-h-[400px]"
      >
      <!-- ... slots ... -->
       <template #actions-data="{ row }">
        <UDropdown :items="getDropdownItems(row as Profile)" :key="`dropdown-${row.id}`">
          <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid"
            aria-label="Abrir menú de acciones" />
        </UDropdown>
      </template>
      <template #role-data="{ row }">
        <span>{{ row.role ?? 'No asignado' }}</span>
      </template>
    </UTable>

    <!-- Footer de conteo de selección -->
    <div v-if="!pending && !error"
      class="mt-2 px-3 py-3.5 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
      {{ selectedRows.length }} de
      {{ profiles?.length ?? 0 }} fila(s) seleccionada(s).
    </div>

  </div>
</template>

<!-- El script permanece igual que en la respuesta anterior -->
<script setup lang="ts">
import { ref, computed } from 'vue';
import type { DropdownItem, TableColumn } from '#ui/types';
import { useToast } from '#imports';

interface Profile {
  id: string | number;
  email: string;
  role: string;
}

definePageMeta({
  layout: 'logged',
  middleware: ['role-guard'],
  roles: ['admin']
});

const toast = useToast();
const selectedRows = ref<Profile[]>([]);
const columns: TableColumn[] = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Rol', sortable: true },
  { key: 'actions', label: 'Acciones' }
];

const { data: profiles, pending, error, refresh } = await useFetch<Profile[]>('/api/users/users');

if (error.value) {
  console.error('Error fetching profiles:', error.value);
  toast.add({ title: 'Error al cargar perfiles', description: error.value.message, color: 'red' });
}

function getDropdownItems(row: Profile): DropdownItem[][] {
   return [
    [
      {
        label: 'Editar',
        icon: 'i-heroicons-pencil-square-20-solid',
        click: () => {
          console.log('Editar perfil:', row.id);
          toast.add({ title: `Editando usuario ${row.id}` });
        }
      }
    ],
    [
      {
        label: 'Eliminar',
        icon: 'i-heroicons-trash-20-solid',
        class: 'text-red-500 dark:text-red-400',
        click: () => {
          console.log('Eliminar perfil:', row.id);
          if (confirm(`¿Estás seguro de que quieres eliminar el perfil ${row.email}?`)) {
            toast.add({ title: `Eliminando usuario ${row.id}`, color: 'red' });
            // Lógica para eliminar...
          }
        }
      }
    ]
  ];
}

// const selectedProfileObjects = computed(() => selectedRows.value); // Puedes quitarlo si no lo usas
const tableRef = useTemplateRef<any>('userTable');

</script>