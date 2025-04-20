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
      message: "Solo administradores pueden eliminar animales",
      data: {
        toast: {
          type: "error",
          message: "❌ Acceso denegado: Requiere rol de administrador",
        },
      },
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
      message: deleteError.message,
      data: { 
        toast: { 
          type: "error",
          message: `Error eliminando animales: ${deleteError.details || deleteError.message}`
        }
      }
    });
  }

  return {
    success: true,
    count: ids.length,
    toast: {
      type: "success",
      message: `${ids.length} ${
        ids.length > 1 ? "animales" : "animal"
      } eliminado(s) correctamente`,
    },
  };
});
