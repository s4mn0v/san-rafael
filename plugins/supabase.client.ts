import { createClient, SupabaseClient } from '@supabase/supabase-js'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public
  const supabaseUrl = config.supabaseUrl as string
  const supabaseAnonKey = config.supabaseAnonKey as string

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('supabaseKey is required.')
  }

  const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey)

  return {
    provide: { supabase }
  }
})
