<script setup lang="ts">
import type { Animal } from '~/types/animal'
import AnimalSearch from '~/components/animal/AnimalSearch.vue'
import BreadNav from '~/components/navigation/BreadNav.vue';
import type { BreadcrumbItem } from '@nuxt/ui'
import type { GenealogyResponse } from '~/types/animal'

const route = useRoute()
const id = route.params.id

const { data: animal, pending, error } = await useLazyFetch<{ animal: Animal }>(
  `/api/animal/specific/${id}`,
  {
    server: false
  }
)

useHead({
  title: `Animal ${id}`
})

definePageMeta({
  layout: "logged"
})

// Toast
const toast = useToast()

watch(
  () => error.value,
  (err) => {
    if (err) {
      toast.add({
        title: 'Error al cargar el animal' || err.data?.statusMessage,
        description: 'Ocurrió un error inesperado.' || err.data?.message,
        color: 'error',
        icon: 'i-heroicons-exclamation-circle'
      })
    }
  }
)

const breadcrumbItems = ref<BreadcrumbItem[]>([
  {
    label: 'Inicio',
    icon: 'i-heroicons-home-solid',
    to: '/'
  },
  {
    label: 'Animales',
    icon: 'i-healthicons-animal-cow',
    to: '/animals',
  },
  {
    label: 'Búsqueda específica',
    icon: 'i-heroicons-magnifying-glass',
  }
])

watch(
  () => animal.value,
  (val) => {
    if (val?.animal) {
      toast.add({
        title: 'Animal encontrado',
        description: `Se cargó correctamente el animal con ID ${val.animal.id_animal}`,
        color: 'success',
        icon: 'i-heroicons-check-circle'
      })

      // Agregar el ID al breadcrumb
      breadcrumbItems.value.push({
        label: `ID: ${val.animal.id_animal}`,
        icon: 'i-heroicons-identification',
      })
    }
  }
)

const { data: genealogy, pending: genealogyPending } = await useLazyFetch<GenealogyResponse>(
  `/api/genealogy/id/${id}`,
  {
    server: false,
    transform: (res: any) => transformGenealogyData(res)
  }
)
// Función para transformar la respuesta de la API
const transformGenealogyData = (apiData: any) => {
  if (!apiData?.reproduccion) return null

  // Helper to convert Animal to TreeNode
  const transformAnimalToNode = (animal: Animal): TreeNode => ({
    id: animal.id_animal,
    raza: animal.raza,
    tipo_animal: animal.tipo_animal,
    madre: undefined, // API doesn't provide deeper genealogy
    padre: undefined
  })

  const baseNode: TreeNode = {
    id: apiData.animal.id_animal,
    raza: apiData.animal.raza,
    tipo_animal: apiData.animal.tipo_animal,
    madre: apiData.reproduccion.madre ? transformAnimalToNode(apiData.reproduccion.madre) : undefined,
    padre: apiData.reproduccion.padre ? transformAnimalToNode(apiData.reproduccion.padre) : undefined
  }

  return baseNode
}
</script>

<template>
  <div class="space-y-8">

    <BreadNav :items="breadcrumbItems" />

    <AnimalSearch />

    <div v-if="pending" class="text-center p-8">
      <p class="mt-4 text-[var(--color-custom-300)]">Cargando información del animal...</p>
    </div>

    <UAlert v-else-if="error" :title="'Error al cargar el animal' || error.data?.statusMessage"
      icon="i-heroicons-exclamation-circle" color="error" variant="subtle" />

    <div v-else-if="animal?.animal" class="max-w-4xl mx-auto p-6">
      <UCard class="shadow-lg">
        <template #header>
          <h1 class="text-2xl font-bold">
            Animal ID: {{ animal.animal.id_animal }}
          </h1>
        </template>

        <div class="grid md:grid-cols-2 gap-6">
          <!-- Columna Izquierda -->
          <div class="space-y-4">
            <div>
              <label class="text-sm font-medium text-[var(--color-custom-300)]">Fecha de Nacimiento</label>
              <p class="text-lg font-semibold">
                {{ new Date(animal.animal.fecha_nacimiento).toLocaleDateString() }}
              </p>
            </div>

            <div>
              <label class="text-sm font-medium text-[var(--color-custom-300)]">Raza</label>
              <p class="text-lg font-semibold text-[var(--color-custom-500)]">
                {{ animal.animal.raza }}
              </p>
            </div>

            <div>
              <label class="text-sm font-medium text-[var(--color-custom-300)]">Tipo</label>
              <p class="text-lg font-semibold text-[var(--color-custom-500)]">
                {{ animal.animal.tipo_animal }}
              </p>
            </div>
          </div>

          <!-- Columna Derecha -->
          <div class="space-y-4">
            <div>
              <label class="text-sm font-medium text-[var(--color-custom-300)]">Peso Actual</label>
              <p class="text-2xl font-semibold">
                {{ animal.animal.peso_actual }} kg
              </p>
            </div>

            <div>
              <label class="text-sm font-medium text-[var(--color-custom-300)]">Estado de Salud</label>
              <p class="text-lg font-semibold">
                {{ animal.animal.estado_salud }}
              </p>
            </div>

            <div>
              <label class="text-sm font-medium text-[var(--color-custom-300)]">En Venta</label>
              <p class="text-lg font-semibold">
                {{ animal.animal.venta ? 'Disponible para venta' : 'No disponible' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Sección Adicional -->
        <div class="mt-8 border-t pt-6">
          <div class="grid grid-cols-3 gap-4 text-center">
            <div>
              <label class="text-sm font-medium text-[var(--color-custom-300)]">Peso Inicial</label>
              <p class="text-lg">{{ animal.animal.peso_inicial }} kg</p>
            </div>

            <div>
              <label class="text-sm font-medium text-[var(--color-custom-300)]">ID Reproducción</label>
              <p class="text-lg">
                {{ animal.animal.id_reproduccion || 'N/A' }}
              </p>
            </div>

            <div>
              <label class="text-sm font-medium text-[var(--color-custom-300)]">Fecha Fallecimiento</label>
              <p class="text-lg">
                {{ animal.animal.fecha_fallecimiento
                  ? new Date(animal.animal.fecha_fallecimiento).toLocaleDateString()
                  : 'N/A' }}
              </p>
            </div>
          </div>
        </div>
      </UCard>

      <div v-if="genealogyPending" class="mt-8 text-center p-4">
        <p class="text-[var(--color-custom-300)]">Cargando árbol genealógico...</p>
      </div>

      <template v-else>
        <h2 class="text-2xl font-semibold mt-8"> Árbol Genealógico </h2>
        <GenealogyTree v-if="genealogy" :tree-data="genealogy" class="mt-8" />
        <UAlert v-else title="Sin registro genealógico"
          description="No se encontraron datos de parentesco para este animal." icon="i-heroicons-information-circle"
          color="error" variant="subtle" class="mt-8" />
      </template>
    </div>

    <UAlert v-else title="Animal no encontrado" description="No existe un animal con el ID proporcionado"
      icon="i-heroicons-magnifying-glass" color="yellow" variant="subtle" class="max-w-4xl mx-auto" />
  </div>
</template>