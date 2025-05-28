import {
  defineNuxtRouteMiddleware,
  navigateTo,
  useSupabaseUser,
} from "#imports";

export default defineNuxtRouteMiddleware(async (to) => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  if (!user.value) {
    return navigateTo("/login");
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.value.id)
    .single();

  const profile = data as { role: string } | null;

  if (error || !profile) {
    return navigateTo("/error");
  }

  if (profile.role !== "admin") {
    return navigateTo("/");
  }
});
