<template>
  <div>
    
  <UBreadcrumb :items="items" />
    <h1>Ventas</h1>
    <!-- Contenido -->
  </div>
</template>

<style scoped>
/* Estilos */
</style>

<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

const items = ref<BreadcrumbItem[]>([
  {
    label: 'Incio',
    icon: 'i-heroicons-home-solid',
    to: '/'
  },
  {
    label: 'Ventas',
    icon: 'i-heroicons-shopping-cart-solid',
    to: '/sales'
  }
])

definePageMeta({
  layout: 'logged'
})
</script>