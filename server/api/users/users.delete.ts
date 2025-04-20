import { defineEventHandler, readBody, createError } from "h3";
import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import type { Database } from "~/types/supabase";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user) throw createError({ statusCode: 401, message: "Unauthorized" });

  const client = await serverSupabaseClient<Database>(event);
  
  // Verificar rol admin
  const { data: profile } = await client
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    throw createError({ statusCode: 403, message: "Forbidden" });
  }

  // Obtener IDs a eliminar
  const body = await readBody(event);
  const ids: string[] = body.ids;

  if (!ids?.length) {
    throw createError({ statusCode: 400, message: "IDs requeridos" });
  }

  // Prevenir auto-eliminación
  if (ids.includes(user.id)) {
    throw createError({
      statusCode: 400,
      message: "No puedes eliminarte a ti mismo",
    });
  }

  // Eliminar usuarios
  const { error } = await client.from("profiles").delete().in("id", ids);

  if (error) {
    throw createError({ statusCode: 500, message: error.message });
  }

  return { success: true, count: ids.length };
});
