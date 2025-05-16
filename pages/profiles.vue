<template>
  <h1 class="text-3xl font-bold tracking-widest uppercase text-center mb-6">Usuarios</h1>

  <SearchProfile @deleted="refreshTable" />

  <ProfilesTable ref="profilesTable" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProfilesTable from '~~/components/profiles/ProfilesTable.vue'
import SearchProfile from '~~/components/profiles/SearchProfile.vue'

const profilesTable = ref<InstanceType<typeof ProfilesTable> | null>(null)

const refreshTable = () => {
  if (profilesTable.value?.tableApi && profilesTable.value?.fetchProfiles) {
    profilesTable.value.tableApi.resetRowSelection()
    profilesTable.value.fetchProfiles()
  } else {
    // Opcional: mostrar un mensaje de error o log
    console.warn('profilesTable no está disponible')
  }
}

definePageMeta({
  middleware: ['restricted'],
  layout: 'logged'
})
</script>