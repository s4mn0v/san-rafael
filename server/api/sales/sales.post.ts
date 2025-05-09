// server/api/sales/sales.post.ts
import { serverSupabaseClient } from '#supabase/server'
import { Database } from '~/types/supabase'
import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async event => {
  const client = await serverSupabaseClient<Database>(event)
  const { animal_id, fecha_venta, monto } = await readBody<
    Partial<Database['public']['Tables']['ventas']['Insert']>
  >(event)

  if (!animal_id || !fecha_venta || monto == null) {
    throw createError({ statusCode: 400, statusMessage: 'Campos obligatorios faltantes' })
  }

  const { error } = await client
    .from('ventas')
    .insert({ animal_id, fecha_venta, monto })

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return { toast: { message: 'Venta registrada correctamente.' } }
})
