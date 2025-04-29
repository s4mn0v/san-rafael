// server/api/stock/stock.get.ts
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
    // Obtener total y datos con join de proveedores
    const { count } = await client
      .from("inventario")
      .select("*", { count: "exact", head: true });

    const { data, error } = await client
      .from("inventario")
      .select("*, proveedores(nombre_empresa)")
      .order("id_inventario", { ascending: true })
      .range(rangeFrom, rangeTo);

    if (error) throw error;

    return {
      inventario: data || [],
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
