import { defineEventHandler, readBody, createError } from "h3";
import {
  serverSupabaseUser,
  serverSupabaseServiceRole, // <-- Importa este helper
} from "#supabase/server";
import type { Database } from "~/types/supabase";

export default defineEventHandler(async (event) => {
  // 1. Obtener el usuario administrador QUE HACE LA SOLICITUD (para verificar identidad y rol)
  const adminUser = await serverSupabaseUser(event);
  if (!adminUser) {
    // No hay usuario logueado haciendo la petición
    throw createError({ statusCode: 401, message: "Authentication required" });
  }

  // 2. Obtener el cliente Supabase con PRIVILEGIOS DE SERVICIO (para realizar acciones admin)
  //    Este cliente USARÁ la service_role key configurada.
  const serviceRoleClient = await serverSupabaseServiceRole<Database>(event);
  if (!serviceRoleClient) {
    // Esto no debería ocurrir si la serviceKey está bien configurada en nuxt.config o .env
    console.error(
      "Failed to initialize Supabase Service Role Client. Check NUXT_SUPABASE_SERVICE_KEY."
    );
    throw createError({
      statusCode: 500,
      message:
        "Server configuration error: Could not initialize service client.",
    });
  }

  // 3. Verificar que el usuario que realiza la solicitud es realmente un admin
  //    Usamos el serviceRoleClient para leer la tabla 'profiles' sin restricciones RLS
  const { data: adminProfile, error: profileError } = await serviceRoleClient
    .from("profiles")
    .select("role")
    .eq("id", adminUser.id) // Verificamos el ID del usuario que hizo la llamada
    .single();

  if (profileError) {
    console.error("Error fetching admin profile:", profileError);
    throw createError({
      statusCode: 500,
      message: `Error verifying admin role: ${profileError.message}`,
    });
  }

  if (adminProfile?.role !== "admin") {
    // El usuario logueado que intenta borrar no es admin
    throw createError({
      statusCode: 403,
      message: "Forbidden: Admin role required to delete users.",
    });
  }

  // 4. Obtener los IDs de los usuarios a eliminar del cuerpo de la solicitud
  const body = await readBody(event);
  const idsToDelete: string[] = body.ids;

  if (!idsToDelete || !Array.isArray(idsToDelete) || idsToDelete.length === 0) {
    throw createError({
      statusCode: 400,
      message: "Invalid or missing user IDs provided",
    });
  }

  // 5. Prevenir que el administrador se elimine a sí mismo
  if (idsToDelete.includes(adminUser.id)) {
    throw createError({
      statusCode: 400,
      message: "Action forbidden: Admins cannot delete their own account.",
    });
  }

  // --- Lógica de Eliminación ---
  const deletionErrors: { id: string; error: string }[] = [];
  const successfullyDeletedAuthIds: string[] = []; // IDs borrados de Auth

  // 6. Intentar eliminar cada usuario de Supabase Auth usando el Service Role Client
  for (const userId of idsToDelete) {
    try {
      console.log(
        `Attempting admin deletion for user ID: ${userId} using service role client...`
      );
      // *** USA EL CLIENTE DE SERVICIO AQUÍ ***
      const { data: deletionData, error: authError } =
        await serviceRoleClient.auth.admin.deleteUser(userId);

      if (authError) {
        // Si hay un error al eliminar de Auth, registrarlo y continuar con el siguiente
        console.error(
          `Service Role Client: Error deleting user ${userId} from Supabase Auth:`,
          authError.message,
          authError
        );
        deletionErrors.push({
          id: userId,
          error: `Auth deletion failed: ${authError.message}`,
        });
      } else {
        // Si la eliminación de Auth fue exitosa, añadir a la lista para eliminar de 'profiles'
        console.log(
          `Service Role Client: Successfully deleted user ${userId} from Supabase Auth.`
        );
        successfullyDeletedAuthIds.push(userId);
      }
    } catch (err: any) {
      // Capturar cualquier excepción inesperada durante la llamada a deleteUser
      console.error(
        `Service Role Client: Exception occurred while deleting user ${userId} from Auth:`,
        err.message
      );
      deletionErrors.push({
        id: userId,
        error: `Auth deletion exception: ${err.message}`,
      });
    }
  }

  // 7. Intentar eliminar los perfiles correspondientes de la tabla 'profiles'
  //    Solo para aquellos usuarios que fueron eliminados exitosamente de Auth
  let profileDeletionError: string | null = null;
  let successfulProfileDeletions = 0;
  if (successfullyDeletedAuthIds.length > 0) {
    console.log(
      `Attempting to delete profiles for IDs: [${successfullyDeletedAuthIds.join(
        ", "
      )}]`
    );
    const { error: profilesDeleteError, count } = await serviceRoleClient // *** USA EL CLIENTE DE SERVICIO TAMBIÉN AQUÍ ***
      .from("profiles")
      .delete({ count: "exact" }) // Pedir el conteo para verificar
      .in("id", successfullyDeletedAuthIds);

    if (profilesDeleteError) {
      console.error(
        `Service Role Client: Error deleting profiles for users [${successfullyDeletedAuthIds.join(
          ", "
        )}]:`,
        profilesDeleteError.message
      );
      profileDeletionError = `Failed to delete profiles: ${profilesDeleteError.message}`;
      // Marcar estos IDs como fallidos si la eliminación del perfil falló después de borrar el Auth
      successfullyDeletedAuthIds.forEach((id) => {
        if (!deletionErrors.some((e) => e.id === id)) {
          deletionErrors.push({
            id: id,
            error: `Auth deleted, but Profile deletion failed: ${profilesDeleteError.message}`,
          });
        }
      });
      successfulProfileDeletions = 0; // O ajustar según `count` si es parcial
    } else {
      console.log(
        `Service Role Client: Successfully deleted ${
          count ?? 0
        } profiles for users [${successfullyDeletedAuthIds.join(", ")}].`
      );
      successfulProfileDeletions = count ?? 0;
    }
  }

  // 8. Devolver una respuesta detallada
  const totalAttempted = idsToDelete.length;
  const totalAuthSuccessful = successfullyDeletedAuthIds.length;
  // Considera un éxito *total* solo si tanto Auth como Profile se eliminaron
  const fullySuccessfulDeletions = successfullyDeletedAuthIds.filter(
    (id) => !deletionErrors.some((e) => e.id === id)
  );

  if (deletionErrors.length > 0) {
    event.node.res.statusCode = 207; // Multi-Status (éxito parcial)
    return {
      success: false, // Indicar que no todo fue perfecto
      message: `Attempted ${totalAttempted} deletions. Auth deletion succeeded for ${totalAuthSuccessful}. Profile deletion succeeded for ${successfulProfileDeletions}. See errors for details.`,
      fullySuccessfulCount: fullySuccessfulDeletions.length,
      errors: deletionErrors,
    };
  }

  // Si todo salió bien (Auth y Profiles)
  return {
    success: true,
    message: `Successfully deleted ${fullySuccessfulDeletions.length} users (Auth and Profile).`,
    count: fullySuccessfulDeletions.length,
  };
});
