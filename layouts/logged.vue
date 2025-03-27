<template>
  <div>
    <Sidebar>
      <slot />
    </Sidebar>
  </div>
</template>

<script setup>
import { preloadComponents } from '#app'

// Preload del Sidebar para mejorar el rendimiento
await preloadComponents('Sidebar')
</script>