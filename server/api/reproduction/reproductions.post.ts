// server/api/reproduction/reproductions.post.ts
import { defineEventHandler, readBody, createError } from "h3";
import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "~/types/supabase";

export default defineEventHandler(async (event) => {
  const body = await readBody<
    Database["public"]["Tables"]["reproduccion"]["Insert"] & { child_id: string }
  >(event);

  const { child_id, madre_id, padre_id, tipo_concepcion, fecha_evento, raza } =
    body;
  if (!child_id || !madre_id || !tipo_concepcion || !fecha_evento || !raza) {
    throw createError({ statusCode: 400, statusMessage: "Faltan campos." });
  }

  const client = await serverSupabaseClient<Database>(event);

  // 1) Insert + select().single() para que data no sea never
  const { data: rep, error: errRep } = await client
    .from("reproduccion")
    .insert({
      madre_id,
      padre_id: padre_id ?? null,
      tipo_concepcion,
      fecha_evento,
      raza,
    })
    .select()
    .single();
  if (errRep || !rep) {
    throw createError({ statusCode: 500, statusMessage: errRep?.message });
  }

  // 2) Asigno ese id_reproduccion al animal hijo
  const { error: errUpd } = await client
    .from("animals")
    .update({ id_reproduccion: rep.id_reproduccion.toString() })
    .eq("id_animal", child_id);
  if (errUpd) {
    throw createError({ statusCode: 500, statusMessage: errUpd.message });
  }

  return {
    toast: { message: "Registro creado y vínculo hijo asignado." },
    data: rep,
  };
});
