import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "~/types/supabase";

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient<Database>(event);
  const id = event.context.params?.id;
  const body = await readBody(event);

  if (!id)
    throw createError({ statusCode: 400, statusMessage: "ID requerido" });

  try {
    const { data, error } = await supabase
      .from("historial_salud")
      .update({
        descripcion: body.descripcion,
        fecha_evento: new Date(body.fecha_evento).toISOString(),
        observaciones: body.observaciones || null,
      })
      .eq("id_historial", Number(id))
      .select()
      .single();

    if (error) throw error;
    return { historial: data };
  } catch (error: any) {
    throw createError({
      statusCode: error.code || 500,
      statusMessage: error.message || "Error al actualizar",
    });
  }
});
