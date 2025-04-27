import { serverSupabaseClient } from "#supabase/server";
import { readBody, createError } from "h3";
import type { Database } from "~/types/supabase";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event);
  const body = await readBody<Database["public"]["Tables"]["reproduccion"]["Update"]>(event);

  const { id_reproduccion, madre_id, padre_id, tipo_concepcion, fecha_evento, raza } = body;
  if (!id_reproduccion) {
    throw createError({ statusCode: 400, statusMessage: "ID de registro obligatorio." });
  }

  // Construyo el objeto solo con los campos definidos
  const updateData: Partial<Database["public"]["Tables"]["reproduccion"]["Update"]> = {};
  if (madre_id !== undefined)       updateData.madre_id = madre_id;
  if (padre_id !== undefined)       updateData.padre_id = padre_id;
  if (tipo_concepcion !== undefined) updateData.tipo_concepcion = tipo_concepcion;
  if (fecha_evento !== undefined)    updateData.fecha_evento = fecha_evento;
  if (raza !== undefined)            updateData.raza = raza;

  const { error } = await client
    .from("reproduccion")
    .update(updateData)
    .eq("id_reproduccion", id_reproduccion);

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }

  return { toast: { message: "Registro actualizado correctamente." } };
});
