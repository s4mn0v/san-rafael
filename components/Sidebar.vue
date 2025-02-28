<template>
  <div class="flex h-screen bg-[var(--color-m2)] dark:bg-[var(--color-m7)]">
    <!-- Sidebar -->
    <div class="flex flex-col items-center w-24 md:w-48 h-full text-gray-400">
      <!-- Logo -->
      <a class="flex flex-col items-center justify-center w-full px-3 mt-6 md:mt-8 text-center" href="#">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"
          class="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 text-[var(--color-m7)]">
          <path fill="currentColor"
            d="M216 122a6 6 0 0 0-5.09 2.82a177 177 0 0 1-16.69 22.65l-17.87-94a14 14 0 0 0-22.5-8.35l-.1.08l-24.53 20.39a2 2 0 0 1-2.44 0l-24.53-20.43l-.1-.08a14 14 0 0 0-22.5 8.34l-17.88 94.07a178 178 0 0 1-16.68-22.67A6 6 0 0 0 40 122a38 38 0 0 0 0 76h176a38 38 0 0 0 0-76M91.44 55.65a2 2 0 0 1 3.18-1.22l24.54 20.43l.09.08a13.93 13.93 0 0 0 17.5 0l.09-.08l24.54-20.43a2 2 0 0 1 3.18 1.23L178.69 130H77.31ZM40 186a26 26 0 0 1-3.17-51.81c17.67 27.25 36.7 42.86 52.79 51.81Zm88 0c-.34 0-26.71-.41-56-27.91L75 142h106l3 16.05a115.8 115.8 0 0 1-28.89 20.19C139.38 185.81 128.08 186 128 186m88 0h-49.62c16.09-8.95 35.12-24.56 52.79-51.81A26 26 0 0 1 216 186" />
        </svg>
        <span class="text-xs sm:text-sm font-bold md:block mt-2">The App</span>
      </a>

      <!-- Menús con scroll -->
      <div class="w-full px-2 flex-1 overflow-y-auto max-h-screen">
        <div class="flex flex-col items-center md:items-start w-full mt-3">
          <a class="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-700 hover:text-gray-300" href="#">
            <UIcon name="i-heroicons-home-solid" class="w-6 h-6" />
            <span class="ml-2 text-sm font-medium hidden md:inline">Inicio</span>
          </a>
          <a class="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-700 hover:text-gray-300" href="#">
            <UIcon name="i-heroicons-magnifying-glass-20-solid" class="w-6 h-6" />
            <span class="ml-2 text-sm font-medium hidden md:inline">Animales</span>
          </a>
          <!-- Más menús de ejemplo -->
          <a class="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-700 hover:text-gray-300" href="#">
            <UIcon name="i-heroicons-cog-6-tooth-solid" class="w-6 h-6" />
            <span class="ml-2 text-sm font-medium hidden md:inline">Inventario</span>
          </a>
          <a class="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-700 hover:text-gray-300" href="#">
            <UIcon name="i-heroicons-bell-alert-solid" class="w-6 h-6" />
            <span class="ml-2 text-sm font-medium hidden md:inline">Reproduccion</span>
          </a>
          <a class="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-700 hover:text-gray-300" href="#">
            <UIcon name="i-heroicons-bell-alert-solid" class="w-6 h-6" />
            <span class="ml-2 text-sm font-medium hidden md:inline">Genealogia</span>
          </a>
          <a class="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-700 hover:text-gray-300" href="#">
            <UIcon name="i-heroicons-chart-bar-square-solid" class="w-6 h-6" />
            <span class="ml-2 text-sm font-medium hidden md:inline">Cuenta</span>
          </a>
          <!-- Agrega más elementos para probar el scroll -->
        </div>
      </div>

      <!-- Profile -->
      <a class="flex items-center justify-center w-16 md:w-full h-16 hover:text-gray-300" href="#">
        <UIcon name="i-heroicons-user-16-solid" class="w-6 h-6" />
        <span class="ml-2 text-sm font-medium hidden md:inline">Profile</span>
      </a>
    </div>

    <!-- Main Content -->
    <div class="flex-1 p-4 overflow-auto bg-[var(--color-m7)] dark:bg-gray-900 m-4 rounded-xl">
      <slot />
    </div>
  </div>
</template>
