<script setup lang="ts">
import AnimalSearch from '~/components/animal/AnimalSearch.vue'
import BreadNav from '~/components/navigation/BreadNav.vue';
import SaleInfoCard from '~/components/animal/SaleInfoCard.vue'
import HealthHistoryCard from '~/components/animal/HealthHistoryCard.vue'
import type { BreadcrumbItem } from '@nuxt/ui'
import type { GenealogyResponse, Venta, Animal, HistorialSalud } from '~/types/animal'

const route = useRoute()
const id = route.params.id

const { data: animal, pending, error } = await useLazyFetch<{ animal: Animal, venta: Venta | null, historialSalud: HistorialSalud[] }>(
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

const showPrintOptions = ref(false)
const printSections = reactive({
  genealogy: true,
  venta: true,
  detalles: true
})

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
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 print:hidden">
        <UButton icon="i-heroicons-arrow-left" label="Volver" @click="$router.back()" />
        <div class="space-x-2">
          <UButton icon="i-heroicons-adjustments-horizontal"
            :label="showPrintOptions ? 'Ocultar opciones' : 'Seleccionar para imprimir'"
            @click="showPrintOptions = !showPrintOptions" color="gray" />
          <UButton icon="i-heroicons-printer" label="Imprimir" @click="printReport" />
        </div>
      </div>
      <div v-if="showPrintOptions" class="flex flex-col md:flex-row gap-4 mb-6 print:hidden">
        <UCheckbox v-model="printSections.detalles" label="Detalle del animal" />
        <UCheckbox v-model="printSections.venta" label="Información de venta" />
        <UCheckbox v-model="printSections.salud" label="Historial de salud" />
      </div>

      <!-- Sección Detalles -->
      <AnimalDetailsCard :animal="animal.animal" :show="printSections.detalles" />

      <!-- Sección Venta -->
      <SaleInfoCard v-if="animal.venta" :venta="animal.venta" :show="printSections.venta" />
      <UAlert v-else title="Sin información de venta" description="Este animal no tiene datos de venta registrados."
        icon="i-heroicons-exclamation-circle" color="warning" variant="subtle" class="mt-8" />

      <!-- Sección Historial de Salud -->
      <HealthHistoryCard :historial-salud="animal.historialSalud" :show="printSections.salud" />

      <!-- Sección Árbol Genealógico -->
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

    <!-- Animal no encontrado -->
    <UAlert v-else title="Animal no encontrado" description="No existe un animal con el ID proporcionado"
      icon="i-heroicons-magnifying-glass" color="error" variant="subtle" class="max-w-4xl mx-auto" />
  </div>
</template>