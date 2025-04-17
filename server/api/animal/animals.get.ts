// server/api/animal/animals.get.ts
import { serverSupabaseClient } from "#supabase/server";
import { Database } from "~/types/supabase";
import { createError } from "h3"; // Asegúrate de importar createError

export default defineEventHandler(async (event) => {
  console.log("--- HITTING /api/animal/animals.get ---"); // Mantén este log
  const client = await serverSupabaseClient<Database>(event);

  const query = getQuery(event);
  const page = query.page ? Number(query.page) : 1; // Default a 1 si no se provee
  const pageSize = query.pageSize ? Number(query.pageSize) : 10; // Default a 10

  // Log de los parámetros recibidos y parseados
  console.log(`API Received Query: ${JSON.stringify(query)}`);
  console.log(`API Parsed - Page: ${page}, PageSize: ${pageSize}`);

  // Validar paginación
  if (isNaN(page) || page < 1) {
    console.error("API Error: Invalid page number received:", query.page);
    throw createError({
      statusCode: 400,
      statusMessage: "Número de página inválido",
    });
  }
  if (isNaN(pageSize) || pageSize < 1) {
    console.error("API Error: Invalid page size received:", query.pageSize);
    throw createError({
      statusCode: 400,
      statusMessage: "Tamaño de página inválido",
    });
  }

  const rangeFrom = (page - 1) * pageSize;
  const rangeTo = rangeFrom + pageSize - 1;
  console.log(`API Calculated Range: From ${rangeFrom} To ${rangeTo}`); // Log del rango

  try {
    // Obtener total (se puede optimizar si no cambia mucho, pero es más seguro así)
    const { count, error: countError } = await client
      .from("animals")
      .select("*", { count: "exact", head: true }); // count: 'exact' es clave

    if (countError) {
      console.error("API Supabase count error:", countError);
      throw countError; // Relanza el error
    }
    console.log(`API Fetched Count: ${count}`); // Log del conteo

    // Obtener datos paginados
    const { data, error: dataError } = await client
      .from("animals")
      .select("*")
      .order("fecha_nacimiento", { ascending: false }) // O el orden que prefieras
      .range(rangeFrom, rangeTo); // Usa las variables calculadas

    if (dataError) {
      console.error("API Supabase data fetch error:", dataError);
      throw dataError; // Relanza el error
    }
    console.log(`API Fetched ${data?.length ?? 0} records for page ${page}`); // Log de datos obtenidos

    const response = {
      animals: data || [],
      total: count ?? 0,
      page: page,
      pageSize: pageSize,
    };
    // Log the exact data being returned
    console.log(`API Returning: ${response.animals.length} animals, total ${response.total}, page ${response.page}, pageSize ${response.pageSize}`);
    return response;

  } catch (err: any) {
    // Loguear el error antes de devolverlo al cliente
    console.error("API Database/Processing Error:", err);
    // Devuelve un error estructurado
    throw createError({
      statusCode: err.statusCode || 500, // Usa el código de status del error si existe
      statusMessage: `Error del servidor: ${
        err.message || "Error desconocido en la base de datos"
      }`,
      // data: { details: err.details } // Opcional: añadir más detalles si son seguros de exponer
    });
  }
});