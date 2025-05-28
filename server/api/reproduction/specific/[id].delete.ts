import { serverSupabaseClient } from "#supabase/server";
import { Database } from "~/types/supabase";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event);
  const id = event.context.params?.id;

  if (!id)
    throw createError({
      statusCode: 400,
      statusMessage: "ID de reproducción requerido",
    });

  try {
    const { error } = await client
      .from("reproduccion")
      .delete()
      .eq("id_reproduccion", Number(id));

    if (error) throw error;

    return { success: true };
  } catch (err: any) {
    console.error("Error eliminando reproducción:", err);
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.message || "Error eliminando registro",
    });
  }
});
