<template>
  <BreadNav :items="breadcrumbItems" />
  <h1>Genealogía</h1>

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
    label: 'Animales',
    icon: 'i-healthicons-animal-cow',
    to: '/animals'
  },
  {
    label: 'Genealogía',
    icon: 'i-healthicons-biomarker-outline',
    to: '/animals/genealogy'
  }
]

definePageMeta({
  layout: "logged"
})
</script>