<template>
  <div
    class="flex flex-col-reverse md:flex-row h-screen overflow-hidden bg-[var(--color-custom-500)] dark:bg-[var(--color-custom-50)] print-unset-height">
    <!-- Sidebar: bottom en móvil, izquierda en escritorio -->
    <div
      class="w-full md:w-auto flex flex-row md:flex-col px-4 py-4 md:py-8 text-[var(--color-custom-50)] dark:text-[var(--color-custom-500)] bg-[var(--color-custom-700)] md:bg-transparent flex-shrink-0">

      <!-- Nav buttons: horizontal en móvil, vertical en escritorio -->
      <div class="flex flex-1 justify-around md:justify-start md:items-center w-full md:flex-col gap-2">
        <!-- Logo: solo visible en desktop -->
        <div class="hidden md:flex flex-col items-center justify-center gap-2 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"
            class="h-10 w-10 text-[var(--color-m7)] sm:h-12 sm:w-12 md:h-16 md:w-16 lg:h-20 lg:w-20 dark:text-[var(--color-m2)]">
            <path fill="currentColor"
              d="M216 122a6 6 0 0 0-5.09 2.82a177 177 0 0 1-16.69 22.65l-17.87-94a14 14 0 0 0-22.5-8.35l-.1.08l-24.53 20.39a2 2 0 0 1-2.44 0l-24.53-20.43l-.1-.08a14 14 0 0 0-22.5 8.34l-17.88 94.07a178 178 0 0 1-16.68-22.67A6 6 0 0 0 40 122a38 38 0 0 0 0 76h176a38 38 0 0 0 0-76M91.44 55.65a2 2 0 0 1 3.18-1.22l24.54 20.43l.09.08a13.93 13.93 0 0 0 17.5 0l.09-.08l24.54-20.43a2 2 0 0 1 3.18 1.23L178.69 130H77.31ZM40 186a26 26 0 0 1-3.17-51.81c17.67 27.25 36.7 42.86 52.79 51.81Zm88 0c-.34 0-26.71-.41-56-27.91L75 142h106l3 16.05a115.8 115.8 0 0 1-28.89 20.19C139.38 185.81 128.08 186 128 186m88 0h-49.62c16.09-8.95 35.12-24.56 52.79-51.81A26 26 0 0 1 216 186" />
          </svg>
          <span class="font-extrabold tracking-widest uppercase text-2xl">San. Rafael</span>
        </div>

        <NavButtons icon="i-heroicons-home-solid" text="Inicio" to="/" />
        <NavButtons icon="i-healthicons-animal-cow" text="Animales" to="/animals" />
        <NavButtons icon="i-healthicons-i-exam-multiple-choice" text="Inventario" to="/stock" />
        <NavButtons icon="i-heroicons-cog" text="Ajustes" to="/settings" />
        <NavButtons v-if="userRole === 'admin'" icon="i-heroicons-users-solid" text="Usuarios" to="/profiles" />
      </div>

      <!-- Logout & Theming: solo en escritorio -->
      <div class="hidden md:flex flex-row items-center justify-between w-full gap-4 mt-4">
        <Logout />
        <Theming />
      </div>
    </div>

    <!-- Main content -->
    <div
      class="flex-1 overflow-auto p-4 md:p-6 bg-[var(--color-custom-50)] dark:bg-[var(--color-custom-500)] rounded-xl m-4 md:ml-0">
      <div>
        <div v-if="!isAppLoaded">Cargando...</div>
        <div v-else>
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserRole } from '~/composables/arestricted';
import { ref, onMounted, nextTick } from 'vue'

const { userRole } = useUserRole();

const isAppLoaded = ref(false)

onMounted(async () => {
  // Espera a que el DOM esté listo
  await nextTick()
  // Espera a que todas las imágenes estén cargadas
  const images = Array.from(document.images)
  if (images.length === 0) {
    isAppLoaded.value = true
  } else {
    let loaded = 0
    images.forEach(img => {
      if (img.complete) {
        loaded++
      } else {
        img.addEventListener('load', () => {
          loaded++
          if (loaded === images.length) isAppLoaded.value = true
        })
        img.addEventListener('error', () => {
          loaded++
          if (loaded === images.length) isAppLoaded.value = true
        })
      }
    })
    if (loaded === images.length) isAppLoaded.value = true
  }
})
</script>