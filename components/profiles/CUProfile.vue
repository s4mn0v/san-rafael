<template>
  <UModal v-model:open="isOpen" title="Agregar Usuario" description="Formulario para registrar un nuevo usuario.">
    <UButton icon="i-heroicons-plus-16-solid" @click="openModal"
      class="bg-[var(--color-custom-500)] dark:bg-[var(--color-custom-50)] text-[var(--color-custom-50)] dark:text-[var(--color-custom-500)] hover:text-[var(--color-custom-50)] hover:dark:text-[var(--color-custom-500)] rounded-full" title="Agregar usuario"/>

    <template #body>
      <UForm :state="form" class="space-y-4" @submit="handleSubmit">
        <div class="flex space-x-4">
          <UFormField name="nombre" required>
            <template #label>
              <span class="text-[var(--color-custom-400)] dark:text-[var(--color-custom-100)]">Nombre</span>
            </template>
            <UInput v-model="form.name" />
          </UFormField>

          <UFormField name="email" required>
            <template #label>
              <span class="text-[var(--color-custom-400)] dark:text-[var(--color-custom-100)]">Email</span>
            </template>
            <UInput type="email" v-model="form.email" />
          </UFormField>
        </div>

        <UFormField name="rol" required>
          <template #label>
            <span class="text-[var(--color-custom-400)] dark:text-[var(--color-custom-100)]">Rol</span>
          </template>
          <USelect v-model="form.role" :items="roles" />
        </UFormField>

        <div>
          <UFormField label="Password">
            <UInput v-model="password" placeholder="Password" :color="color" :type="show ? 'text' : 'password'"
              :ui="{ trailing: 'pe-1' }" :aria-invalid="score < 4" aria-describedby="password-strength" class="w-full">
              <template #trailing>
                <UButton color="neutral" variant="link" size="sm" :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                  :aria-label="show ? 'Hide password' : 'Show password'" :aria-pressed="show" aria-controls="password"
                  @click="show = !show" />
              </template>
            </UInput>
          </UFormField>

          <UProgress :color="color" :indicator="text" :model-value="score" :max="4" size="sm" />

          <p id="password-strength" class="text-sm font-medium">
            {{ text }}. Must contain:
          </p>

          <ul class="space-y-1" aria-label="Password requirements">
            <li v-for="(req, index) in strength" :key="index" class="flex items-center gap-0.5"
              :class="req.met ? 'text-success' : 'text-muted'">
              <UIcon :name="req.met ? 'i-lucide-circle-check' : 'i-lucide-circle-x'" class="size-4 shrink-0" />

              <span class="text-xs font-light">
                {{ req.text }}
                <span class="sr-only">
                  {{ req.met ? ' - Requirement met' : ' - Requirement not met' }}
                </span>
              </span>
            </li>
          </ul>
        </div>

        <div class="flex justify-end gap-3 mt-4">
          <UButton type="button" @click="closeModal">Cancelar</UButton>
          <UButton type="submit" :loading="isSubmitting">
            Crear Registro
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const emit = defineEmits(['saved', 'close'])

const show = ref(false)
const password = ref('')
const isSubmitting = ref(false)
const roles = ref(['admin', 'user'])
const isOpen = ref(false)

const form = reactive({
  name: '',
  email: '',
  role: 'user'
})

const openModal = () => {
  isOpen.value = true
  resetForm()
}

const closeModal = () => {
  isOpen.value = false
  resetForm()
  emit('close')
}

const resetForm = () => {
  Object.assign(form, {
    name: '',
    email: '',
    role: 'user'
  })
  password.value = ''
}

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    await $fetch('/api/profiles/profile', {
      method: 'POST',
      body: {
        ...form,
        password: password.value
      }
    })

    useToast().add({
      title: 'Perfil creado!',
      color: 'success'
    })

    emit('saved')
    closeModal()
  } catch (error) {
    const err = error as { data?: { message?: string } }
    useToast().add({
      title: 'Error',
      description: err.data?.message || 'Error al crear el perfil',
      color: 'error'
    })
    console.error('Error creating user:', error)
  } finally {
    isSubmitting.value = false
  }
}

// Password strength logic
const checkStrength = (str: string) => {
  const requirements = [
    { regex: /.{8,}/, text: 'At least 8 characters' },
    { regex: /\d/, text: 'At least 1 number' },
    { regex: /[a-z]/, text: 'At least 1 lowercase letter' },
    { regex: /[A-Z]/, text: 'At least 1 uppercase letter' }
  ]
  return requirements.map(req => ({ met: req.regex.test(str), text: req.text }))
}

const strength = computed(() => checkStrength(password.value))
const score = computed(() => strength.value.filter(req => req.met).length)
const color = computed(() => {
  if (score.value === 0) return 'neutral'
  if (score.value <= 1) return 'error'
  if (score.value <= 2) return 'warning'
  if (score.value === 3) return 'warning'
  return 'success'
})
const text = computed(() => {
  if (score.value === 0) return 'Enter a password'
  if (score.value <= 2) return 'Weak password'
  if (score.value === 3) return 'Medium password'
  return 'Strong password'
})

defineExpose({
  openModal() {
    resetForm()
    isOpen.value = true
  }
})
</script>