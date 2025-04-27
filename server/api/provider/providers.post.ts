import { serverSupabaseClient } from '#supabase/server'
import { Database } from '~/types/supabase'
import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event)
  const body = await readBody<Partial<Database['public']['Tables']['proveedores']['Insert']>>(event)

  const { id_proveedor, nombre_empresa, correo_empresa, telefono, direccion } = body

  if (!id_proveedor || !nombre_empresa || !correo_empresa || !telefono || !direccion) {
    throw createError({ statusCode: 400, statusMessage: 'Faltan campos obligatorios.' })
  }

  const { error } = await client
    .from('proveedores')
    .insert({ id_proveedor, nombre_empresa, correo_empresa, telefono, direccion })

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return { toast: { message: 'Proveedor agregado correctamente.' } }
})
