import { defineEventHandler, readBody, createError } from "h3";
import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import type { Database } from "~/types/supabase";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user) throw createError({ statusCode: 401, message: "No autorizado" });

  const client = await serverSupabaseClient<Database>(event);

  // Verificar rol admin
  const { data: profile, error: profileError } = await client
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError)
    throw createError({
      statusCode: 500,
      message: "Error al verificar perfil",
    });

  if (profile?.role !== "admin") {
    throw createError({
      statusCode: 403,
      message: "Acceso denegado: se requiere rol de administrador",
    });
  }

  // Obtener IDs a eliminar
  const body = await readBody(event);
  const ids: string[] = body.ids;

  if (!ids?.length || !Array.isArray(ids)) {
    throw createError({
      statusCode: 400,
      message: "Se requieren IDs válidos de animales",
    });
  }

  // Eliminar animales
  const { error: deleteError } = await client
    .from("animals")
    .delete()
    .in("id_animal", ids);

  if (deleteError) {
    throw createError({
      statusCode: 500,
      message: `Error al eliminar animales: ${deleteError.message}`,
    });
  }

  return {
    success: true,
    count: ids.length,
    message: `${ids.length} animales eliminados correctamente`,
  };
});
