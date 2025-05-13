// server/api/sales/specific/[id].put.ts
import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "~/types/supabase";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event);
  const id = event.context.params?.id;
  const body = await readBody(event);

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID de venta no proporcionado",
    });
  }

  // Validación básica
  if (!body.fecha_venta || body.monto === null) {
    throw createError({
      statusCode: 400,
      statusMessage: "Fecha y monto son requeridos",
    });
  }

  try {
    const { data, error } = await client
      .from("ventas")
      .update({
        fecha_venta: new Date(body.fecha_venta).toISOString(),
        monto: Number(body.monto),
        notas: body.notas || null,
      })
      .eq("id_venta", Number(id))
      .select()
      .single();

    if (error) throw error;

    return { venta: data };
  } catch (error: any) {
    throw createError({
      statusCode: error.code || 500,
      statusMessage: error.message || "Error al actualizar la venta",
    });
  }
});
