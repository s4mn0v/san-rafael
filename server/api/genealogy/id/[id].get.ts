// server/api/genealogy/id/[id].get.ts
import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "~/types/supabase";
import { createError } from "h3";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event);
  const id = getRouterParam(event, "id");

  if (!id)
    throw createError({
      statusCode: 400,
      statusMessage: "Se requiere ID del animal",
    });

  try {
    // Obtener datos de genealogía con información del animal
    const { data: genealogia, error: errGenealogia } = await client
      .from("genealogia")
      .select("*, animals(*)")
      .eq("animal_id", id)
      .single();

    if (errGenealogia) throw errGenealogia;

    // Convertir id_reproduccion a número y validar
    const reproduccionId = genealogia.animals?.id_reproduccion
      ? parseInt(genealogia.animals.id_reproduccion, 10)
      : null;

    let reproduccionData = null;
    if (reproduccionId && !isNaN(reproduccionId)) {
      const { data, error: errReproduccion } = await client
        .from("reproduccion")
        .select(
          "*, madre:animals!fk_reproduccion_madre(id_animal, raza), padre:animals!fk_reproduccion_padre(id_animal, raza)"
        )
        .eq("id_reproduccion", reproduccionId)
        .single();

      if (!errReproduccion) reproduccionData = data;
    }

    const response = {
      animal: genealogia.animals,
      genealogia: {
        tipo_registro: genealogia.tipo_registro,
        documento: genealogia.documento,
        observaciones: genealogia.observaciones,
      },
      reproduccion: reproduccionData
        ? {
            tipo_concepcion: reproduccionData.tipo_concepcion,
            fecha_evento: reproduccionData.fecha_evento,
            madre: reproduccionData.madre,
            padre: reproduccionData.padre,
          }
        : null,
    };

    return response;
  } catch (err: any) {
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: `Error: ${err.message}`,
    });
  }
});
