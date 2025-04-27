// server/api/animal/animals.put.ts
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import type { Database, AnimalInsert } from '~/types/supabase'
import { readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event)
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Autenticación requerida' })
  }

  // Leemos el cuerpo, puede ser parcial
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

  if (!id_animal) {
    throw createError({ statusCode: 400, statusMessage: 'ID del animal es obligatorio.' })
  }

  // Construimos el objeto de actualización
  const updateData: Partial<AnimalInsert> = {}
  if (fecha_nacimiento) updateData.fecha_nacimiento = fecha_nacimiento
  if (fecha_fallecimiento !== undefined) updateData.fecha_fallecimiento = fecha_fallecimiento
  if (raza) updateData.raza = raza
  if (tipo_animal) updateData.tipo_animal = tipo_animal
  if (peso_actual !== undefined) updateData.peso_actual = peso_actual
  if (estado_salud) updateData.estado_salud = estado_salud
  if (body.peso_inicial !== undefined) updateData.peso_inicial = body.peso_inicial
  if (body.venta !== undefined) updateData.venta = venta
  if (body.id_reproduccion !== undefined) updateData.id_reproduccion = id_reproduccion

  // Ejecutamos la actualización
  const { data, error } = await client
    .from('animals')
    .update(updateData)
    .eq('id_animal', id_animal)
    .select()
    .single()

  if (error) {
    console.error('Error al actualizar animal:', error)
    throw createError({
      statusCode: error.code === '42501' ? 403 : 500,
      statusMessage: `Error al actualizar el animal: ${error.message}`
    })
  }

  return {
    toast: { message: 'Animal actualizado correctamente' },
    animal: data,
  }
})
