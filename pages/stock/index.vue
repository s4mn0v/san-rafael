<template>
  <BreadNav :items="breadcrumbItems" />
  <h1 class="text-3xl font-bold tracking-widest uppercase text-center">Inventario</h1>
  <div class="justify-end flex my-4 space-x-4">
    <StockAddModal @saved="handleSaved" />
    <StockStadistics ref="stats"/>
  </div>
  <StockTable ref="stockTable" @refreshed="handleTableRefreshed"/>
</template>

<script setup lang="ts">
import BreadNav from '~/components/navigation/BreadNav.vue';

import type { BreadcrumbItem } from '@nuxt/ui'
const stockTable = ref();

const stats = ref();

const handleSaved = () => {
  stockTable.value?.fetchInventory();
  stats.value?.refreshMetrics();
};

const handleTableRefreshed = () => {
  stats.value?.refreshMetrics();
};

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