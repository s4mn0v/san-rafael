// server/api/animal/post.ts
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';
import { Database } from '~/types/supabase';
import type { AnimalInsert } from '~/types/supabase';

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event);
  // Opcional: Verificar si hay usuario (aunque RLS lo hará)
  const user = await serverSupabaseUser(event);
   if (!user) {
     throw createError({ statusCode: 401, statusMessage: 'Autenticación requerida' });
   }

  const body = await readBody<AnimalInsert>(event);

  // Validación básica (puedes añadir más)
  if (!body.id_animal || !body.fecha_nacimiento || !body.raza || !body.tipo_animal || !body.peso_inicial || !body.peso_actual || !body.estado_salud) {
    throw createError({ statusCode: 400, statusMessage: 'Faltan campos requeridos.' });
  }

  // La política RLS "Allow ONLY admins to insert animals" se encargará de verificar el rol.
  // Si el usuario no es admin, Supabase devolverá un error aquí.
  const { data, error } = await client
    .from('animals')
    .insert(body)
    .select() // Devuelve el registro insertado
    .single(); // Esperamos un solo resultado

  if (error) {
    console.error('Error inserting animal (Supabase):', error);
    // Error común si RLS niega el permiso: 403 Forbidden o similar,
    // aunque Supabase a veces lo devuelve como error genérico.
    // Podrías intentar mapear códigos de error si es necesario.
    throw createError({
      statusCode: error.code === '42501' ? 403 : 500, // 42501 es permission denied en PostgreSQL
      statusMessage: `Error al crear el animal: ${error.message}`,
    });
  }

  console.log(`Admin ${user.id} created animal:`, data?.id_animal);
  return { animal: data };
});