<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

const searchTerm = ref('')
const results = ref<any[]>([])
const isSearching = ref(false)
const toast = useToast()
let timeoutId: NodeJS.Timeout | null = null

const handleSearch = async (term: string) => {
  if (term.length < 2) {
    results.value = []
    return
  }

  try {
    isSearching.value = true
    const data = await $fetch('/api/profiles/search', {
      params: { q: term }
    })
    results.value = data
  } catch (error: any) {
    toast.add({
      title: 'Error en búsqueda',
      description: error.data?.message || 'Error al realizar la búsqueda',
      color: 'red',
      icon: 'i-heroicons-x-circle'
    })
  } finally {
    isSearching.value = false
  }
}

const handleInput = (event: Event) => {
  const term = (event.target as HTMLInputElement).value.trim()

  // Limpiar timeout anterior
  if (timeoutId) clearTimeout(timeoutId)

  // Nuevo timeout para debounce
  timeoutId = setTimeout(() => {
    handleSearch(term)
  }, 300)
}

// Limpiar timeout al desmontar el componente
onUnmounted(() => {
  if (timeoutId) clearTimeout(timeoutId)
})
</script>

<template>
  <div class="relative w-full max-w-md">
    <UInput placeholder="Buscar por nombre o email..." icon="i-heroicons-magnifying-glass" :loading="isSearching"
      @input="handleInput" />

    <Transition name="fade">
      <div v-if="results.length > 0"
        class="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <div class="p-2 space-y-2 max-h-96 overflow-y-auto">
          <div v-for="profile in results" :key="profile.id"
            class="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ profile.name || 'Sin nombre' }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ profile.email }}
                </p>
              </div>
              <UBadge :label="profile.role" size="sm" :color="profile.role === 'admin' ? 'primary' : 'gray'" />
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Estado sin resultados -->
    <Transition name="fade">
      <div v-if="results.length === 0 && searchTerm.length >= 2 && !isSearching"
        class="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 text-center text-gray-500">
        No se encontraron resultados
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>