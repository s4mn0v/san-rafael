// server/api/users/users.get.ts
import { defineEventHandler, getQuery, createError, getHeader } from "h3";
import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import type { H3Event } from "h3";
import type { Database } from "~/types/supabase";

export default defineEventHandler(async (event: H3Event) => {
  // --- INICIO: Comprobación de Acceso Directo ---
  const secFetchSite = getHeader(event, "sec-fetch-site");

  if (secFetchSite === "none") {
    console.warn(
      `Acceso directo bloqueado para la ruta ${event.path}. Sec-Fetch-Site: ${secFetchSite}`
    );
    throw createError({
      statusCode: 403, // Forbidden
      statusMessage: "Forbidden",
      message: "Direct access not allowed.",
    });
  }
  // --- FIN: Comprobación de Acceso Directo ---

  // 1. Authenticated user check
  const requestingUser = await serverSupabaseUser(event);
  if (!requestingUser) {
    // ... (manejo de error de no autenticado)
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "User making the request is not authenticated",
    });
  }

  // 2. Initialize Supabase client
  const client = await serverSupabaseClient<Database>(event);

  // 3. Fetch and verify requester’s role
  const { data: requestingUserProfile, error: profileError } = await client
    .from("profiles")
    .select("role")
    .eq("id", requestingUser.id)
    .single();

  if (profileError /* ... manejo de errores ... */) {
    throw createError({
      statusCode: 500,
      statusMessage: "Error fetching requesting user's profile",
      message: profileError.message,
    });
  }
  if (!requestingUserProfile /* ... manejo de errores ... */) {
    throw createError({
      statusCode: 404,
      statusMessage: "Requesting user profile not found",
      message: "The profile for the authenticated user does not exist.",
    });
  }
  if (requestingUserProfile.role !== "admin" /* ... manejo de errores ... */) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
      message: "User does not have admin privileges",
    });
  }

  // 4. Parsear parámetros de consulta
  const { page = "1", pageSize = "10", search } = getQuery(event);
  const pageNumber = Number(page);
  const size = Number(pageSize);

  // 5. Construir query base
  let query = client.from("profiles").select("*", { count: "exact" });

  // Aplicar filtro de búsqueda
  if (search) {
    query = query.or(
      `name.ilike.%${search}%,email.ilike.%${search}%,role.ilike.%${search}%`
    );
  }

  // 6. Paginación
  const {
    data: pagedProfiles,
    error: fetchError,
    count,
  } = await query.range((pageNumber - 1) * size, pageNumber * size - 1);

  if (fetchError) {
    throw createError({
      statusCode: 500,
      statusMessage: "Error fetching data from database",
      message: fetchError.message,
    });
  }

  // 7. Return paginated response
  return {
    data: pagedProfiles || [],
    total: count || 0,
    page: pageNumber,
    pageSize: size,
  };
});
