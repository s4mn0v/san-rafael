<template>
  <BreadNav :items="breadcrumbItems" />
  <h1>Dashboard</h1>
  <StadisticCards />

</template>

<script setup lang="ts">
definePageMeta({ layout: "logged" });

import BreadNav from '~/components/navigation/BreadNav.vue';
import type { BreadcrumbItem } from '@nuxt/ui'

const breadcrumbItems = ref<BreadcrumbItem[]>([
  {
    label: 'Inicio',
    icon: 'i-heroicons-home-solid',
    to: '/'
  },
  {
    label: 'Ventas',
    icon: 'i-healthicons-money-bag',
    to: '/sales',
    showInBreadcrumb: false
  }
])
</script>
