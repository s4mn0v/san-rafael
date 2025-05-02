<script setup lang="ts">
const open = ref(false)
const form = ref()
const selectedUser = ref()

const roles = ['admin', 'user']

import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const schema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Correo electrónico inválido'),
  role: z.string().min(1, 'Selecciona un rol')
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  name: undefined,
  email: undefined,
  role: undefined
})

const toast = useToast()
const emit = defineEmits(['refresh'])

function openModal(user: any) {
  selectedUser.value = user
  state.name = user.name
  state.email = user.email
  state.role = user.role
  open.value = true
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (!selectedUser.value) return

  try {
    await $fetch('/api/users/users', {
      method: 'PUT',
      body: {
        id: selectedUser.value.id,
        ...event.data
      }
    })
    toast.add({ title: 'Éxito', description: 'Usuario actualizado correctamente.', color: 'success' })
    open.value = false
    emit('refresh')
    resetState()
  } catch (error: any) {
    const message = error.data?.message || error.message
    toast.add({ title: 'Error', description: message || 'Error al actualizar usuario', color: 'error' })
  }
}

function resetState() {
  state.name = undefined
  state.email = undefined
  state.role = undefined
  selectedUser.value = null
}

defineExpose({
  openModal
})
</script>

<template>
  <div>
    <UModal v-model:open="open" title="Editar usuario" description="Modifica los datos del usuario seleccionado."
      :ui="{ footer: 'justify-end' }">
      <template #body>
        <UForm ref="form" :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
          <UFormField label="Nombre" name="name">
            <UInput v-model="state.name" />
          </UFormField>

          <UFormField label="Email" name="email">
            <UInput v-model="state.email" type="email" />
          </UFormField>

          <UFormField label="Rol" name="role">
            <USelect v-model="state.role" :items="roles" />
          </UFormField>
        </UForm>
      </template>

      <template #footer>
        <UButton label="Cancelar" color="error" @click="open = false" />
        <UButton label="Guardar" type="submit" color="success" @click="form.submit()" />
      </template>
    </UModal>
  </div>
</template>