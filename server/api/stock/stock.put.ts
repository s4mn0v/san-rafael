// server/api/stock/stock.put.ts
import { serverSupabaseClient } from "#supabase/server";
import { Database } from "~/types/supabase";
import { defineEventHandler, readBody, createError } from "h3";

// server/api/stock/stock.put.ts
export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event);
  const body = await readBody(event);

  const { id_inventario, tipo, descripcion, cantidad, precio, proveedor_id } =
    body;

  // Validación mejorada
  if (!id_inventario || typeof id_inventario !== "number") {
    throw createError({
      statusCode: 400,
      statusMessage: "ID de inventario inválido",
    });
  }

  const requiredFields = [
    "tipo",
    "descripcion",
    "cantidad",
    "precio",
    "proveedor_id",
  ];
  for (const field of requiredFields) {
    if (!body[field]) {
      throw createError({
        statusCode: 400,
        statusMessage: `Campo requerido: ${field}`,
      });
    }
  }

  const { data, error } = await client
    .from("inventario")
    .update({
      tipo,
      descripcion,
      cantidad,
      precio,
      proveedor_id: proveedor_id, // Eliminar conversión (ya viene como number)
    })
    .eq("id_inventario", id_inventario)
    .select()
    .single();

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }

  return { toast: { message: "Ítem actualizado correctamente." }, data };
});
