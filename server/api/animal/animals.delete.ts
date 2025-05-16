// server/api/animal/animals.delete.ts
import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "~/types/supabase";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event);
  const body = await readBody(event);
  const ids = body.ids as string[];

  if (!ids || !Array.isArray(ids)) {
    throw createError({
      statusCode: 400,
      statusMessage: "IDs de animales no proporcionados",
    });
  }

  try {
    const results = await Promise.all(
      ids.map(async (id) => {
        const { error } = await client.rpc("delete_animal_cascade", {
          animal_id: id,
        });

        if (error?.code === "23503") {
          throw createError({
            statusCode: 409,
            statusMessage: `No se puede eliminar el animal ${id} por tener relaciones genealógicas activas`,
          });
        }

        return { id, error };
      })
    );

    const errors = results.filter((r) => r.error);
    if (errors.length > 0) {
      console.error("Errores en eliminación:", errors);
      throw createError({
        statusCode: 500,
        statusMessage: `Error al eliminar ${errors.length} animales`,
      });
    }

    return { success: true, message: `${ids.length} animales eliminados` };
  } catch (error: any) {
    console.error("Error completo:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Error al eliminar los animales",
    });
  }
});
