<template>
  <div class="flex flex-col items-center mb-6">
    <h1 class="text-3xl font-bold tracking-widest uppercase mb-6 text-center">Usuarios</h1>

    <SearchProfile @deleted="refreshTable" />
  </div>

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