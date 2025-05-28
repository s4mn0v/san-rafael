// server/api/health/health.post.ts
import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "~/types/supabase";

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient<Database>(event);
  const body = await readBody(event);

  // Validación mejorada
  const requiredFields = ["animal_id", "descripcion", "fecha_evento"];
  const missingFields = requiredFields.filter((field) => !body[field]);

  if (missingFields.length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: `Campos requeridos faltantes: ${missingFields.join(", ")}`,
    });
  }

  try {
    const { data, error } = await supabase
      .from("historial_salud")
      .insert({
        animal_id: body.animal_id,
        descripcion: body.descripcion.trim(),
        fecha_evento: new Date(body.fecha_evento).toISOString(),
        observaciones: body.observaciones?.trim() || null,
      })
      .select()
      .single();

    if (error) throw error;
    return { historial: data };
  } catch (error: any) {
    throw createError({
      statusCode: error.code || 500,
      statusMessage: error.message || "Error al crear registro",
    });
  }
});
