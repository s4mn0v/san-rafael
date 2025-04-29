// server/api/reproduction/reproductions.get.ts
import { serverSupabaseClient } from "#supabase/server";
import { Database } from "~/types/supabase";
import { createError, getHeader } from "h3";

export default defineEventHandler(async (event) => {
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

  const client = await serverSupabaseClient<Database>(event);
  const query = getQuery(event);

  // Paginación
  const page = query.page ? Number(query.page) : 1;
  const pageSize = query.pageSize ? Number(query.pageSize) : 10;

  // Validaciones
  if (isNaN(page) || page < 1)
    throw createError({ statusCode: 400, statusMessage: "Página inválida" });
  if (isNaN(pageSize) || pageSize < 1)
    throw createError({
      statusCode: 400,
      statusMessage: "Tamaño de página inválido",
    });

  const rangeFrom = (page - 1) * pageSize;
  const rangeTo = rangeFrom + pageSize - 1;

  try {
    // Obtener total y datos con joins de animales
    const { count } = await client
      .from("reproduccion")
      .select("*", { count: "exact", head: true });

    const { data, error } = await client
      .from("reproduccion")
      .select(
        `
        id_reproduccion,
        tipo_concepcion,
        fecha_evento,
        raza,
        madre:madre_id (id_animal, raza, tipo_animal),
        padre:padre_id (id_animal, raza, tipo_animal),
        descendencia:animals!animals_id_reproduccion_fkey (
          id_animal,
          fecha_nacimiento
        )
      `
      )
      .order("fecha_evento", { ascending: false })
      .range(rangeFrom, rangeTo);

    if (error) throw error;

    return {
      reproducciones: data || [],
      total: count ?? 0,
      page,
      pageSize,
    };
  } catch (err: any) {
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: `Error: ${err.message}`,
    });
  }
});
