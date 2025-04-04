// server/api/users.get.ts
import { serverSupabaseClient } from '#supabase/server'
import { H3Event } from 'h3' // Necesario para tipar el 'event'

export default defineEventHandler(async (event: H3Event) => {
  // Obtenemos el cliente de Supabase específico para el servidor
  const client = await serverSupabaseClient(event)

  // Hacemos la consulta a la tabla 'profiles'
  // Asegúrate de que el nombre 'profiles' coincida exactamente con tu tabla en Supabase
  // select('*') trae todas las columnas. Puedes especificar columnas si lo necesitas: select('id, username, email')
  const { data, error } = await client.from('profiles').select('*')

  // Manejo básico de errores
  if (error) {
    console.error('Error fetching profiles from Supabase:', error)
    // Puedes lanzar un error más específico si quieres que Nuxt lo maneje
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching data from database',
      message: error.message, // Opcional: exponer el mensaje de Supabase (cuidado con info sensible)
    })
  }

  // Si todo va bien, devolvemos los datos
  return data
})