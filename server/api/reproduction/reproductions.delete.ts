import { defineEventHandler, readBody, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/supabase'

export default defineEventHandler(async event => {
  const { ids } = await readBody<{ ids:number[] }>(event)
  if (!Array.isArray(ids)||!ids.length) throw createError({ statusCode:400, statusMessage:'IDs no proporcionados.' })

  const client = await serverSupabaseClient<Database>(event)
  // 1) Limpio hijos
  await client.from('animals').update({ id_reproduccion: null })
    .in('id_reproduccion', ids.map(i=>i.toString()))
  // 2) Borro reproducciones
  const { count, error } = await client.from('reproduccion').delete().in('id_reproduccion', ids)
  if (error) throw createError({ statusCode:500, statusMessage:error.message })

  return { toast:{ message:`${count} registro(s) eliminado(s) y vínculos limpiados.` }}
})
