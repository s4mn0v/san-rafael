// server/api/animal/delete.ts
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';
import { Database } from '~/types/supabase';

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event);
   const user = await serverSupabaseUser(event); // Verifica autenticación
   if (!user) {
     throw createError({ statusCode: 401, statusMessage: 'Autenticación requerida' });
   }

  const query = getQuery(event);
  const animalId = query.id as string;

  if (!animalId) {
    throw createError({ statusCode: 400, statusMessage: 'Falta el ID del animal a eliminar.' });
  }

  // RLS ("Allow ONLY admins to delete animals") se aplica aquí
  const { error } = await client
    .from('animals')
    .delete()
    .eq('id_animal', animalId);

  if (error) {
    console.error('Error deleting animal (Supabase):', error);
     if (error.code === '42501') { // Permission denied
       throw createError({ statusCode: 403, statusMessage: 'Permiso denegado para eliminar.' });
    }
     // Supabase delete no suele fallar si no encuentra filas, pero podrías verificar 'count' si lo devuelves.
    throw createError({ statusCode: 500, statusMessage: `Error al eliminar el animal: ${error.message}` });
  }

  console.log(`Admin ${user.id} deleted animal:`, animalId);
  return { success: true, message: `Animal con ID ${animalId} eliminado.` };
});