// server/api/animal/animals.post.ts
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import type { Database, AnimalInsert } from '~/types/supabase'
import { readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event)
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Autenticación requerida' })
  }

  // Leemos el cuerpo de la petición
  const body = await readBody<Partial<AnimalInsert>>(event)
  const {
    id_animal,
    fecha_nacimiento,
    fecha_fallecimiento = null,
    raza,
    tipo_animal,
    peso_actual,
    estado_salud,
    venta = false,
    id_reproduccion = null,
  } = body

  // Si no viene peso_inicial, lo igualamos a peso_actual
  const peso_inicial = body.peso_inicial ?? peso_actual

  // Validación de campos obligatorios
  if (
    !id_animal ||
    !fecha_nacimiento ||
    !raza ||
    !tipo_animal ||
    peso_actual == null ||
    peso_inicial == null ||
    !estado_salud
  ) {
    throw createError({ statusCode: 400, statusMessage: 'Faltan campos obligatorios.' })
  }

  // Insertamos el nuevo animal (RLS de Supabase controlará permisos)
  const { data, error } = await client
    .from('animals')
    .insert([
      {
        id_animal,
        fecha_nacimiento,
        fecha_fallecimiento,
        raza,
        tipo_animal,
        peso_inicial,
        peso_actual,
        estado_salud,
        venta,
        id_reproduccion,
      }
    ])
    .select()
    .single()

  if (error) {
    console.error('Error al insertar animal:', error)
    throw createError({
      statusCode: error.code === '42501' ? 403 : 500,
      statusMessage: `Error al crear el animal: ${error.message}`
    })
  }

  // Retornamos un toast para el cliente y el registro insertado
  return {
    toast: { message: 'Animal agregado correctamente' },
    animal: data,
  }
})
