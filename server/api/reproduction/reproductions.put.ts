import { defineEventHandler, readBody, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/supabase'

export default defineEventHandler(async event => {
  const body = await readBody<Database['public']['Tables']['reproduccion']['Update'] & { child_id?:string }>(event)
  const { id_reproduccion, child_id, ...upd } = body
  if (!id_reproduccion) throw createError({ statusCode:400, statusMessage:'ID obligatorio' })

  const client = await serverSupabaseClient<Database>(event)
  // 1) Actualizo reproducción
  const { error: err1 } = await client
    .from('reproduccion')
    .update(upd)
    .eq('id_reproduccion', id_reproduccion)
  if (err1) throw createError({ statusCode:500, statusMessage: err1.message })

  // 2) Si cambió el hijo, limpio antiguos y asigno nuevo
  if (child_id) {
    // a) limpio a todos los que apuntaban antes a esta reproducción
    await client.from('animals').update({ id_reproduccion: null })
      .eq('id_reproduccion', id_reproduccion.toString())
    // b) asigno al nuevo
    await client.from('animals').update({ id_reproduccion: id_reproduccion.toString() })
      .eq('id_animal', child_id)
  }

  return { toast:{ message:'Registro y vínculo hijo actualizados.' } }
})
