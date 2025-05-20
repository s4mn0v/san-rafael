<template>
  <BreadNav :items="breadcrumbItems" />
  <h1>Genealogía</h1>

  <GenealogyTable  />

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
    label: 'Reproduccion',
    icon: 'i-healthicons-biomarker-outline',
    to: '/animals/reproduction'
  }
]

definePageMeta({
  layout: "logged"
})
</script>