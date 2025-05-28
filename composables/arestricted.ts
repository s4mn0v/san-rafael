// composables/useUserRole.ts
import { ref, onMounted } from "vue";
import { useSupabaseClient, useSupabaseUser } from "#imports";

export const useUserRole = () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const userRole = ref<string | null>(null);

  onMounted(async () => {
    if (user.value) {
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.value.id)
        .single();

      const profile = data as { role: string } | null;
      userRole.value = profile?.role ?? null;
    }
  });

  return {
    userRole,
  };
};
