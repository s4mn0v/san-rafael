import { serverSupabaseClient } from "#supabase/server";
import { Database } from "~/types/supabase";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event);
  const body = await readBody(event);

  try {
    const { error } = await client
      .from("reproduccion")
      .delete()
      .in("id_reproduccion", body.ids);

    if (error) throw error;

    return {
      success: true,
      message: `${body.ids.length} registros eliminados correctamente`,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || "Error eliminando registros",
    });
  }
});
