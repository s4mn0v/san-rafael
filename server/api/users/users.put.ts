import { defineEventHandler, readBody, createError } from 'h3'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import type { Database } from '~/types/supabase'

export default defineEventHandler(async (event) => {
  // 1. Autenticación
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized', message: 'Debes iniciar sesión' })
  }

  // 2. Cliente Supabase
  const client = await serverSupabaseClient<Database>(event)

  // 3. Comprueba rol admin
  const { data: profile, error: profileError } = await client
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError) {
    throw createError({ statusCode: 500, statusMessage: 'Error al verificar rol', message: profileError.message })
  }
  if (profile?.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden', message: 'No tienes permisos de administrador' })
  }

  // 4. Lee y valida body
  const body = await readBody<Database['public']['Tables']['profiles']['Update']>(event)
  const { id, email, name, role: newRole } = body
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'El campo id es obligatorio' })
  }
  if (!email && !name && !newRole) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Nada para actualizar' })
  }

  // 5. Construye objeto de actualización
  const updateData: Database['public']['Tables']['profiles']['Update'] = {}
  if (email !== undefined) updateData.email = email
  if (name  !== undefined) updateData.name  = name
  if (newRole !== undefined) updateData.role = newRole

  // 6. Actualiza el perfil
  const { data: updated, error: updateError } = await client
    .from('profiles')
    .update(updateData)
    .eq('id', id)
    .single()

  if (updateError) {
    throw createError({ statusCode: 500, statusMessage: 'Error al actualizar usuario', message: updateError.message })
  }

  // 7. Respuesta
  return {
    toast: { message: 'Usuario actualizado correctamente.' },
    user: updated
  }
})
