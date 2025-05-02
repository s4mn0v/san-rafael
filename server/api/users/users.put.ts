// server/api/users/users.put.ts
import { defineEventHandler, readBody, createError } from "h3";
import {
  serverSupabaseClient,
  serverSupabaseUser,
  serverSupabaseServiceRole,
} from "#supabase/server";
import type { Database } from "~/types/supabase";

export default defineEventHandler(async (event) => {
  // 1. Autenticación
  const user = await serverSupabaseUser(event);
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Debes iniciar sesión",
    });
  }

  // 2. Clientes Supabase
  const client = await serverSupabaseClient<Database>(event);
  const serviceClient = await serverSupabaseServiceRole<Database>(event);

  // 3. Comprueba rol admin
  const { data: profile, error: profileError } = await client
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError) {
    throw createError({
      statusCode: 500,
      statusMessage: "Error al verificar rol",
      message: profileError.message,
    });
  }
  if (profile?.role !== "admin") {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
      message: "No tienes permisos de administrador",
    });
  }

  // 4. Lee y valida body
  const body = await readBody<
    Database["public"]["Tables"]["profiles"]["Update"]
  >(event);
  const { id, email, name, role: newRole } = body;
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "El campo id es obligatorio",
    });
  }
  if (!email && !name && !newRole) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Nada para actualizar",
    });
  }

  // 5. Construye objeto de actualización
  const updateData: Database["public"]["Tables"]["profiles"]["Update"] = {};
  if (email !== undefined) updateData.email = email;
  if (name !== undefined) updateData.name = name;
  if (newRole !== undefined) updateData.role = newRole;

  try {
    // 6. Actualiza el perfil
    const { data: updatedProfile, error: updateError } = await client
      .from("profiles")
      .update(updateData)
      .eq("id", id)
      .single()
      .throwOnError(); // Añadir este método

    // 7. Actualizar auth si cambió el email
    let authUpdateResult = null;
    if (email) {
      authUpdateResult = await serviceClient.auth.admin.updateUserById(id, {
        email: email,
      });

      if (authUpdateResult.error) {
        throw createError({
          statusCode: 500,
          statusMessage: "Error parcial en la actualización",
          message:
            "Perfil actualizado pero falló la actualización del email de autenticación",
        });
      }
    }

    // 8. Respuesta
    return {
      toast: {
        message:
          "Usuario actualizado correctamente" +
          (authUpdateResult ? " (incluyendo autenticación)" : ""),
      },
      user: {
        ...(updatedProfile as Database["public"]["Tables"]["profiles"]["Row"]), // Añadir tipo explícito
        auth_email:
          email ||
          (updatedProfile as Database["public"]["Tables"]["profiles"]["Row"])
            ?.email,
      },
    };
  } catch (error: any) {
    console.error("Error en actualización de usuario:", error);

    // Manejar errores de email duplicado
    if (
      error.message.includes("duplicate key value violates unique constraint")
    ) {
      throw createError({
        statusCode: 409,
        statusMessage: "Email ya registrado",
        message: "El correo electrónico ya está en uso por otro usuario",
      });
    }

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Internal Server Error",
      message: error.message || "Error desconocido al actualizar usuario",
    });
  }
});
