import { serverSupabaseClient } from "#supabase/server";
import { readBody, createError } from "h3";
import type { Database } from "~/types/supabase";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event);
  const body = await readBody<Database["public"]["Tables"]["reproduccion"]["Insert"]>(event);

  const { madre_id, padre_id, tipo_concepcion, fecha_evento, raza } = body;
  if (!madre_id || !tipo_concepcion || !fecha_evento || !raza) {
    throw createError({ statusCode: 400, statusMessage: "Faltan campos obligatorios." });
  }

  const { error } = await client
    .from("reproduccion")
    .insert({
      madre_id,
      padre_id: padre_id ?? null,
      tipo_concepcion,
      fecha_evento,
      raza,
    });

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }

  return { toast: { message: "Registro agregado correctamente." } };
});
