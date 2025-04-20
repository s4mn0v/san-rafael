// middleware/auth.global.ts
import { useSupabaseUser, useSupabaseClient } from "#imports"; // Asegúrate de que estos composables estén disponibles

const roles = ["admin", "user", "moderator"] as const;
type Role = (typeof roles)[number];

export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useSupabaseUser();
  const client = useSupabaseClient();
  const userRole = useState<string | null>("userRole", () => null); // Estado global para el rol
  if (user.value) {
    try {
      const { data, error } = await client
        .from("profiles")
        .select("role")
        .eq("id", user.value.id)
        .single();

      const profile = data as { role: Role } | null;

      if (error) {
        console.error("Error fetching user profile:", error.message);
        userRole.value = null;
      } else if (profile && roles.includes(profile.role)) {
        console.log("Profile data fetched:", profile);
        userRole.value = profile.role;
      } else {
        console.warn("No valid role found for user.");
        userRole.value = "user";
      }
    } catch (e) {
      console.error("Exception fetching user profile:", e);
      userRole.value = null;
    }
  } else {
    // Usuario no autenticado
    console.log("User not logged in.");
    const userRole = useUserRole();
    userRole.value = null; // Limpia el rol si no hay usuario
  }

  console.log("Final userRole state:", userRole.value);
  // Al final del middleware, asegúrate de cargar el rol en el estado
  // ... resto del código del middleware ...
});
