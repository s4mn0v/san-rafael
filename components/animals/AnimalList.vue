<!-- components/animals/AnimalList.vue -->
<template>
    <div>
      <AnimalList />
      <button v-if="hasPermission('create_animals')" @click="showForm">Agregar Animal</button>
    </div>
  </template>
  <script setup>
  import { usePermissions } from '~/composables/usePermissions';
  const { hasPermission } = usePermissions();
  </script>