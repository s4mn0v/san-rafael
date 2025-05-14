// server/api/animal/specific/[id].delete.ts
import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "~/types/supabase";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event);
  const id = event.context.params?.id;

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID de animal no proporcionado",
    });
  }

  try {
    const { error } = await client.rpc("delete_animal_cascade", {
      animal_id: id,
    });

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    return { success: true };
  } catch (error: any) {
    console.error("Full error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Error al eliminar el animal: " + error.message,
    });
  }
});
