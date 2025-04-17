<template>
  <div>
    <h1 class="text-2xl font-semibold mb-4">Users Management</h1>

    <UAlert v-if="error" icon="i-heroicons-exclamation-triangle" color="error" variant="soft"
      title="Error Fetching Users"
      :description="error?.data?.message || (error as any).message || 'An unknown error occurred.'" class="mb-4" />

    <DataTable :rowSelection="rowSelection" @update:rowSelection="rowSelection = $event" title="Usuarios"
      :columns="columns" :data="users || []" :loading="pending" />

    <ClientOnly>
      <UButton label="Refresh Users" icon="i-heroicons-arrow-path" :loading="pending" @click="() => refresh()"
        class="bg-[var(--color-m2)] text-white hover:bg-[var(--color-m5)] dark:bg-[var(--color-m7)] dark:text-[var(--color-m2)] dark:hover:bg-[var(--color-m5)] dark:hover:text-[var(--color-m7)] cursor-pointer" />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import type { Database } from '~/types/supabase';
import type { TableColumn } from '@nuxt/ui';
import { h, resolveComponent } from 'vue'

const UCheckbox = resolveComponent('UCheckbox')
const rowSelection = ref<Record<string, boolean>>({})

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

definePageMeta({
  layout: 'logged',
  middleware: ['role-guard'],
  roles: ['admin'],
});
</script>