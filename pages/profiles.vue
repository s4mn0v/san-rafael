<template>
  <h1>Usuarios</h1>

  <ProfilesTable />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["restricted"],
  layout: "logged"
})
</script>