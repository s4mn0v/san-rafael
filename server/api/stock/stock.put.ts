// server/api/stock/stock.put.ts
import { serverSupabaseClient } from '#supabase/server'
import { Database } from '~/types/supabase'
import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event)
  const body = await readBody<Partial<Database['public']['Tables']['inventario']['Update']>>(event)

  const { id_inventario, tipo, descripcion, cantidad, precio, proveedor_id } = body
  if (!id_inventario || !tipo || !descripcion || cantidad == null || precio == null || !proveedor_id) {
    throw createError({ statusCode: 400, statusMessage: 'Faltan campos obligatorios.' })
  }

  const { error } = await client
    .from('inventario')
    .update({ tipo, descripcion, cantidad, precio, proveedor_id })
    .eq('id_inventario', id_inventario)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return { toast: { message: 'Ítem actualizado correctamente.' } }
})
