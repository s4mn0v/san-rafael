// server/api/reproduction/reproductions.get.ts
import { serverSupabaseClient } from "#supabase/server";
import { Database } from "~/types/supabase";
import { createError, getHeader, getQuery } from "h3";

export default defineEventHandler(async (event) => {
  // Verificación de seguridad (opcional)
  const secFetchSite = getHeader(event, "sec-fetch-site");
  if (secFetchSite === "none" && process.env.NODE_ENV === "production") {
    console.warn(`Acceso directo bloqueado a ${event.path}`);
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
    });
  }

  const client = await serverSupabaseClient<Database>(event);
  const query = getQuery(event);

  // Validación de parámetros
  const page = Number(query.page) || 1;
  const pageSize = Number(query.pageSize) || 10;

  if (isNaN(page) || page < 1 || isNaN(pageSize) || pageSize < 1) {
    throw createError({
      statusCode: 400,
      statusMessage: "Parámetros de paginación inválidos",
    });
  }

  try {
    // Consulta principal
    const { data, error, count } = await client
      .from("reproduccion")
      .select("*", { count: "exact" })
      .order("fecha_evento", { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) throw error;

    // Mapeamos cada fila para añadir `id` = `id_reproduccion`
    const reproduccionesConId = (data || []).map((row) => ({
      ...row,
      id: row.id_reproduccion,
    }));

    return {
      reproducciones: reproduccionesConId,
      total: count || 0,
      page,
      pageSize,
    };
  } catch (err: any) {
    console.error("Error en API reproducciones:", err);
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.message || "Error obteniendo registros",
    });
  }
});
