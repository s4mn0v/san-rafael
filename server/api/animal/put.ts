// server/api/animal/put.ts
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';
import { Database } from '~/types/supabase';
import type { AnimalUpdate } from '~/types/supabase';

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event);
  const user = await serverSupabaseUser(event); // Verifica autenticación
   if (!user) {
     throw createError({ statusCode: 401, statusMessage: 'Autenticación requerida' });
   }

  // Espera un objeto { id_animal: string, updates: AnimalUpdate }
  const body = await readBody<{ id_animal: string; updates: AnimalUpdate }>(event);

  if (!body.id_animal) {
    throw createError({ statusCode: 400, statusMessage: 'Falta el ID del animal a actualizar.' });
  }
  if (!body.updates || Object.keys(body.updates).length === 0) {
     throw createError({ statusCode: 400, statusMessage: 'No se proporcionaron datos para actualizar.' });
  }

  // RLS ("Allow ONLY admins to update animals") se aplica aquí
  const { data, error } = await client
    .from('animals')
    .update(body.updates)
    .eq('id_animal', body.id_animal)
    .select()
    .single();

  if (error) {
    console.error('Error updating animal (Supabase):', error);
     // Manejar error de "no encontrado" o "permiso denegado"
    if (error.code === 'PGRST116') { // Not found
       throw createError({ statusCode: 404, statusMessage: `Animal con ID ${body.id_animal} no encontrado.` });
    }
     if (error.code === '42501') { // Permission denied
       throw createError({ statusCode: 403, statusMessage: 'Permiso denegado para actualizar.' });
    }
    throw createError({ statusCode: 500, statusMessage: `Error al actualizar el animal: ${error.message}` });
  }

   console.log(`Admin ${user.id} updated animal:`, data?.id_animal);
  return { animal: data };
});