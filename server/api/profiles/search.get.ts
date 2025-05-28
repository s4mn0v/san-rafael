import { serverSupabaseClient } from "#supabase/server";
import { createError } from "h3";
import type { Database } from "~/types/supabase";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event);
  const { q } = getQuery(event);
  const searchTerm = String(q || "")
    .trim()
    .toLowerCase();

  try {
    let query = client
      .from("profiles")
      .select("id, email, name, role")
      .order("email", { ascending: true }); // Ordenar por email

    if (searchTerm) {
      // Búsqueda insensible a mayúsculas/minúsculas
      query = query.or(
        `name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: "Database Error",
        message: error.message,
      });
    }

    // Filtrado adicional para tildes (si es necesario)
    const normalizedSearch = searchTerm
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    return (
      data?.filter((profile) => {
        const normalizedName =
          profile.name
            ?.normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase() || "";
        const normalizedEmail = profile.email
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase();

        return (
          normalizedName.includes(normalizedSearch) ||
          normalizedEmail.includes(normalizedSearch)
        );
      }) || []
    );
  } catch (err: any) {
    console.error("Search error:", err);
    throw createError({
      statusCode: 500,
      statusMessage: "Error en la búsqueda",
      message: err.message,
    });
  }
});
