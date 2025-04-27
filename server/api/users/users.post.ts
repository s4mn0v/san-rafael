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
  const body = await readBody<Database['public']['Tables']['profiles']['Insert']>(event)
  const { id, email, role } = body
  if (!id || !email || !role) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Faltan campos obligatorios' })
  }

  // 5. Inserta nuevo usuario
  const { data: newUser, error: insertError } = await client
    .from('profiles')
    .insert(body)
    .single()

  if (insertError) {
    throw createError({ statusCode: 500, statusMessage: 'Error al crear usuario', message: insertError.message })
  }

  // 6. Respuesta
  return {
    toast: { message: 'Usuario creado correctamente.' },
    user: newUser
  }
})
