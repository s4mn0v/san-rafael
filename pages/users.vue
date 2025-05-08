<template>
  <h1>Usuarios</h1>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["restricted"],
  layout: "logged"
})
</script>