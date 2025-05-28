import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "~/types/supabase";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event);
  const body = await readBody(event);
  const ids = body.ids as number[];

  if (!ids || !Array.isArray(ids)) {
    throw createError({
      statusCode: 400,
      statusMessage: "IDs de inventario no proporcionados",
    });
  }

  try {
    const { error } = await client
      .from('inventario')
      .delete()
      .in('id_inventario', ids);

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message || 'Error al eliminar el inventario',
      });
    }

    return { success: true, message: `${ids.length} registros eliminados` };
  } catch (error: any) {
    console.error("Error completo:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Error al eliminar los registros",
    });
  }
});