import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "~/types/supabase";

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient<Database>(event);
  const id = event.context.params?.id;

  if (!id)
    throw createError({ statusCode: 400, statusMessage: "ID requerido" });

  try {
    const { error } = await supabase
      .from("historial_salud")
      .delete()
      .eq("id_historial", Number(id));

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    throw createError({
      statusCode: error.code || 500,
      statusMessage: error.message || "Error al eliminar",
    });
  }
});
