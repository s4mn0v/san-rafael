<template>
  <h1 class="text-3xl font-bold tracking-widest uppercase text-center mb-6">Usuarios</h1>

  <SearchProfile />

  <ProfilesTable />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["restricted"],
  layout: "logged"
})
</script>