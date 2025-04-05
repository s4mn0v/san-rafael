// middleware/role-guard.ts
import {
  defineNuxtRouteMiddleware,
  navigateTo,
  useSupabaseUser,
  useSupabaseClient,
} from "#imports";

export default defineNuxtRouteMiddleware(async (to, from) => {
  // --- 1. Obtener el usuario actual ---
  const user = useSupabaseUser();
  const client = useSupabaseClient();

  // --- 2. Verificar si el usuario está autenticado ---
  // Si no hay usuario y la ruta requiere autenticación (lo asumimos si tiene metadata 'roles')
  // O si explícitamente requiere estar logueado (podrías añadir otra meta key como 'requiresAuth: true')
  if (!user.value && to.meta.roles) {
    console.warn(
      "Acceso denegado: Usuario no autenticado intentando acceder a ruta protegida por rol:",
      to.path
    );
    return navigateTo("/login"); // O tu página de login
  }

  // Si el usuario está autenticado, pero la ruta no requiere roles específicos, permitir acceso.
  if (user.value && !to.meta.roles) {
    return; // Permite el acceso si la ruta no tiene restricciones de rol
  }

  // Si no hay usuario y la ruta no requiere roles, permitir acceso (páginas públicas)
  if (!user.value && !to.meta.roles) {
    return;
  }

  // --- 3. Obtener los roles requeridos para la ruta ---
  // Asegúrate de que 'roles' en definePageMeta sea un array de strings.
  const requiredRoles = to.meta.roles as string[] | undefined;

  // Si la ruta no especifica roles requeridos, permitir acceso (si ya pasó el chequeo de autenticación si era necesario)
  if (!requiredRoles || requiredRoles.length === 0) {
    return;
  }

  // --- 4. Obtener el rol del usuario desde la base de datos ---
  // Solo proceder si tenemos un usuario autenticado
  if (user.value) {
    try {
      const { data: profile, error } = await client
        .from("profiles")
        .select("role")
        .eq("id", user.value.id)
        .single<UserProfile>();

      if (error) {
        console.error("Error al obtener el perfil del usuario:", error.message);
        // Decide qué hacer en caso de error (¿redirigir a inicio? ¿mostrar error?)
        return navigateTo("/"); // Redirigir a inicio como fallback seguro
      }

      if (!profile || !profile.role) {
        console.warn(
          "Perfil o rol no encontrado para el usuario:",
          user.value.id
        );
        // El usuario está autenticado pero no tiene perfil/rol en tu tabla.
        // Esto puede pasar si el perfil no se creó correctamente.
        return navigateTo("/"); // Redirigir a inicio o a una página de error/configuración
      }

      const userRole = profile.role;

      // --- 5. Comparar el rol del usuario con los roles requeridos ---
      if (!requiredRoles.includes(userRole)) {
        // Si el rol del usuario NO está en la lista de roles permitidos
        console.warn(
          `Acceso denegado a ${to.path}. Rol requerido: ${requiredRoles.join(
            ", "
          )}. Rol del usuario: ${userRole}`
        );
        // Redirigir a una página no autorizada o a la página de inicio
        // Puedes usar from.path como una query para redirigir después del login si lo deseas
        return navigateTo("/"); // O '/unauthorized' o from.path si quieres intentar volver
      }

      // --- 6. Usuario autenticado y con rol permitido ---
      // Si el rol del usuario SÍ está incluido, permitir el acceso (no hacer nada)
      console.log(`Acceso permitido a ${to.path} para el rol: ${userRole}`);
      return;
    } catch (err) {
      console.error("Error inesperado en el middleware role-guard:", err);
      return navigateTo("/"); // Fallback en caso de error inesperado
    }
  } else {
    // Este caso teóricamente no debería alcanzarse por los chequeos previos, pero por seguridad:
    console.warn(
      "Acceso denegado: Intento de acceso a ruta con roles sin estar autenticado (fallback):",
      to.path
    );
    return navigateTo("/login"); // O tu página de login
  }
});
