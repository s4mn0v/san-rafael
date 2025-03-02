<template>
  <div>
    <!-- Sidebar estático -->
    <Sidebar> 
      <slot />
    </Sidebar>
    <!-- Contenido de la página -->
  </div>
</template>

<script setup>
import { preloadComponents } from '#app'

// Preload del Sidebar para mejorar el rendimiento
await preloadComponents('Sidebar')
</script>
