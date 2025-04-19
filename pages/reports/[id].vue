<!-- pages/reports/[id].vue -->
<template>
  <div class="max-w-4xl mx-auto p-4 print:p-0">
    <div class="flex justify-between items-center mb-8 print:hidden">
      <UButton icon="i-heroicons-arrow-left" label="Volver" @click="$router.back()" class="bg-[var(--color-m2)]" />
      <UButton icon="i-heroicons-printer" label="Imprimir" @click="printReport" class="bg-[var(--color-m2)]" />
    </div>

    <!-- Encabezado del reporte -->
    <div class="text-center mb-8 border-b pb-4 print:border-none">
      <h1 class="text-3xl font-bold">Registro Completo del Animal</h1>
      <p class="text-gray-500">ID: {{ animal.id_animal }}</p>
      <p class="text-sm text-gray-400">Generado el: {{ currentDate }}</p>
    </div>

    <!-- Contenido principal -->
    <div class="space-y-6">
      <!-- Sección Animal -->
      <ReportSection title="Datos Básicos">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <InfoItem label="ID" :value="animal.id_animal" />
            <InfoItem label="Raza" :value="animal.raza" />
          </div>
          <div>
            <InfoItem label="Fecha Nacimiento" :value="formatFecha(animal.fecha_nacimiento)" />
            <InfoItem label="Peso Actual" :value="`${animal.peso_actual} kg`" />
          </div>
        </div>
      </ReportSection>
      <!-- Sección Reproducción -->
      <ReportSection v-if="reproduccion" title="Datos de Reproducción & Registro Genealógico">
        <div class="grid grid-cols-2 gap-4">
          <!-- Columna izquierda: Tipo de Concepción + Madre -->
          <div class="space-y-4">
            <InfoItem label="Tipo de Concepción" :value="reproduccion.tipo_concepcion" />
            <ParentInfo v-if="reproduccion.madre" title="Madre" :parent="reproduccion.madre" />
          </div>

          <!-- Columna derecha: Fecha Evento + Padre -->
          <div class="space-y-4">
            <InfoItem label="Fecha Evento" :value="formatFecha(reproduccion.fecha_evento)" />
            <ParentInfo v-if="reproduccion.padre" title="Padre" :parent="reproduccion.padre" />
          </div>
        </div>
      </ReportSection>

      <!-- Árbol Genealógico -->
      <!-- Árbol Genealógico -->
      <ReportSection v-if="treeData" title="Árbol Genealógico" class="print:hidden">
        <div class="h-[500px]">
          <VueFlowTree :tree-data="treeData" />
        </div>
      </ReportSection>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useFetch, navigateTo, definePageMeta } from '#imports';
import { useToast } from '#imports'; // Assuming Nuxt UI's useToast is auto-importable
import type { Database } from '~/types/supabase'; // Ensure this path is correct after verification/generation

const route = useRoute();
const toast = useToast();

type Animal = Database['public']['Tables']['animals']['Row'];
type ReportData = {
  animal: Animal;
  genealogia: {
    tipo_registro: string;
    documento: string | null;
    observaciones: string | null;
  } | null;
  reproduccion: {
    tipo_concepcion: string;
    fecha_evento: string;
    madre?: Animal;
    padre?: Animal;
  } | null;
};

// Datos reactivos
const animal = ref<Animal>({} as Animal);
const genealogia = ref<ReportData['genealogia']>(null); // Use defined type
const reproduccion = ref<ReportData['reproduccion']>(null); // Use defined type
const treeData = ref<any>(null); // Consider defining a type for tree data if possible
const currentDate = ref(new Date().toLocaleDateString('es-ES'));

// Formateador de fechas
const formatFecha = (fecha: string | null | undefined): string => {
  if (!fecha) return 'N/A'; // Handle null/undefined dates gracefully
  try {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    console.error("Error formatting date:", fecha, e);
    return 'Fecha inválida';
  }
};

// Function for printing
const printReport = () => {
  if (process.client) { // Ensure window is available
    window.print();
  }
}

// Cargar datos
onMounted(async () => {
  const animalId = route.params.id;
  if (!animalId) {
    toast.add({ title: 'Error', description: 'ID de animal no válido.', color: 'error' });
    return navigateTo('/animals'); // Or appropriate error page/fallback
  }

  try {
    // Fetch primary animal data
    const { data: reportData, error: reportError } = await useFetch<ReportData>(`/api/genealogy/id/${animalId}`);

    if (reportError.value || !reportData.value) {
      console.error("Error fetching report data:", reportError.value);
      throw new Error(reportError.value?.message || 'No se pudieron cargar los datos del animal.');
    }

    // Assign data
    animal.value = reportData.value.animal;
    genealogia.value = reportData.value.genealogia;
    reproduccion.value = reportData.value.reproduccion;

    // Fetch tree data only if reproduction data exists (logic seems okay)
    if (reportData.value.reproduccion) {
      const { data: tree, error: treeError } = await useFetch(`/api/genealogy/tree/${animalId}`);
      if (treeError.value) {
        console.error("Error fetching tree data:", treeError.value);
        toast.add({ title: 'Advertencia', description: 'No se pudo cargar el árbol genealógico.', color: 'warning' });
      } else {
        treeData.value = tree.value;
      }
    }

  } catch (error: any) {
    console.error("Error loading report page:", error);
    toast.add({
      title: 'Error',
      description: error.message || 'Ocurrió un error inesperado.',
      color: 'error', // Use 'red' for Nuxt UI v2+
      icon: 'i-heroicons-x-circle'
    });
    navigateTo('/animals'); // Redirect on critical error
  }
});

definePageMeta({
  layout: 'logged',
  middleware: 'role-guard' // Ensure this middleware exists and is configured
});
</script>