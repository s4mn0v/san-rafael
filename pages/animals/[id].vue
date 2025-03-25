<template>
    <div>
      <h1>Detalle del Animal</h1>
      <p>ID: {{ id }}</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRoute } from 'vue-router';
  
  const route = useRoute();
  const id = route.params.id;
  </script>
  
  <style scoped>
  /* Estilos aquí */
  </style>
  