// server/api/users/users.post.ts
import { serverSupabaseServiceRole } from '#supabase/server'; // <--- CAMBIO AQUÍ
import { defineEventHandler, readBody, createError } from "h3";
import { z } from "zod";
// Importa el tipo Database y el tipo Insert específico
import type { Database } from "~/types/supabase"; // Ajusta la ruta si es necesario
type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];

const bodySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.string().min(1),
});

export default defineEventHandler(async (event) => {
  // Tipar el cliente Supabase con tu tipo Database, usando el service role client
  //                                       👇 CAMBIO AQUÍ
  const supabase = await serverSupabaseServiceRole<Database>(event);

  let body;
  try {
    const rawBody = await readBody(event);
    body = bodySchema.parse(rawBody);
  } catch (e: any) {
    console.error("Error de validación:", e.errors);
    throw createError({
      statusCode: 400,
      statusMessage: "Datos de entrada inválidos.",
      data: e.errors,
    });
  }

  const { email, password, name, role } = body;

  try {
    // Ahora esta llamada usará la service_key y tendrá permisos de administrador
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true, // O false, según tu configuración
      });

    if (authError) {
      console.error("Error Supabase Auth:", authError.message);
      if (authError.message.includes("User already registered")) {
        throw createError({
          statusCode: 409,
          statusMessage: "El correo electrónico ya está registrado.",
        });
      }
      throw createError({
        statusCode: authError.status || 500,
        statusMessage:
          authError.message || "Error al crear el usuario en autenticación.",
      });
    }

    if (!authData?.user) {
      console.error(
        "Respuesta inesperada de Supabase Auth, no se encontró el usuario:",
        authData
      );
      throw createError({
        statusCode: 500,
        statusMessage:
          "No se pudo obtener la información del usuario creado en autenticación.",
      });
    }

    const newUser = authData.user;

    if (!newUser.id || !newUser.email) {
      console.error("El usuario creado en Auth no tiene ID o Email:", newUser);
      // Considera eliminar el usuario de Auth si falla la creación del perfil (rollback)
      // await supabase.auth.admin.deleteUser(newUser.id); // ¡Manejar errores de esto también!
      throw createError({
        statusCode: 500,
        statusMessage:
          "Faltan datos esenciales del usuario de autenticación (ID o Email).",
      });
    }

    const profileData: ProfileInsert = {
      id: newUser.id,
      email: newUser.email,
      name: name,
      role: role,
    };

    // La inserción en la tabla 'profiles' también usará la service_key,
    // lo que significa que BYPASARÁ cualquier política de RLS.
    // Asegúrate de que esto es lo que quieres, o ajusta tus RLS
    // para permitir inserciones por parte del rol 'service_role' si es necesario.
    const { error: profileError } = await supabase
      .from("profiles")
      .insert(profileData);

    if (profileError) {
      console.error("Error Supabase DB (profiles):", profileError.message);
      // IMPORTANTE: Considerar eliminar el usuario de Auth si la inserción del perfil falla
      // await supabase.auth.admin.deleteUser(newUser.id) // Añadir manejo de errores para el delete
      throw createError({
        statusCode: 500,
        statusMessage:
          "Usuario creado en autenticación, pero falló al crear el perfil en la base de datos.",
      });
    }

    event.node.res.statusCode = 201;
    return { message: "Usuario y perfil creados exitosamente." };
  } catch (error: any) {
    console.error("Error en handler users.post:", error);
    if (error.statusCode) {
      throw error; // Ya es un error H3
    }
    throw createError({
      statusCode: 500,
      statusMessage:
        error.message || "Error interno del servidor al procesar la solicitud.",
    });
  }
});