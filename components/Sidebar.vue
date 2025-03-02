<template>
  <div class="flex h-screen flex-col bg-[var(--color-m2)] md:flex-row dark:bg-[var(--color-m7)]">
    <!-- Sidebar with collapsible option -->
    <div
      :class="['hidden md:flex flex-col items-center h-full text-[var(--color-m7)] transition-all duration-300', collapsed ? 'w-16' : 'w-48']">
      <!-- Logo (Only visible when the menu is NOT collapsed) -->
      <a v-if="!collapsed"
        class="mt-6 mb-6 hidden w-full flex-col items-center justify-center px-3 text-center md:mt-8 md:flex" href="#">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"
          class="h-10 w-10 text-[var(--color-m7)] sm:h-12 sm:w-12 md:h-16 md:w-16 lg:h-20 lg:w-20 dark:text-[var(--color-m2)]">
          <path fill="currentColor"
            d="M216 122a6 6 0 0 0-5.09 2.82a177 177 0 0 1-16.69 22.65l-17.87-94a14 14 0 0 0-22.5-8.35l-.1.08l-24.53 20.39a2 2 0 0 1-2.44 0l-24.53-20.43l-.1-.08a14 14 0 0 0-22.5 8.34l-17.88 94.07a178 178 0 0 1-16.68-22.67A6 6 0 0 0 40 122a38 38 0 0 0 0 76h176a38 38 0 0 0 0-76M91.44 55.65a2 2 0 0 1 3.18-1.22l24.54 20.43l.09.08a13.93 13.93 0 0 0 17.5 0l.09-.08l24.54-20.43a2 2 0 0 1 3.18 1.23L178.69 130H77.31ZM40 186a26 26 0 0 1-3.17-51.81c17.67 27.25 36.7 42.86 52.79 51.81Zm88 0c-.34 0-26.71-.41-56-27.91L75 142h106l3 16.05a115.8 115.8 0 0 1-28.89 20.19C139.38 185.81 128.08 186 128 186m88 0h-49.62c16.09-8.95 35.12-24.56 52.79-51.81A26 26 0 0 1 216 186" />
        </svg>
        <span
          class="mt-2 text-xs font-bold tracking-widest text-[var(--color-m7)] uppercase sm:text-sm md:block dark:text-[var(--color-m2)]">San.
          Rafael</span>
      </a>

      <!-- Sidebar menu with option to show only icons -->
      <div class="relative flex w-full flex-1 flex-col overflow-y-auto px-2">
        <!-- Menu Items -->
        <a class="group mt-2 flex h-12 w-full items-center rounded px-3 text-[var(--color-m7)] transition-colors hover:bg-[var(--color-m7)] hover:text-[var(--color-m2)] dark:text-[var(--color-m2)] dark:hover:bg-[var(--color-m2)] dark:hover:text-[var(--color-m2)]"
          href="/">
          <UIcon name="i-heroicons-home-16-solid"
            class="h-6 w-6 dark:text-[var(--color-m2)] group-hover:dark:text-[var(--color-m7)]" />
          <span v-if="!collapsed"
            class="ml-4 text-xs font-bold tracking-widest uppercase dark:text-[var(--color-m2)] group-hover:dark:text-[var(--color-m7)]">
            Inicio </span>
        </a>
        <a class="group mt-2 flex h-12 w-full items-center rounded px-3 text-[var(--color-m7)] transition-colors hover:bg-[var(--color-m7)] hover:text-[var(--color-m2)] dark:text-[var(--color-m2)] dark:hover:bg-[var(--color-m2)] dark:hover:text-[var(--color-m2)]"
          href="/animals">
          <UIcon name="i-healthicons-animal-cow"
            class="h-6 w-6 dark:text-[var(--color-m2)] group-hover:dark:text-[var(--color-m7)]" />
          <span v-if="!collapsed"
            class="ml-4 text-xs font-bold tracking-widest uppercase dark:text-[var(--color-m2)] group-hover:dark:text-[var(--color-m7)]">
            Animales </span>
        </a>

        <a class="group mt-2 flex h-12 w-full items-center rounded px-3 text-[var(--color-m7)] transition-colors hover:bg-[var(--color-m7)] hover:text-[var(--color-m2)] dark:text-[var(--color-m2)] dark:hover:bg-[var(--color-m2)] dark:hover:text-[var(--color-m2)]"
          href="/stock">
          <UIcon name="i-healthicons-i-exam-multiple-choice"
            class="h-6 w-6 dark:text-[var(--color-m2)] group-hover:dark:text-[var(--color-m7)]" />
          <span v-if="!collapsed"
            class="ml-4 text-xs font-bold tracking-widest uppercase dark:text-[var(--color-m2)] group-hover:dark:text-[var(--color-m7)]">
            Inventario </span>
        </a>

        <a class="group mt-2 flex h-12 w-full items-center rounded px-3 text-[var(--color-m7)] transition-colors hover:bg-[var(--color-m7)] hover:text-[var(--color-m2)] dark:text-[var(--color-m2)] dark:hover:bg-[var(--color-m2)] dark:hover:text-[var(--color-m2)]"
          href="/reproduction">
          <UIcon name="i-healthicons-syringe"
            class="h-6 w-6 dark:text-[var(--color-m2)] group-hover:dark:text-[var(--color-m7)]" />
          <span v-if="!collapsed"
            class="ml-4 text-xs font-bold tracking-widest uppercase dark:text-[var(--color-m2)] group-hover:dark:text-[var(--color-m7)]">
            Reproducción </span>
        </a>

        <a class="group mt-2 flex h-12 w-full items-center rounded px-3 text-[var(--color-m7)] transition-colors hover:bg-[var(--color-m7)] hover:text-[var(--color-m2)] dark:text-[var(--color-m2)] dark:hover:bg-[var(--color-m2)] dark:hover:text-[var(--color-m2)]"
          href="/genealogy">
          <UIcon name="i-healthicons-biomarker-outline-24px"
            class="h-6 w-6 dark:text-[var(--color-m2)] group-hover:dark:text-[var(--color-m7)]" />
          <span v-if="!collapsed"
            class="ml-4 text-xs font-bold tracking-widest uppercase dark:text-[var(--color-m2)] group-hover:dark:text-[var(--color-m7)]">
            Genealogía </span>
        </a>

        <a class="group mt-2 flex h-12 w-full items-center rounded px-3 text-[var(--color-m7)] transition-colors hover:bg-[var(--color-m7)] hover:text-[var(--color-m2)] dark:text-[var(--color-m2)] dark:hover:bg-[var(--color-m2)] dark:hover:text-[var(--color-m2)]"
          href="/account">
          <UIcon name="i-heroicons-user-16-solid"
            class="h-6 w-6 dark:text-[var(--color-m2)] group-hover:dark:text-[var(--color-m7)]" />
          <span v-if="!collapsed"
            class="ml-4 text-xs font-bold tracking-widest uppercase dark:text-[var(--color-m2)] group-hover:dark:text-[var(--color-m7)]">
            Cuenta </span>
        </a>

        <!-- Button to Expand/Collapse Sidebar -->
        <button @click="collapsed = !collapsed"
          class="absolute top-1/2 right-0 -translate-y-1/2 transform rounded-l-md px-2 pt-3 pb-2 text-[var(--color-m7)] transition-colors hover:bg-[var(--color-m7)] hover:text-[var(--color-m2)] dark:text-[var(--color-m2)] dark:hover:bg-[var(--color-m2)] dark:hover:text-[var(--color-m7)]"
          title="Expandir/Colapsar Menu">
          <UIcon :name="collapsed ? 'i-heroicons-chevron-right' : 'i-heroicons-chevron-left'" class="h-6 w-6" />
        </button>
      </div>

      <!-- Logout and Theming Buttons -->
      <div :class="['flex w-full px-3 text-[var(--color-m7)] dark:text-[var(--color-m2)] cursor-default transition-all duration-300 mt-auto',
        collapsed ? 'flex-col gap-2 py-4' : 'flex-row justify-between h-16']">
        <Logout />
        <Theming />
      </div>
    </div>

    <!-- Main Content -->
    <div
      class="m-4 mb-16 flex-1 overflow-auto rounded-xl bg-[var(--color-m7)] p-4 md:m-4 md:pb-4 dark:bg-[var(--color-m2)]">
      <slot />
    </div>

    <!-- Bottom Navigation Menu (Only for Mobile) -->
    <div
      class="fixed bottom-0 left-0 flex w-full justify-around bg-[var(--color-m2)] py-3 md:hidden dark:bg-[var(--color-m7)]">
      <a class="flex flex-col items-center text-[var(--color-m7)] transition-colors hover:text-gray-800 dark:text-[var(--color-m2)] dark:hover:text-white"
        href="/">
        <UIcon name="i-heroicons-home-16-solid" class="h-6 w-6 dark:text-[var(--color-m2)]" title="Inicio" />
      </a>
      <a class="flex flex-col items-center text-[var(--color-m7)] transition-colors hover:text-gray-800 dark:text-[var(--color-m2)] dark:hover:text-white"
        href="/animals">
        <UIcon name="i-healthicons-animal-cow" class="h-6 w-6 dark:text-[var(--color-m2)]" title="Animales" />
      </a>
      <a class="flex flex-col items-center text-[var(--color-m7)] transition-colors hover:text-gray-800 dark:text-[var(--color-m2)] dark:hover:text-white"
        href="/stock">
        <UIcon name="i-healthicons-i-exam-multiple-choice" class="h-6 w-6 dark:text-[var(--color-m2)]"
          title="Inventario" />
      </a>
      <a class="flex flex-col items-center text-[var(--color-m7)] transition-colors hover:text-gray-800 dark:text-[var(--color-m2)] dark:hover:text-white"
        href="/reproduction">
        <UIcon name="i-healthicons-syringe-outline-24px" class="h-6 w-6 dark:text-[var(--color-m2)]" title="Vacunas" />
      </a>
      <a class="flex flex-col items-center text-[var(--color-m7)] transition-colors hover:text-gray-800 dark:text-[var(--color-m2)] dark:hover:text-white"
        href="/genealogy">
        <UIcon name="i-healthicons-biomarker-outline-24px" class="h-6 w-6 dark:text-[var(--color-m2)]"
          title="Genealogía" />
      </a>
      <a class="flex flex-col items-center text-[var(--color-m7)] transition-colors hover:text-gray-800 dark:text-[var(--color-m2)] dark:hover:text-white"
        href="/account">
        <UIcon name="i-heroicons-user-16-solid" class="h-6 w-6 dark:text-[var(--color-m2)]" title="Cuenta" />
      </a>
    </div>
  </div>
</template>

<script setup>
import { useCookie } from '#app'

const collapsed = useCookie('sidebar-collapsed', { default: () => false })  // Persistent state for sidebar collapse

const toggleSidebar = () => {
  collapsed.value = !collapsed.value // Toggles sidebar state
}
</script>
