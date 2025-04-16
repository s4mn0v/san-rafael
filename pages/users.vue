<template>
  <div>
    <h1 class="text-2xl font-semibold mb-4">Users Management</h1>

    <UAlert v-if="error" icon="i-heroicons-exclamation-triangle" color="error" variant="soft"
      title="Error Fetching Users"
      :description="error?.data?.message || (error as any).message || 'An unknown error occurred.'" class="mb-4" />

    <UCard class="bg-[var(--color-m2)] dark:bg-[var(--color-m7)]">
      <template #header>
        <span clas="text-sm font-semibold">Usuarios</span>
      </template>
      <template #default>
        <UTable ref="table" v-model:row-selection="rowSelection" :columns="columns" :data="users ?? []"
          :loading="pending" :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No users found.' }">
          <template #loading-state>
            <div class="flex items-center justify-center h-32">
              <i class="loader"></i>
              <span>Loading users...</span>
            </div>
          </template>
        </UTable>
      </template>
    </UCard>


    <!-- Optional: Add this to show selection count -->
    <div v-if="table?.tableApi"
      class="px-4 py-3.5 border-t border-(--ui-border-accented) text-sm text-(--ui-text-muted)">
      {{ table.tableApi.getFilteredSelectedRowModel().rows.length || 0 }} de
      {{ table.tableApi.getFilteredRowModel().rows.length || 0 }} usuario(s) seleccionado(s).
    </div>
    <ClientOnly>
      <UButton label="Refresh Users" icon="i-heroicons-arrow-path" :loading="pending" @click="() => refresh()"
        class="bg-[var(--color-m2)] text-white hover:bg-[var(--color-m5)] dark:bg-[var(--color-m7)] dark:text-[var(--color-m2)] dark:hover:bg-[var(--color-m5)] dark:hover:text-[var(--color-m7)] cursor-pointer"/>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import type { Database } from '~/types/supabase';
import type { TableColumn } from '@nuxt/ui';
import { h, resolveComponent } from 'vue'

const UCheckbox = resolveComponent('UCheckbox')
const rowSelection = ref<Record<string, boolean>>({})
const table = ref()

type Profile = Database['public']['Tables']['profiles']['Row'];

const columns: TableColumn<Profile>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox, {
        modelValue: table.getIsSomePageRowsSelected()
          ? 'indeterminate'
          : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
          table.toggleAllPageRowsSelected(!!value),
        'aria-label': 'Select all'
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        modelValue: row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
        'aria-label': 'Select row'
      })
  },
  {
    accessorKey: 'id',
    header: 'User ID'
  },
  {
    accessorKey: 'email',
    header: 'Correo'
  },
  {
    accessorKey: 'role',
    header: 'Role'
  },
];

const { data: users, pending, error, refresh } = await useAsyncData<Profile[], CustomError>('users',
  () => $fetch('/api/users/users'), {
  lazy: true,
  server: false,
});

watch(error, (newError) => {
  if (newError) {
    console.error('Error fetching users:',
      (newError as any).data?.message || (newError as Error).message);
  }
});

definePageMeta({
  layout: 'logged',
  middleware: ['role-guard'],
  roles: ['admin'],
});
</script>

<style scoped>
.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  display: inline-block;
  margin-right: 8px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>