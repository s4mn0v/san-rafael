// server/api/animal/get.ts
import { serverSupabaseClient } from '#supabase/server';
import { Database } from '~/types/supabase';

export default defineEventHandler(async (event) => {
  console.log('--- HITTING /api/animal/get ---'); // Log para saber que se ejecuta
  const client = await serverSupabaseClient<Database>(event);

  // Intenta obtener la sesión para ver si el usuario está autenticado aquí
  let sessionUserId = null;
  try {
    const { data: { session }, error: sessionError } = await client.auth.getSession();
    if (sessionError) {
        console.error('Error getting session in API route:', sessionError);
    }
    if (session?.user) {
        console.log('User session found in API route. User ID:', session.user.id);
        sessionUserId = session.user.id;
    } else {
        console.warn('No active user session found in API route!');
    }
  } catch (e) {
      console.error('Exception getting session:', e)
  }

  try {
    console.log('Attempting to fetch animals from Supabase...');
    const { data, error } = await client
      .from('animals')
      .select('*')
      .order('fecha_nacimiento', { ascending: false });

    // Loguea SIEMPRE el resultado, incluso si no hay error explícito
    console.log('Supabase response:', { data, error });

    if (error) {
      console.error('Error fetching animals from Supabase:', error);
      throw createError({
        statusCode: 500,
        statusMessage: `Error al obtener animales: ${error.message}`,
      });
    }

    // Loguea lo que se va a devolver
    const responsePayload = { animals: data || [] };
    console.log('Returning payload:', responsePayload);
    return responsePayload;

  } catch (err: any) {
    console.error('Server handler error fetching animals:', err);
     throw createError({
        statusCode: err.statusCode || 500,
        statusMessage: err.statusMessage || 'Error interno del servidor al buscar animales.',
      });
  }
});