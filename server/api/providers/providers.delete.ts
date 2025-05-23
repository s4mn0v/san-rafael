import { serverSupabaseClient } from "#supabase/server";
import { Database } from "~/types/supabase";
import { createError } from "h3";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event);
  const id = event.context.params?.id;

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID del proveedor es requerido",
    });
  }

  try {
    const { error } = await client
      .from("proveedores")
      .delete()
      .eq("id_proveedor", id);

    if (error) throw error;

    return { message: "Proveedor eliminado exitosamente" };
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage: err.message
    });
  }
});