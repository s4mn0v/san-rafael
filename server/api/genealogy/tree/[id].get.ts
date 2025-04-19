// server/api/genealogy/tree/[id].get.ts
import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "~/types/supabase";
import { createError } from "h3";

type TreeNode = {
  id: string;
  raza: string;
  tipo_animal: string;
  padre?: TreeNode;
  madre?: TreeNode;
  generacion: number;
};

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event);
  const id = getRouterParam(event, "id");

  if (!id) throw createError({ statusCode: 400, message: "ID requerido" });

  const fetchFamilyTree = async (
    animalId: string,
    generacion: number = 0
  ): Promise<TreeNode | undefined> => {
    // Cambiado a undefined
    // Obtener datos básicos del animal
    const { data: animal, error } = await client
      .from("animals")
      .select("id_animal, raza, tipo_animal, id_reproduccion")
      .eq("id_animal", animalId)
      .single();

    if (error || !animal) return undefined; // Cambiado a undefined

    // Convertir id_reproduccion a número
    const reproduccionId = animal.id_reproduccion
      ? parseInt(animal.id_reproduccion, 10)
      : null;

    // Obtener datos de reproducción
    let reproduccion = null;
    if (reproduccionId && !isNaN(reproduccionId)) {
      const { data } = await client
        .from("reproduccion")
        .select(
          "madre:animals!fk_reproduccion_madre(id_animal, raza, tipo_animal), padre:animals!fk_reproduccion_padre(id_animal, raza, tipo_animal)"
        )
        .eq("id_reproduccion", reproduccionId) // Ahora comparando número con número
        .single();

      reproduccion = data;
    }

    // Recursión para padres con verificación de undefined
    return {
      id: animal.id_animal,
      raza: animal.raza,
      tipo_animal: animal.tipo_animal,
      generacion,
      madre: reproduccion?.madre?.id_animal // Verificación en cadena
        ? await fetchFamilyTree(reproduccion.madre.id_animal, generacion + 1)
        : undefined,
      padre: reproduccion?.padre?.id_animal // Verificación en cadena
        ? await fetchFamilyTree(reproduccion.padre.id_animal, generacion + 1)
        : undefined,
    };
  };

  try {
    const treeData = await fetchFamilyTree(id);
    return treeData || null;
  } catch (error: any) {
    throw createError({ statusCode: 500, message: error.message });
  }
});
