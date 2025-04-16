<template>
  <div class="flex h-screen flex-col bg-[var(--color-m2)] md:flex-row dark:bg-[var(--color-m7)]">
    <!-- Sidebar with collapsible option -->
    <div
      :class="['hidden md:flex flex-col items-center h-full text-[var(--color-m7)] transition-all duration-300 py-4', collapsed ? 'w-16' : 'w-48']">
      <!-- Logo (Only visible when the menu is NOT collapsed) -->
      <NuxtLink v-if="!collapsed"
        class="mt-6 mb-6 hidden w-full flex-col items-center justify-center px-3 text-center md:mt-8 md:flex" to="/">
        <!-- SVG Logo -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"
          class="h-10 w-10 text-[var(--color-m7)] sm:h-12 sm:w-12 md:h-16 md:w-16 lg:h-20 lg:w-20 dark:text-[var(--color-m2)]">
          <path fill="currentColor"
            d="M216 122a6 6 0 0 0-5.09 2.82a177 177 0 0 1-16.69 22.65l-17.87-94a14 14 0 0 0-22.5-8.35l-.1.08l-24.53 20.39a2 2 0 0 1-2.44 0l-24.53-20.43l-.1-.08a14 14 0 0 0-22.5 8.34l-17.88 94.07a178 178 0 0 1-16.68-22.67A6 6 0 0 0 40 122a38 38 0 0 0 0 76h176a38 38 0 0 0 0-76M91.44 55.65a2 2 0 0 1 3.18-1.22l24.54 20.43l.09.08a13.93 13.93 0 0 0 17.5 0l.09-.08l24.54-20.43a2 2 0 0 1 3.18 1.23L178.69 130H77.31ZM40 186a26 26 0 0 1-3.17-51.81c17.67 27.25 36.7 42.86 52.79 51.81Zm88 0c-.34 0-26.71-.41-56-27.91L75 142h106l3 16.05a115.8 115.8 0 0 1-28.89 20.19C139.38 185.81 128.08 186 128 186m88 0h-49.62c16.09-8.95 35.12-24.56 52.79-51.81A26 26 0 0 1 216 186" />
        </svg>
        <span
          class="mt-2 text-xs font-bold tracking-widest text-[var(--color-m7)] uppercase sm:text-sm md:block dark:text-[var(--color-m2)]">San.
          Rafael</span>
      </NuxtLink>

      <!-- Sidebar menu with option to show only icons -->
      <div class="relative flex w-full flex-1 flex-col overflow-y-auto px-2 space-y-2">
        <!-- Menu Items generated dynamically based on role -->
        <NuxtLink v-for="item in filteredNavigationItems" :key="item.to" :to="item.to"
          class="group flex h-12 w-full items-center rounded px-3 text-[var(--color-m7)] transition-colors hover:bg-[var(--color-m7)] hover:text-[var(--color-m2)] dark:text-[var(--color-m2)] dark:hover:bg-[var(--color-m2)] dark:hover:text-[var(--color-m7)]"
          active-class="!bg-[var(--color-m7)] dark:!bg-[var(--color-m2)]">
          <UIcon :name="item.icon"
            class="h-6 w-6 text-[var(--color-m7)] group-hover:text-[var(--color-m2)] group-[.router-link-exact-active]:text-[var(--color-m2)] dark:text-[var(--color-m2)] dark:group-hover:text-[var(--color-m7)] dark:group-[.router-link-exact-active]:text-[var(--color-m7)] transition-colors" />

          <span v-if="!collapsed"
            class="ml-4 text-xs font-bold tracking-widest uppercase text-inherit transition-colors group-hover:text-[var(--color-m2)] dark:text-[var(--color-m2)] dark:group-hover:text-[var(--color-m7)] dark:group-[.router-link-exact-active]:text-[var(--color-m7)] group-[.router-link-exact-active]:text-[var(--color-m2)]">
            {{ item.label }}
          </span>
        </NuxtLink>

        <!-- Button to Expand/Collapse Sidebar -->
        <div class="absolute bottom-0 right-0 flex justify-end">
          <button @click="collapsed = !collapsed"
            class="transform rounded-l-md px-2 pt-3 pb-2 text-[var(--color-m7)] transition-colors hover:bg-[var(--color-m7)] hover:text-[var(--color-m2)] dark:text-[var(--color-m2)] dark:hover:bg-[var(--color-m2)] dark:hover:text-[var(--color-m7)] cursor-pointer">
            <UIcon :name="collapsed ? 'i-heroicons-chevron-right' : 'i-heroicons-chevron-left'" class="h-6 w-6" />
          </button>
        </div>
      </div>

      <!-- Logout and Theming Buttons -->
      <div :class="['flex w-full px-3 text-[var(--color-m7)] dark:text-[var(--color-m2)] transition-all duration-300 mt-auto',
        collapsed ? 'flex-col items-center gap-2 py-4' : 'flex-row justify-between h-16 items-center']">
        <Logout />
        <Theming />
      </div>
    </div>

    <!-- Main Content -->
    <div
      class="m-4 mb-16 flex-1 overflow-auto rounded-xl bg-[var(--color-m7)] p-4 md:m-4 md:pb-4 dark:bg-[var(--color-m2)]">
      <slot />
    </div>

    <!-- Bottom Navigation Menu (Only for Mobile) - Apply filtering here too -->
    <div
      class="fixed bottom-0 left-0 z-50 flex w-full justify-around bg-[var(--color-m2)] py-2 md:hidden dark:border-gray-700 dark:bg-[var(--color-m7)]">
      <!-- Use the same filtered list for mobile -->
      <NuxtLink v-for="item in filteredNavigationItems" :key="`mobile-${item.to}`" :to="item.to"
        class="flex h-12 w-12 items-center justify-center text-[var(--color-m7)] transition-all duration-200 hover:text-gray-900 dark:text-[var(--color-m2)] dark:hover:text-white"
        active-class="!bg-[var(--color-m2)] !text-[var(--color-m7)] !rounded-full">
        <UIcon :name="item.icon" class="h-6 w-6 text-inherit" :title="item.label" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCookie, useState } from '#app' // Importar useState

