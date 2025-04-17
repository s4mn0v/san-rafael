// server/api/users/users.get.ts
import { defineEventHandler, getQuery, createError } from 'h3'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import type { H3Event } from 'h3'
import type { Database } from '~/types/supabase'

export default defineEventHandler(async (event: H3Event) => {
  // 1. Authenticated user check
  const requestingUser = await serverSupabaseUser(event)
  if (!requestingUser) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'User making the request is not authenticated'
    })
  }

  // 2. Initialize Supabase client
  const client = await serverSupabaseClient<Database>(event)

  // 3. Fetch and verify requester’s role
  const { data: requestingUserProfile, error: profileError } = await client
    .from('profiles')
    .select('role')
    .eq('id', requestingUser.id)
    .single()

  if (profileError) {
    console.error(`Error fetching profile for user ID ${requestingUser.id}:`, profileError)
    throw createError({
      statusCode: 500,
      statusMessage: "Error fetching requesting user's profile",
      message: profileError.message
    })
  }

  if (!requestingUserProfile) {
    console.error(`Profile not found for user ID ${requestingUser.id}`)
    throw createError({
      statusCode: 404,
      statusMessage: 'Requesting user profile not found',
      message: 'The profile for the authenticated user does not exist.'
    })
  }

  if (requestingUserProfile.role !== 'admin') {
    console.warn(`User ${requestingUser.email} (Role: ${requestingUserProfile.role}) attempted to access admin-only endpoint.`)
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      message: 'User does not have admin privileges'
    })
  }

  // 4. Parse pagination query params
  const { page = '1', pageSize = '10' } = getQuery(event)
  const pageNumber = Number(page)
  const size = Number(pageSize)

  // 5. Fetch total count (no rows returned)
  const { count, error: countError } = await client
    .from('profiles')
    .select('*', { count: 'exact', head: true })
  if (countError) {
    console.error('Error fetching profiles count:', countError)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching data from database',
      message: countError.message
    })
  }

  // 6. Fetch paginated data
  const from = (pageNumber - 1) * size
  const to = pageNumber * size - 1
  const { data: pagedProfiles, error: fetchError } = await client
    .from('profiles')
    .select('*')
    .range(from, to)

  if (fetchError) {
    console.error('Error fetching paged profiles:', fetchError)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching data from database',
      message: fetchError.message
    })
  }

  // 7. Return paginated response
  return {
    data: pagedProfiles || [],
    total: count || 0,
    page: pageNumber,
    pageSize: size
  }
})
