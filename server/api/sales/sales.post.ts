// server/api/sales/sales.post.ts
import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "~/types/supabase";

export default defineEventHandler(async (event) => {

  const supabase = await serverSupabaseClient<Database>(event);

  const body = await readBody(event);

  // Validación mejorada
  if (!body.animal_id?.trim() || !body.fecha_venta || body.monto === null) {
    throw createError({
      statusCode: 400,
      statusMessage:
        "Datos incompletos: animal_id, fecha_venta y monto son requeridos",
    });
  }

  try {
    const { data, error } = await supabase
      .from("ventas")
      .insert({
        animal_id: body.animal_id,
        fecha_venta: new Date(body.fecha_venta).toISOString(),
        monto: parseFloat(body.monto),
        notas: body.notas?.trim() || null,
      })
      .select()
      .single();

    if (error) throw error;

    return { venta: data };
  } catch (error: any) {
    console.error("Error en endpoint de ventas:", error);
    throw createError({
      statusCode: error.code || 500,
      statusMessage: error.message || "Error desconocido al guardar la venta",
    });
  }
});
