<template>
  <UCard class="shadow-lg print:shadow-none print:w-full print:mt-[-55px]" :class="{ 'print:hidden': !show }">
    <template #header>
      <div class="flex justify-between items-center">
        <h1 class="text-2xl">
          Animal: <span class="font-bold font-mono">{{ animal.id_animal }}</span>
        </h1>
        <UButton v-if="!isEditing" icon="i-heroicons-pencil-square" @click="enableEditing"
          class="print:hidden bg-[var(--color-custom-50)] text-[var(--color-custom-500)] dark:bg-[var(--color-custom-500)] dark:text-[var(--color-custom-50)] rounded-full p-2" />
      </div>
    </template>

    <!-- Modo Visualización -->
    <div v-if="!isEditing">
      <div class="grid md:grid-cols-2 gap-6 print:grid print:grid-cols-2">
        <!-- Columna Izquierda -->
        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium text-[var(--color-custom-300)]">Fecha de Nacimiento</label>
            <p class="text-lg font-semibold">
              {{ new Date(animal.fecha_nacimiento).toLocaleDateString() }}
            </p>
          </div>

          <div>
            <label class="text-sm font-medium text-[var(--color-custom-300)]">Raza</label>
            <p class="text-lg font-semibold">
              {{ animal.raza }}
            </p>
          </div>

          <div>
            <label class="text-sm font-medium text-[var(--color-custom-300)]">Tipo</label>
            <p class="text-lg font-semibold">
              {{ animal.tipo_animal }}
            </p>
          </div>
        </div>

        <!-- Columna Derecha -->
        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium text-[var(--color-custom-300)]">Peso Actual</label>
            <p class="text-2xl font-semibold">
              {{ animal.peso_actual }} kg
            </p>
          </div>

          <div>
            <label class="text-sm font-medium text-[var(--color-custom-300)]">Estado de Salud</label>
            <p class="text-lg font-semibold">
              {{ animal.estado_salud }}
            </p>
          </div>

          <div>
            <label class="text-sm font-medium text-[var(--color-custom-300)]">En Venta</label>
            <p class="text-lg font-semibold">
              {{ animal.venta ? 'Disponible para venta' : 'No disponible' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Sección Adicional -->
      <div class="mt-8 border-t pt-6">
        <div class="grid grid-cols-3 gap-4 text-center">
          <div>
            <label class="text-sm font-medium text-[var(--color-custom-300)]">Peso Inicial</label>
            <p class="text-lg font-semibold">{{ animal.peso_inicial }} kg</p>
          </div>

          <div>
            <label class="text-sm font-medium text-[var(--color-custom-300)]">ID Reproducción</label>
            <p class="text-lg font-semibold">
              {{ animal.id_reproduccion || 'N/A' }}
            </p>
          </div>

          <div>
            <label class="text-sm font-medium text-[var(--color-custom-300)]">Fecha Fallecimiento</label>
            <p class="text-lg font-semibold">
              {{ animal.fecha_fallecimiento
                ? new Date(animal.fecha_fallecimiento).toLocaleDateString()
                : 'N/A' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modo Edición -->
    <UForm v-else :state="formData" @submit="handleSubmit" class="space-y-6">
      <div class="grid md:grid-cols-2 gap-6">
        <!-- Columna Izquierda -->
        <div class="space-y-4">
          <UFormField label="Fecha de Nacimiento" name="fecha_nacimiento" required>
            <UInput type="date" v-model="formData.fecha_nacimiento" />
          </UFormField>

          <UFormField label="Raza" name="raza" required>
            <UInput v-model="formData.raza" />
          </UFormField>

          <UFormField label="Tipo de Animal" name="tipo_animal" required>
            <USelect v-model="formData.tipo_animal" :items="['NOVILLO', 'TERNERO', 'TERNERA', 'VACA', 'TORO']"
              class="w-3xs" />
          </UFormField>
        </div>

        <!-- Columna Derecha -->
        <div class="space-y-4">
          <UFormField label="Peso Actual (kg)" name="peso_actual" required>
            <UInput type="number" step="0.1" v-model="formData.peso_actual" />
          </UFormField>

          <UFormField label="Estado de Salud" name="estado_salud" required>
            <USelect v-model="formData.estado_salud"
              :items="['EXCELENTE', 'BUENO', 'REGULAR', 'MALO', 'CRITICO', 'RECUPERACION', 'OBSERVACION']"
              class="w-3xs" />
          </UFormField>

          <UFormField label="En Venta" name="venta">
            <UCheckbox v-model="formData.venta" label="Disponible para venta" />
          </UFormField>
        </div>
      </div>

      <!-- Sección Adicional -->
      <div class="mt-8 border-t pt-6 grid grid-cols-3 gap-4">
        <UFormField label="Peso Inicial (kg)" name="peso_inicial">
          <UInput type="number" step="0.1" v-model="formData.peso_inicial" />
        </UFormField>

        <UFormField label="ID Reproducción" name="id_reproduccion">
          <UInput v-model="formData.id_reproduccion" />
        </UFormField>

        <UFormField label="Fecha Fallecimiento" name="fecha_fallecimiento">
          <UInput type="date" v-model="formData.fecha_fallecimiento" />
        </UFormField>
      </div>

      <div class="flex justify-end gap-3 mt-8">
        <UButton type="button" color="primary" @click="cancelEditing" :disabled="isSubmitting">
          Cancelar
        </UButton>
        <UButton type="submit" :loading="isSubmitting" :disabled="isSubmitting">
          Guardar Cambios
        </UButton>
      </div>
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
import type { Animal } from '~/types/animal'

const props = defineProps({
  animal: {
    type: Object as () => Animal,
    required: true
  },
  show: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['updated'])

const isEditing = ref(false)
const isSubmitting = ref(false)
const toast = useToast()

const formData = reactive({
  id_animal: props.animal.id_animal,
  fecha_nacimiento: props.animal.fecha_nacimiento.split('T')[0],
  raza: props.animal.raza,
  tipo_animal: props.animal.tipo_animal,
  peso_actual: props.animal.peso_actual,
  estado_salud: props.animal.estado_salud,
  venta: props.animal.venta,
  peso_inicial: props.animal.peso_inicial,
  id_reproduccion: props.animal.id_reproduccion,
  fecha_fallecimiento: props.animal.fecha_fallecimiento?.split('T')[0] || ''
})

const enableEditing = () => {
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
  Object.assign(formData, {
    id_animal: props.animal.id_animal,
    fecha_nacimiento: props.animal.fecha_nacimiento.split('T')[0],
    raza: props.animal.raza,
    tipo_animal: props.animal.tipo_animal,
    peso_actual: props.animal.peso_actual,
    estado_salud: props.animal.estado_salud,
    venta: props.animal.venta,
    peso_inicial: props.animal.peso_inicial,
    id_reproduccion: props.animal.id_reproduccion,
    fecha_fallecimiento: props.animal.fecha_fallecimiento?.split('T')[0] || ''
  })
}

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    const response = await $fetch(`/api/animal/specific/${props.animal.id_animal}`, {
      method: 'PUT',
      body: {
        ...formData,
        fecha_fallecimiento: formData.fecha_fallecimiento || null,
        id_reproduccion: formData.id_reproduccion || null
      }
    })

    if (!response?.animal) {
      throw new Error('La respuesta del servidor es inválida')
    }

    // Actualizar los datos locales
    Object.assign(props.animal, response.animal)

    toast.add({
      title: 'Actualización exitosa',
      description: 'Los datos del animal se han actualizado correctamente',
      color: 'success',
      icon: 'i-heroicons-check-circle'
    })

    isEditing.value = false
    emit('updated', response.animal)
  } catch (error: unknown) {
    console.error('Error en actualización:', error)

    let message = 'Error desconocido'
    if (error instanceof Error) {
      message = error.message
    } else if (typeof error === 'object' && error !== null && 'data' in error && typeof (error as any).data?.message === 'string') {
      message = (error as any).data.message
    }

    toast.add({
      title: 'Error al actualizar',
      description: message,
      color: 'error',
      icon: 'i-heroicons-exclamation-circle'
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>