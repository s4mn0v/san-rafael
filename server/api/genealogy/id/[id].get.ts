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
    // 1. Obtener animal
    const { data: animal, error: animalError } = await client
      .from("animals")
      .select("*")
      .eq("id_animal", id)
      .single();

    if (animalError) throw animalError;

    // 2. Obtener genealogía (si existe)
    const { data: genealogia, error: genealogiaError } = await client
      .from("genealogia")
      .select("*")
      .eq("animal_id", id)
      .maybeSingle(); // Permite null si no hay registros

    if (genealogiaError) throw genealogiaError;

    // 3. Obtener reproducción (si existe id_reproduccion)
    let reproduccionData = null;
    const reproduccionId = animal.id_reproduccion
      ? parseInt(animal.id_reproduccion, 10)
      : null;

    if (reproduccionId && !isNaN(reproduccionId)) {
      const { data, error: errReproduccion } = await client
        .from("reproduccion")
        .select(
          `
            *,
            madre:animals!fk_reproduccion_madre(id_animal, raza, tipo_animal),
            padre:animals!fk_reproduccion_padre(id_animal, raza, tipo_animal)
          `
        )
        .eq("id_reproduccion", reproduccionId)
        .maybeSingle();

      if (!errReproduccion) reproduccionData = data;
    }

    // Construir respuesta
    const response = {
      animal: animal,
      genealogia: genealogia
        ? {
            tipo_registro: genealogia.tipo_registro,
            documento: genealogia.documento,
            observaciones: genealogia.observaciones,
          }
        : null,
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
    // Manejar errores específicos
    if (err.message.includes("No rows found")) {
      throw createError({
        statusCode: 404,
        statusMessage: "Animal no encontrado",
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: `Error: ${err.message}`,
    });
  }
});
