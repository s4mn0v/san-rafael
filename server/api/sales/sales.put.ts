// server/api/sales/sales.put.ts
import { serverSupabaseClient } from '#supabase/server'
import { Database } from '~/types/supabase'
import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async event => {
  const client = await serverSupabaseClient<Database>(event)
  const body = await readBody(event)
  const { id_venta, animal_id, fecha_venta, monto } = body

  if (!id_venta || typeof id_venta !== 'number') {
    throw createError({ statusCode: 400, statusMessage: 'ID inválido' })
  }
  if (!animal_id || !fecha_venta || monto == null) {
    throw createError({ statusCode: 400, statusMessage: 'Campos obligatorios faltantes' })
  }

  const { error } = await client
    .from('ventas')
    .update({ animal_id, fecha_venta, monto })
    .eq('id_venta', id_venta)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return { toast: { message: 'Venta actualizada correctamente.' } }
})
