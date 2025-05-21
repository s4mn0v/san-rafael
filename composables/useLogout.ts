// composables/useLogout.ts
import { useSupabaseClient } from '#imports'

export function useLogout() {
  const supabase = useSupabaseClient()

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error al cerrar sesión:', error.message)
      return
    }
    await navigateTo('/login')
  }

  return { logout }
}
