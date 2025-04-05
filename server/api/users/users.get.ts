import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import { H3Event } from "h3";
import { Database } from "~/types/supabase"; // Ajusta ruta si cambia

export default defineEventHandler(async (event: H3Event) => {
  const user = await serverSupabaseUser(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "User not authenticated",
    });
  }

  const client = await serverSupabaseClient<Database>(event);

  // Obtener el perfil del usuario autenticado
  const { data: profile, error: profileError } = await client
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single(); // Asegura que solo se devuelve un único perfil

  if (profileError) {
    console.error("Error fetching profile from Supabase:", profileError);
    throw createError({
      statusCode: 500,
      statusMessage: "Error fetching user profile",
      message: profileError.message,
    });
  }

  // Verificar si el usuario es administrador
  if (profile?.role !== "admin") {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
      message: "User is not an admin",
    });
  }

  // Obtener todos los perfiles (solo si el usuario es admin)
  const { data: profiles, error } = await client.from("profiles").select("*");

  if (error) {
    console.error("Error fetching profiles:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Error fetching data from database",
      message: error.message,
    });
  }

  return profiles;
});
