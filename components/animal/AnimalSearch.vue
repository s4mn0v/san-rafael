<script setup lang="ts">
const animalId = ref('')
const router = useRouter()

const searchAnimal = () => {
  if (!animalId.value) return
  router.push(`/animals/specific/${animalId.value}`)
}
</script>

<template>
  <div class="flex gap-2 max-w-xl mx-auto p-4">
    <UInput v-model="animalId" placeholder="Ingrese el ID del animal" class="flex-1 font-mono" @keyup.enter="searchAnimal" />
    <UButton icon="i-heroicons-magnifying-glass-solid" @click="searchAnimal" :disabled="!animalId">
      Buscar
    </UButton>
  </div>
</template>