<template>
  <div class="max-w-4xl mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">Búsqueda de Genealogía</h1>

    <!-- Buscador corregido -->
    <div class="mb-8">
      <UForm :state="formState" @submit="buscarGenealogia">
        <UInput v-model="animalIdUppercase" placeholder="Ingrese ID del animal" size="xl" class="mb-4 uppercase"
          name="animalId" />
        <UButton type="submit" label="Buscar" icon="i-heroicons-magnifying-glass"
          class="bg-[var(--color-m2)] dark:bg-[var(--color-m2)] dark:text-[var(--color-m7)] hover:bg-[var(--color-m5)] hover:text-[var(--color-m7)] dark:hover:bg-[var(--color-m5)] dark:hover:text-[var(--color-m7)]"
          :loading="pending" />
      </UForm>
    </div>

    <!-- Resultados -->
    <div v-if="resultados" class="space-y-6">
      <!-- Sección Animal -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">Datos del Animal</h2>
        </template>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <p><strong>ID:</strong> {{ resultados.animal.id_animal }}</p>
            <p><strong>Raza:</strong> {{ resultados.animal.raza }}</p>
            <p><strong>Tipo:</strong> {{ resultados.animal.tipo_animal }}</p>
          </div>
          <div>
            <p><strong>Fecha Nacimiento:</strong> {{ formatFecha(resultados.animal.fecha_nacimiento) }}</p>
            <p><strong>Peso Actual:</strong> {{ resultados.animal.peso_actual }} kg</p>
          </div>
        </div>
      </UCard>

      <!-- Sección Genealogía -->
      <UCard v-if="resultados.genealogia">
        <template #header>
          <h2 class="text-xl font-semibold">Registro Genealógico</h2>
        </template>
        <div class="space-y-2">
          <p><strong>Tipo de Registro:</strong> {{ resultados.genealogia.tipo_registro.replace('_', ' ') }}</p>
          <p><strong>Documento:</strong>
            <a v-if="resultados.genealogia.documento" :href="resultados.genealogia.documento" target="_blank"
              class="text-primary-500 hover:underline">
              Ver documento
            </a>
            <span v-else>No disponible</span>
          </p>
          <p><strong>Observaciones:</strong> {{ resultados.genealogia.observaciones || 'Sin observaciones' }}</p>
        </div>
      </UCard>
      <UCard v-else>
        <template #header>
          <h2 class="text-xl font-semibold">Registro Genealógico</h2>
        </template>
        <p>No se encontró registro genealógico para este animal.</p>
      </UCard>

      <!-- Sección Reproducción -->
      <UCard v-if="resultados.reproduccion">
        <template #header>
          <h2 class="text-xl font-semibold">Datos de Reproducción</h2>
        </template>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Tipo de Concepción:</strong> {{ resultados.reproduccion.tipo_concepcion }}</p>
            <p><strong>Fecha Evento:</strong> {{ formatFecha(resultados.reproduccion.fecha_evento) }}</p>
          </div>

          <!-- Datos de los padres -->
          <div class="space-y-4">
            <div v-if="resultados.reproduccion.madre">
              <h3 class="font-medium mb-2">Madre</h3>
              <p class="text-sm">ID: {{ resultados.reproduccion.madre.id_animal }}</p>
              <p class="text-sm">Raza: {{ resultados.reproduccion.madre.raza }}</p>
            </div>

            <div v-if="resultados.reproduccion.padre">
              <h3 class="font-medium mb-2">Padre</h3>
              <p class="text-sm">ID: {{ resultados.reproduccion.padre.id_animal }}</p>
              <p class="text-sm">Raza: {{ resultados.reproduccion.padre.raza }}</p>
            </div>
          </div>
        </div>
      </UCard>
      <UCard v-else>
        <template #header>
          <h2 class="text-xl font-semibold">Datos de Reproducción</h2>
        </template>
        <p>No se encontró datos de reproducción para este animal.</p>
      </UCard>
    </div>

    <!-- Mensajes de estado -->
    <div v-if="error" class="mt-4 text-red-500">
      Error: {{ error.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { form } from '#build/ui'
import type { Database } from '~/types/supabase'

const toast = useToast()

const animalIdUppercase = computed({
  get: () => formState.value.animalId,
  set: (val: string) => {
    formState.value.animalId = val.toUpperCase()
  }
})


type Animal = Database['public']['Tables']['animals']['Row']
// type Reproduccion = Database['public']['Tables']['reproduccion']['Row'] & {
//   madre?: Animal
//   padre?: Animal
// }

type Resultados = {
  animal: Animal
  genealogia: {
    tipo_registro: string
    documento: string | null
    observaciones: string | null
  } | null
  reproduccion: {
    tipo_concepcion: string
    fecha_evento: string
    madre?: Animal
    padre?: Animal
  } | null
}

const formState = ref({
  animalId: ''
})

const resultados = ref<Resultados | null>(null)
const error = ref<any>(null)
const pending = ref(false)

const formatFecha = (fecha: string) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const buscarGenealogia = async () => {
  if (!formState.value.animalId) return

  pending.value = true
  error.value = null

  try {
    // Replace useFetch with $fetch
    const response = await $fetch<Resultados | null>(
      `/api/genealogy/id/${formState.value.animalId}`,
      { method: 'GET' }
    )

    // Since $fetch throws errors for non-2xx responses, we can simplify the logic
    if (!response) {
      resultados.value = null
      toast.add({
        title: 'Animal no encontrado',
        description: `No existen registros para el ID: ${formState.value.animalId}`,
        color: 'warning',
        icon: 'i-heroicons-information-circle-20-solid',
        duration: 5000
      })
      return
    }

    // ✅ Datos encontrados
    resultados.value = response

    toast.add({
      title: 'Búsqueda exitosa',
      description: `Datos encontrados para el ID: ${formState.value.animalId}`,
      color: 'success',
      icon: 'i-heroicons-check-circle-20-solid'
    })

    if (!response.reproduccion) {
      toast.add({
        title: 'Información adicional',
        description: 'No se encontraron datos de reproducción.',
        color: 'info',
        icon: 'i-heroicons-information-circle-20-solid'
      })
    }
  } catch (err: any) {
    error.value = err
    resultados.value = null

    // Check if it's a "not found" error
    if (err.response?.status === 404 ||
      (err.message && (
        err.message.toLowerCase().includes('no rows') ||
        err.message.toLowerCase().includes('not found')
      ))) {
      toast.add({
        title: 'Animal no encontrado',
        description: `No existen registros para el ID: ${formState.value.animalId}`,
        color: 'warning',
        icon: 'i-heroicons-information-circle-20-solid',
        duration: 5000
      })
    } else {
      toast.add({
        title: 'Error en la búsqueda',
        description: err.message || 'Ocurrió un error desconocido',
        icon: 'i-heroicons-exclamation-circle',
        color: 'error'
      })
    }
  } finally {
    pending.value = false
  }
}


definePageMeta({
  layout: 'logged',
  middleware: 'role-guard'
})
</script>