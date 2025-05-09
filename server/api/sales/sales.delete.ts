// server/api/sales/sales.delete.ts
import { serverSupabaseClient } from '#supabase/server'
import { Database } from '~/types/supabase'
import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async event => {
  const client = await serverSupabaseClient<Database>(event)
  const { ids } = await readBody<{ ids: number[] }>(event)

  if (!Array.isArray(ids) || ids.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No se proporcionaron IDs' })
  }

  const { error } = await client
    .from('ventas')
    .delete()
    .in('id_venta', ids)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return { toast: { message: 'Ventas eliminadas correctamente.' } }
})
