import { serverSupabaseClient } from "#supabase/server";
import { readBody, createError } from "h3";
import type { Database } from "~/types/supabase";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event);
  const { ids } = await readBody<{ ids: number[] }>(event);

  if (!Array.isArray(ids) || ids.length === 0) {
    throw createError({ statusCode: 400, statusMessage: "IDs no proporcionados." });
  }

  const { error } = await client
    .from("reproduccion")
    .delete()
    .in("id_reproduccion", ids);

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }

  return { toast: { message: "Registro(s) eliminado(s) correctamente." } };
});
