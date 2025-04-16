<template>
  <div>
    <div class="p-4">
      <h1 class="text-2xl font-semibold mb-4">Users Management</h1>

      <UAlert v-if="error" icon="i-heroicons-exclamation-triangle" color="error" variant="soft"
        title="Error Fetching Users"
        :description="error?.data?.message || (error as any).message || 'An unknown error occurred.'" class="mb-4" />

      <UTable :columns="columns" :data="users ?? []" :loading="pending"
        :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No users found.' }">
        <template #loading-state>
          <div class="flex items-center justify-center h-32">
            <i class="loader"></i>
            <span>Loading users...</span>
          </div>
        </template>
      </UTable>
      <ClientOnly>
        <UButton label="Refresh Users" icon="i-heroicons-arrow-path" :loading="pending" @click="() => refresh()"
          class="mt-4" />
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Database } from '~/types/supabase';
import type { TableColumn } from '@nuxt/ui';

type Profile = Database['public']['Tables']['profiles']['Row'];

const columns: TableColumn<Profile>[] = [
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