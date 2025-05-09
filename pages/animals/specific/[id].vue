<script setup lang="ts">
import type { Animal } from '~/types/animal'
import AnimalSearch from '~/components/animal/AnimalSearch.vue'
import BreadNav from '~/components/navigation/BreadNav.vue';
import type { BreadcrumbItem } from '@nuxt/ui'
import type { GenealogyResponse } from '~/types/animal'

const route = useRoute()
const id = route.params.id

const { data: animal, pending, error } = await useLazyFetch<{ animal: Animal, venta: Venta | null }>(
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
        icon: 'i-heroicons-check-circle',
        ui: {
          root: "print:hidden"
        }
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
  if (!apiData?.reproduccion) return null;

  const transformAnimalToNode = (animalItem: Animal): TreeNode => ({
    id: animalItem.id_animal,
    raza: animalItem.raza,
    tipo_animal: animalItem.tipo_animal,
    madre: undefined,
    padre: undefined
  });

  return {
    id: apiData.animal.id_animal,
    raza: apiData.animal.raza,
    tipo_animal: apiData.animal.tipo_animal,
    madre: apiData.reproduccion.madre ? transformAnimalToNode(apiData.reproduccion.madre) : undefined,
    padre: apiData.reproduccion.padre ? transformAnimalToNode(apiData.reproduccion.padre) : undefined
  };
};

const printReport = () => {
  if (typeof window !== 'undefined') {
    window.print();
  }
};
</script>

<template>
  <div class="space-y-8">

    <BreadNav :items="breadcrumbItems" class="print:hidden" />

    <AnimalSearch class="print:hidden" />


    <div v-if="pending" class="text-center p-8">
      <p class="mt-4 text-[var(--color-custom-300)]">Cargando información del animal...</p>
    </div>

    <UAlert v-else-if="error" :title="'Error al cargar el animal' || error.data?.statusMessage"
      icon="i-heroicons-exclamation-circle" color="error" variant="subtle" />

    <div v-else-if="animal?.animal" class="max-w-4xl mx-auto p-6 print:max-w-full print:px-0">
      <div class="flex justify-between items-center mb-8 print:hidden">
        <UButton icon="i-heroicons-arrow-left" label="Volver" @click="$router.back()" />
        <UButton icon="i-heroicons-printer" label="Imprimir" @click="printReport" />
      </div>
      <UCard class="shadow-lg print:shadow-none print:w-full print:mt-[-55px]">
        <template #header>
          <h1 class="text-2xl">
            Animal: <span class="font-bold font-mono">{{ animal.animal.id_animal }} </span>
          </h1>
        </template>

        <div class="grid md:grid-cols-2 gap-6 print:grid print:grid-cols-2">
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
              <p class="text-lg font-semibold">{{ animal.animal.peso_inicial }} kg</p>
            </div>

            <div>
              <label class="text-sm font-medium text-[var(--color-custom-300)]">ID Reproducción</label>
              <p class="text-lg font-semibold">
                {{ animal.animal.id_reproduccion || 'N/A' }}
              </p>
            </div>

            <div>
              <label class="text-sm font-medium text-[var(--color-custom-300)]">Fecha Fallecimiento</label>
              <p class="text-lg font-semibold">
                {{ animal.animal.fecha_fallecimiento
                  ? new Date(animal.animal.fecha_fallecimiento).toLocaleDateString()
                  : 'N/A' }}
              </p>
            </div>
          </div>
        </div>
      </UCard>

      <UCard v-if="animal?.venta" class="mt-8 shadow-md print:shadow-none">
        <template #header>
          <h2 class="text-xl font-bold">Información de Venta</h2>
        </template>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 print:grid print:grid-cols-2">
          <div>
            <label class="text-sm text-gray-500">Fecha de Venta</label>
            <p class="text-lg font-medium">{{ new Date(animal.venta.fecha_venta).toLocaleDateString() }}</p>
          </div>
          <div>
            <label class="text-sm text-gray-500">Monto</label>
            <p class="text-lg font-medium">
              {{ animal.venta.monto !== null
                ? new Intl.NumberFormat('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }).format(animal.venta.monto)
              : 'No especificado' }}
            </p>
          </div>
        </div>
        <div>
          <label class="text-sm text-gray-500">Notas</label>
          <p class="text-lg font-medium">{{ animal.venta.notas || 'Sin notas' }}</p>
        </div>
      </UCard>

      <UCard v-if="animal?.venta" class="mt-8 shadow-md print:shadow-none">
        <template #header>
          <h2 class="text-xl font-bold">Información de Venta</h2>
        </template>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 print:grid print:grid-cols-2">
          <div>
            <label class="text-sm text-gray-500">Fecha de Venta</label>
            <p class="text-lg font-medium">{{ new Date(animal.venta.fecha_venta).toLocaleDateString() }}</p>
          </div>
          <div>
            <label class="text-sm text-gray-500">Monto</label>
            <p class="text-lg font-medium">
              {{ animal.venta.monto !== null
                ? new Intl.NumberFormat('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }).format(animal.venta.monto)
              : 'No especificado' }}
            </p>
          </div>
        </div>
        <div>
          <label class="text-sm text-gray-500">Notas</label>
          <p class="text-lg font-medium">{{ animal.venta.notas || 'Sin notas' }}</p>
        </div>
      </UCard>


      <UCard v-if="animal?.venta" class="mt-8 shadow-md print:shadow-none">
        <template #header>
          <h2 class="text-xl font-bold">Información de Venta</h2>
        </template>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 print:grid print:grid-cols-2">
          <div>
            <label class="text-sm text-gray-500">Fecha de Venta</label>
            <p class="text-lg font-medium">{{ new Date(animal.venta.fecha_venta).toLocaleDateString() }}</p>
          </div>
          <div>
            <label class="text-sm text-gray-500">Monto</label>
            <p class="text-lg font-medium">
              {{ animal.venta.monto !== null
                ? new Intl.NumberFormat('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }).format(animal.venta.monto)
              : 'No especificado' }}
            </p>
          </div>
        </div>
        <div>
          <label class="text-sm text-gray-500">Notas</label>
          <p class="text-lg font-medium">{{ animal.venta.notas || 'Sin notas' }}</p>
        </div>
      </UCard>

      <UAlert v-else-if="animal?.animal" title="Sin información de venta"
        description="Este animal no tiene datos de venta registrados." icon="i-heroicons-exclamation-circle"
        color="warning" variant="subtle" class="mt-8" />

      <div v-if="genealogyPending" class="mt-8 text-center p-4 print:hidden">
        <p class="text-[var(--color-custom-300)]">Cargando árbol genealógico...</p>
      </div>

      <template v-else>
        <div class="print:hidden">
          <h2 v-if="genealogy" class="text-2xl font-semibold mt-8"> Árbol Genealógico </h2>
          <GenealogyTree v-if="genealogy" :tree-data="genealogy" class="mt-8" />
          <UAlert v-else title="Sin registro genealógico"
            description="No se encontraron datos de parentesco para este animal." icon="i-heroicons-information-circle"
            color="warning" variant="subtle" class="mt-8" />
        </div>
      </template>
    </div>

    <UAlert v-else title="Animal no encontrado" description="No existe un animal con el ID proporcionado"
      icon="i-heroicons-magnifying-glass" color="error" variant="subtle" class="max-w-4xl mx-auto" />
  </div>
</template>