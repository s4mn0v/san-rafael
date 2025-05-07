<template>
  <BreadNav :items="breadcrumbItems" />
  <h1>Inventario</h1>

</template>

<script setup lang="ts">
import BreadNav from '~/components/navigation/BreadNav.vue';

import type { BreadcrumbItem } from '@nuxt/ui'

const breadcrumbItems: BreadcrumbItem[] = [
  {
    label: 'Inicio',
    icon: 'i-heroicons-home-solid',
    to: '/'
  },
  {
    label: 'Inventario',
    icon: 'i-healthicons-i-exam-multiple-choice-outline',
    to: '/stock',
  },
  {
    label: 'Proveedores',
    icon: 'i-healthicons-agriculture-worker-outline',
    to: '/stock/providers',
    showInBreadcrumb: false
  }
]

definePageMeta({
  layout: "logged"
})
</script>