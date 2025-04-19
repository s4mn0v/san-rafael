<!-- components/ParentInfo.vue -->
<template>
  <div class="bg-gray-50 p-4 rounded-lg">
    <h3 class="font-medium mb-2">{{ title }}</h3>
    <InfoItem label="ID" :value="parent.id_animal" />
    <InfoItem label="Raza" :value="parent.raza" />
    <InfoItem label="Tipo" :value="parent.tipo_animal" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  parent: any
}>()
</script>