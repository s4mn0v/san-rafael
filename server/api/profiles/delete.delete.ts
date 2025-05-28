// server/api/profiles/delete.delete.ts
import { defineEventHandler, readBody, createError } from "h3";
import {
  serverSupabaseUser,
  serverSupabaseServiceRole,
} from "#supabase/server";
import type { Database } from "~/types/supabase";

export default defineEventHandler(async (event) => {
  // 1. Verificar usuario autenticado
  const adminUser = await serverSupabaseUser(event);
  if (!adminUser) {
    throw createError({ statusCode: 401, message: "Autenticación requerida" });
  }

  // 2. Obtener cliente con privilegios
  const serviceRoleClient = await serverSupabaseServiceRole<Database>(event);

  // 3. Verificar rol de admin
  const { data: adminProfile, error: profileError } = await serviceRoleClient
    .from("profiles")
    .select("role")
    .eq("id", adminUser.id)
    .single();

  if (profileError || adminProfile?.role !== "admin") {
    throw createError({ statusCode: 403, message: "Acceso no autorizado" });
  }

  // 4. Obtener IDs a eliminar
  const body = await readBody(event);
  const idsToDelete: string[] = body.ids;

  if (!idsToDelete?.length || !Array.isArray(idsToDelete)) {
    throw createError({ statusCode: 400, message: "IDs inválidos" });
  }

  // 5. Prevenir auto-eliminación
  if (idsToDelete.includes(adminUser.id)) {
    throw createError({
      statusCode: 400,
      message: "No puedes eliminarte a ti mismo",
    });
  }

  // 6. Eliminar de Auth y Profiles
  const deletionResults = await Promise.all(
    idsToDelete.map(async (id) => {
      try {
        // Eliminar de Auth
        const { error: authError } =
          await serviceRoleClient.auth.admin.deleteUser(id);
        if (authError) throw authError;

        // Eliminar de Profiles
        const { error: profileError } = await serviceRoleClient
          .from("profiles")
          .delete()
          .eq("id", id);

        if (profileError) throw profileError;

        return { id, success: true };
      } catch (error: any) {
        return { id, success: false, error: error.message };
      }
    })
  );

  // 7. Preparar respuesta
  const errors = deletionResults
    .filter((r) => !r.success)
    .map((r) => ({ id: r.id, error: r.error }));

  return {
    success: errors.length === 0,
    message:
      errors.length > 0
        ? `Eliminados ${idsToDelete.length - errors.length} de ${
            idsToDelete.length
          } perfiles`
        : `Todos los ${idsToDelete.length} perfiles eliminados correctamente`,
    errors,
  };
});
