<script setup lang="ts">
const open = ref(false)
const form = ref()

const roles = ['admin', 'user']

import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const schema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(8, 'Debe tener al menos 8 caracteres'),
  role: z.string().min(1, 'Selecciona un rol')
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  name: undefined,
  email: undefined,
  password: undefined,
  role: 'user'
})

const toast = useToast()
const emit = defineEmits(['refresh'])

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    await $fetch('/api/users/users', {
      method: 'POST',
      body: event.data
    })
    toast.add({ title: 'Éxito', description: 'Usuario creado correctamente.', color: 'success' })
    open.value = false
    emit('refresh')
    state.name = undefined
    state.email = undefined
    state.password = undefined
    state.role = undefined
  } catch (error) {
    toast.add({ title: 'Error', description: 'No se pudo crear el usuario.', color: 'error' })
    console.error('Error creating user:', error)
  }
}
</script>

<template>
  <div>
    <UButton label="Agregar" color="neutral" @click="open = true" />
    <UModal v-model:open="open" title="Crear usuario" description="Agrega un nuevo usuario al sistema."
      :ui="{ footer: 'justify-end' }">
      <template #body>
        <UForm ref="form" :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
          <UFormField label="Nombre" name="name">
            <UInput v-model="state.name" />
          </UFormField>

          <UFormField label="Email" name="email">
            <UInput v-model="state.email" />
          </UFormField>

          <UFormField label="Contraseña" name="password">
            <UInput v-model="state.password" type="password" />
          </UFormField>

          <UFormField label="Rol" name="role">
            <USelect v-model="state.role" :items="roles" />
          </UFormField>
        </UForm>
      </template>

      <template #footer>
        <UButton label="Cancelar" color="error" @click="open = false" />
        <UButton label="Crear" color="neutral" @click="form.submit()" />
      </template>
    </UModal>
  </div>
</template>