// Tipado para los items de navegación (opcional pero recomendado)
interface NavigationItem {
  label: string;
  icon: string;
  to: string;
  requiredRole?: string | string[]; // Nuevo: Rol(es) requerido(s) para ver este item
}

const collapsed = useCookie('sidebar-collapsed', { default: () => false, sameSite: 'lax' });

// Acceder al estado global del rol del usuario
const userRole = useState<string | null>('userRole'); // Usa la misma clave que en el middleware

// Lista base de todos los posibles items de navegación
const allNavigationItems: NavigationItem[] = [
  { label: 'Inicio', icon: 'i-heroicons-home-solid', to: '/' },
  { label: 'Animales', icon: 'i-healthicons-animal-cow', to: '/animals' },
  { label: 'Inventario', icon: 'i-healthicons-i-exam-multiple-choice', to: '/stock' },
  { label: 'Reproducción', icon: 'i-healthicons-syringe', to: '/reproduction' },
  { label: 'Genealogía', icon: 'i-healthicons-biomarker-outline', to: '/genealogy' },
  { label: 'Cuenta', icon: 'i-heroicons-user-solid', to: '/account' }, // ¡Aquí definimos el rol requerido!
  { label: 'Usuarios', icon: 'i-heroicons-users-solid', to: '/users', requiredRole: 'admin' },
  // Puedes añadir más items y especificar `requiredRole` si es necesario
  // { label: 'Admin Panel', icon: 'i-heroicons-cog-solid', to: '/admin', requiredRole: 'admin' },
  // { label: 'Mi Perfil', icon: 'i-heroicons-user-circle', to: '/profile' }, // Sin requiredRole = visible para todos los logueados (si userRole no es null)
];

// Propiedad computada para filtrar los items según el rol actual
const filteredNavigationItems = computed(() => {
  const currentRole = userRole.value; // Obtiene el rol actual del estado

  // Si no hay rol (usuario no logueado), podrías mostrar un conjunto diferente o ninguno
  if (!currentRole) {
    // Por ejemplo, mostrar solo 'Inicio' si no está logueado
    // return allNavigationItems.filter(item => item.to === '/');
    return []; // O no mostrar nada en el menú si no está logueado
  }

  return allNavigationItems.filter(item => {
    // Si el item no tiene 'requiredRole', es visible para cualquier usuario logueado.
    if (!item.requiredRole) {
      return true;
    }

    // Si tiene 'requiredRole', verifica si el rol del usuario coincide.
    // Esto maneja tanto un string simple como un array de roles permitidos.
    if (Array.isArray(item.requiredRole)) {
      return item.requiredRole.includes(currentRole);
    } else {
      return item.requiredRole === currentRole;
    }
  });
});
</script>