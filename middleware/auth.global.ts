import { useNuxtApp } from '#app'
import { SupabaseClient } from '@supabase/supabase-js'

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Realiza doble cast para tipar correctamente el cliente Supabase
  const { supabase } = useNuxtApp() as unknown as { supabase: SupabaseClient }
  
  // Obtenemos el usuario actual (Supabase v2)
  const { data: { user } } = await supabase.auth.getUser()

  // Si no hay usuario autenticado y no estamos en /login, redirigir a /login
  if (!user && to.path !== '/login') {
    return navigateTo('/login')
  }
  // Si hay usuario autenticado y estamos en /login, redirigir a /admin
  if (user && to.path === '/login') {
    return navigateTo('/admin')
  }
})
