<template>
  <div class="flex flex-col md:flex-row h-screen bg-[var(--color-m2)] dark:bg-[var(--color-m7)]">

    <!-- Sidebar (Oculto en móviles, visible en pantallas medianas y grandes) -->
    <div class="hidden md:flex flex-col items-center w-24 md:w-48 h-full text-[var(--color-m7)]">

      <!-- Logo (Solo visible en pantallas medianas y grandes) -->
      <a class="hidden md:flex flex-col items-center justify-center w-full px-3 mt-6 md:mt-8 text-center" href="#">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"
          class="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 text-[var(--color-m7)]">
          <path fill="currentColor"
            d="M216 122a6 6 0 0 0-5.09 2.82a177 177 0 0 1-16.69 22.65l-17.87-94a14 14 0 0 0-22.5-8.35l-.1.08l-24.53 20.39a2 2 0 0 1-2.44 0l-24.53-20.43l-.1-.08a14 14 0 0 0-22.5 8.34l-17.88 94.07a178 178 0 0 1-16.68-22.67A6 6 0 0 0 40 122a38 38 0 0 0 0 76h176a38 38 0 0 0 0-76M91.44 55.65a2 2 0 0 1 3.18-1.22l24.54 20.43l.09.08a13.93 13.93 0 0 0 17.5 0l.09-.08l24.54-20.43a2 2 0 0 1 3.18 1.23L178.69 130H77.31ZM40 186a26 26 0 0 1-3.17-51.81c17.67 27.25 36.7 42.86 52.79 51.81Zm88 0c-.34 0-26.71-.41-56-27.91L75 142h106l3 16.05a115.8 115.8 0 0 1-28.89 20.19C139.38 185.81 128.08 186 128 186m88 0h-49.62c16.09-8.95 35.12-24.56 52.79-51.81A26 26 0 0 1 216 186" />
        </svg>
        <span class="text-xs sm:text-sm font-bold md:block mt-2 uppercase tracking-widest mb-10">San. Rafael</span>
        <UDivider label=""/>
      </a>

      <!-- Menú lateral (Solo en pantallas medianas y grandes) -->
      <div class="hidden md:flex flex-col w-full px-2 flex-1 overflow-y-auto max-h-screen">
        <a class="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-700 hover:text-gray-300" href="#">
          <UIcon name="i-heroicons-home" class="w-6 h-6" />
          <span class="ml-2 text-sm font-medium">Inicio</span>
        </a>
        <a class="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-700 hover:text-gray-300" href="#">
          <UIcon name="i-healthicons-animal-cow-outline" class="w-6 h-6" />
          <span class="ml-2 text-sm font-medium">Animales</span>
        </a>
        <a class="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-700 hover:text-gray-300" href="#">
          <UIcon name="i-healthicons-i-exam-multiple-choice-outline" class="w-6 h-6" />
          <span class="ml-2 text-sm font-medium">Inventario</span>
        </a>
        <a class="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-700 hover:text-gray-300" href="#">
          <UIcon name="i-healthicons-syringe-outline-24px" class="w-6 h-6" />
          <span class="ml-2 text-sm font-medium">Reproduccion</span>
        </a>
        <a class="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-700 hover:text-gray-300" href="#">
          <UIcon name="i-healthicons-biomarker" class="w-6 h-6" />
          <span class="ml-2 text-sm font-medium">Genealogia</span>
        </a>
        <a class="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-700 hover:text-gray-300" href="#">
          <UIcon name="i-heroicons-user-16-solid" class="w-6 h-6" />
          <span class="ml-2 text-sm font-medium">Cuenta</span>
        </a>
      </div>

      <a class="flex items-center justify-between w-full h-16 px-4 text-[var(--color-m7)] cursor-default" href="#">
        <Logout class="w-8 h-8" />
        <Theming class="w-8 h-8" />
      </a>
    </div>

    <!-- Contenido principal -->
    <div class="flex-1 m-4 p-4 overflow-auto bg-[var(--color-m7)] dark:bg-gray-900 md:m-4 rounded-xl mb-16 md:pb-4">
      <slot />
    </div>

    <!-- Menú inferior (Solo en móviles) -->
    <div class="fixed bottom-0 left-0 w-full bg-gray-900 flex md:hidden justify-around py-3 border-t border-gray-700">
      <a class="flex flex-col items-center text-gray-400 hover:text-gray-300" href="#">
        <UIcon name="i-heroicons-home-solid" class="w-6 h-6" />
      </a>
      <a class="flex flex-col items-center text-gray-400 hover:text-gray-300" href="#">
        <UIcon name="i-heroicons-magnifying-glass-20-solid" class="w-6 h-6" />
      </a>
      <a class="flex flex-col items-center text-gray-400 hover:text-gray-300" href="#">
        <UIcon name="i-heroicons-cog-6-tooth-solid" class="w-6 h-6" />
      </a>
      <a class="flex flex-col items-center text-gray-400 hover:text-gray-300" href="#">
        <UIcon name="i-heroicons-bell-alert-solid" class="w-6 h-6" />
      </a>
      <a class="flex flex-col items-center text-gray-400 hover:text-gray-300" href="#">
        <UIcon name="i-heroicons-user-16-solid" class="w-6 h-6" />
      </a>
    </div>

  </div>
</template>
