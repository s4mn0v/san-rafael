import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import { H3Event } from "h3";
import { Database } from "~/types/supabase"; // Asegúrate que la ruta a tus tipos de Supabase sea correcta

export default defineEventHandler(async (event: H3Event) => {
  // --- 1. Verificar autenticación del usuario que hace la petición ---
  const requestingUser = await serverSupabaseUser(event);

  if (!requestingUser) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "User making the request is not authenticated", // Mensaje más específico
    });
  }

  // --- 2. Inicializar cliente Supabase ---
  const client = await serverSupabaseClient<Database>(event);

  // --- 3. Obtener el perfil Y ROL del usuario autenticado ---
  //        Se usa .single() porque esperamos UN SOLO perfil para el ID del usuario que hace la petición.
  const { data: requestingUserProfile, error: profileError } = await client
    .from("profiles")
    .select("role") // Solo necesitamos el rol para la verificación
    .eq("id", requestingUser.id)
    .single(); // Correcto aquí: solo queremos el perfil del *solicitante*

  if (profileError) {
    console.error(`Error fetching profile for user ID ${requestingUser.id}:`, profileError);
    throw createError({
      statusCode: 500, // Error interno del servidor al consultar la BD
      statusMessage: "Error fetching requesting user's profile",
      message: profileError.message,
    });
  }

  // Adicional: Verificar si el perfil existe (puede que el usuario exista en auth pero no en profiles)
  if (!requestingUserProfile) {
      console.error(`Profile not found for user ID ${requestingUser.id}`);
      throw createError({
          statusCode: 404, // O 403 Forbidden, dependiendo de tu lógica
          statusMessage: "Requesting user profile not found",
          message: "The profile for the authenticated user does not exist.",
      });
  }


  // --- 4. Verificar si el usuario autenticado es Administrador ---
  if (requestingUserProfile?.role !== "admin") {
    console.warn(`User ${requestingUser.email} (Role: ${requestingUserProfile?.role}) attempted to access admin-only endpoint.`);
    throw createError({
      statusCode: 403, // Forbidden: Autenticado pero sin permisos
      statusMessage: "Forbidden",
      message: "User does not have admin privileges",
    });
  }

  // --- 5. SI ES ADMIN: Obtener TODOS los perfiles ---
  //        Aquí NO se usa .single(), por lo que trae todos los registros.
  console.log(`Admin user ${requestingUser.email} fetching all profiles...`);
  const { data: allProfiles, error: fetchAllError } = await client
    .from("profiles")
    .select("*"); // Correcto: selecciona todas las columnas de todas las filas

  if (fetchAllError) {
    console.error("Error fetching all profiles:", fetchAllError);
    throw createError({
      statusCode: 500,
      statusMessage: "Error fetching data from database",
      message: fetchAllError.message,
    });
  }

  // --- 6. Devolver la lista completa de perfiles ---
  console.log(`Successfully fetched ${allProfiles?.length ?? 0} profiles.`);
  return allProfiles;
});