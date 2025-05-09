// server/api/sales/sales.get.ts
import { serverSupabaseClient } from '#supabase/server'
import { Database } from '~/types/supabase'
import { defineEventHandler, getQuery, createError, getHeader } from 'h3'

export default defineEventHandler(async event => {
  const sec = getHeader(event, 'sec-fetch-site')
  if (sec === 'none') throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  const client = await serverSupabaseClient<Database>(event)
  const { page = '1', pageSize = '10' } = getQuery(event)
  const p = Number(page), ps = Number(pageSize)
  if (isNaN(p) || p < 1 || isNaN(ps) || ps < 1) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid pagination' })
  }
  const from = (p - 1) * ps, to = from + ps - 1

  try {
    const { count } = await client
      .from('ventas')
      .select('*', { head: true, count: 'exact' })
    const { data, error } = await client
      .from('ventas')
      .select('*')
      .order('id_venta', { ascending: true })
      .range(from, to)
    if (error) throw error
    return { ventas: data || [], total: count || 0, page: p, pageSize: ps }
  } catch (err: any) {
    throw createError({ statusCode: err.statusCode || 500, statusMessage: err.message })
  }
})
