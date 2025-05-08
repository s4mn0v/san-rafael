<template>
  <div class="h-screen flex items-center justify-center overflow-hidden">
    <!-- <h1 class="text-3xl font-bold mb-6">Cuenta</h1> -->
    <div class="w-full max-w-sm sm:max-w-2xl mx-4 sm:mx-auto">
      <UCard v-if="userData">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <UAvatar :src="avatarUrl" size="lg" />
              <div class="flex flex-col space-y-2">
                <!-- Mostrar nombre o input de edición -->
                <h2 v-if="!isEditing" class="text-xl font-semibold">{{ userData.name || 'Sin nombre' }}</h2>
                <UInput v-else v-model="editableUserData.name" placeholder="Nombre completo" size="xl"
                  class="font-semibold" />

                <!-- Mostrar correo o input de edición -->
                <p v-if="!isEditing" class="text-[var(--color-m5)] dark:text-[var(--color-m2)]">{{ userData.email }}</p>
                <UInput v-else v-model="editableUserData.email" type="email" placeholder="Correo electrónico" />
              </div>
            </div>
            <!-- Botón de Editar / Cancelar -->
            <UButton :icon="isEditing ? 'i-heroicons-x-mark' : 'i-heroicons-pencil-square'" size="sm" square
              @click="toggleEdit" :aria-label="isEditing ? 'Cancelar edición' : 'Editar perfil'" />
          </div>
        </template>

        <!-- Información no editable -->
        <div class="space-y-2 mb-4">
          <p><strong class="font-medium">Rol:</strong> {{ userData.role || 'Sin rol asignado' }}</p>
          <p><strong class="font-medium">UID:</strong> <span class="text-sm font-mono">{{ userData.id }}</span></p>
        </div>

        <!-- Formulario de edición (se muestra solo al editar) -->
        <UForm v-if="isEditing" :state="editableUserData" @submit="saveChanges">
          <!-- Ya hemos puesto los inputs en el header para un mejor diseño -->
          <div class="flex justify-end gap-3 mt-4">
            <UButton label="Cancelar" color="error" variant="ghost" @click="cancelEdit" :disabled="loading" />
            <UButton type="submit" label="Guardar Cambios" :loading="loading" :disabled="!hasChanges" />
          </div>
          <p v-if="emailChangeRequiresConfirmation" class="text-sm text-yellow-600 dark:text-yellow-400 mt-3">
            Se ha enviado un correo de confirmación a la nueva dirección. El cambio será efectivo después de la
            confirmación.
          </p>
        </UForm>

      </UCard>
      <USkeleton v-else class="h-48 w-full" />

      <UCard class="mt-6 block md:hidden bg-[var(--color-custom-500)] dark:bg-[var(--color-custom-50)]">
        <h2 class="text-lg font-semibold my-2 text-[var(--color-custom-50)] dark:text-[var(--color-custom-500)]">Cambio de tema</h2>
        <ThemingText />
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
// Import Database and Profile type correctly
import type { Database } from '~/types/supabase';
type Profile = Database['public']['Tables']['profiles']['Row']; // Explicitly define Profile based on Row

definePageMeta({
  layout: 'logged',
})

// Define the type for the Supabase client using the Database generic
const supabase = useSupabaseClient<Database>() // Ensure client is typed
const user = useSupabaseUser()
const toast = useToast() // Para mostrar notificaciones

// Keep the combined type for display purposes if email isn't always in Profile Row
// Alternatively, ensure 'email' is always part of the Profile Row type in supabase.ts
const userData = ref<(Profile & { email?: string }) | null>(null);
const isEditing = ref(false)
const loading = ref(false)
// Use more specific typing if possible, otherwise keep as is for simplicity
const editableUserData = ref({ name: '', email: '' })
const emailChangeRequiresConfirmation = ref(false)

// URL de avatar aleatoria (como en tu código original)
const avatarUrl = "https://picsum.photos/512/512?random";

// Computada para detectar si hay cambios
const hasChanges = computed(() => {
  if (!userData.value) return false;
  // Use optional chaining for safety if userData.value might be null transiently
  return editableUserData.value.name !== (userData.value?.name || '') ||
    editableUserData.value.email !== (userData.value?.email || '');
});

// --- Funciones ---

// Obtener datos del usuario y perfil
const fetchUserData = async () => {
  if (!user.value) return;
  loading.value = true;
  emailChangeRequiresConfirmation.value = false;

  try {
    // Select necessary fields from profiles
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role, name') // Select only what's needed from profiles table
      .eq('id', user.value.id)
      .maybeSingle(); // Use maybeSingle if a profile might not exist yet

    if (profileError) throw profileError;

    // Combine Supabase Auth user data with profile data
    userData.value = {
      id: user.value.id,
      // Use ?? operator for defaults
      name: profileData?.name ?? '',
      email: user.value.email ?? '', // Email comes from auth user
      role: profileData?.role ?? 'Sin rol asignado',
    };

    // Initialize editable data
    editableUserData.value = {
      name: userData.value.name,
      email: userData.value.email,
    };

  } catch (error: any) {
    console.error("Error cargando perfil:", error.message);
    toast.add({ title: 'Error', description: 'No se pudo cargar la información del perfil.', color: 'error' });
    userData.value = null;
  } finally {
    loading.value = false;
  }
};

// Alternar modo edición
const toggleEdit = () => {
  if (isEditing.value) {
    cancelEdit();
  } else {
    isEditing.value = true;
    if (userData.value) {
      // Ensure editable data is synced when starting edit
      editableUserData.value = {
        name: userData.value.name,
        email: userData.value.email ?? '',
      };
    }
    emailChangeRequiresConfirmation.value = false;
  }
};

// Cancelar edición
const cancelEdit = () => {
  isEditing.value = false;
  emailChangeRequiresConfirmation.value = false;
  // Restore original values if changes were made
  if (userData.value) {
    editableUserData.value = {
      name: userData.value.name,
      email: userData.value.email ?? '',
    };
  }
};

// Guardar cambios
const saveChanges = async () => {
  if (!user.value || !userData.value || !hasChanges.value) return;

  loading.value = true;
  emailChangeRequiresConfirmation.value = false;

  // Define the update payload with the correct Supabase Update type
  // Ensure `name` is optional in the Update type in supabase.ts
  const profileUpdates: Database['public']['Tables']['profiles']['Update'] = {};

  try {
    const userId = user.value.id;
    const originalEmail = userData.value.email;
    const newEmail = editableUserData.value.email.trim(); // Trim whitespace
    const newName = editableUserData.value.name.trim();   // Trim whitespace
    const originalName = userData.value.name;

    let emailUpdateError: Error | null = null;
    let needsEmailConfirmation = false;

    // --- Handle Email Update (Auth) ---
    if (newEmail && newEmail !== originalEmail) {
      const { error } = await supabase.auth.updateUser(
        { email: newEmail },
        // Optionally add emailRedirectTo for confirmation link
        // { emailRedirectTo: window.location.origin + '/confirm-email' }
      );
      if (error) {
        emailUpdateError = error;
      } else {
        // If Supabase requires confirmation for email changes (default),
        // the email won't be updated immediately in user.value.email.
        // Set a flag to inform the user.
        // The actual email in the 'profiles' table might be updated later
        // via a trigger or webhook once confirmed, or you might choose *not*
        // to store email redundantly in 'profiles'.
        needsEmailConfirmation = true;
        toast.add({
          title: 'Confirmación requerida',
          description: 'Se ha enviado un correo para confirmar la nueva dirección.',
          color: 'info',
        });
        emailChangeRequiresConfirmation.value = true; // Show message in template
        // Decide if you still want to update the email in the 'profiles' table now
        // or wait for confirmation. If you don't store email in profiles, skip this.
        // profileUpdates.email = newEmail; // << Remove if email is not in profiles.Update
      }
    }

    if (emailUpdateError) {
      toast.add({
        title: 'Error al actualizar email',
        description: emailUpdateError.message,
        color: 'error'
      });
      // Decide if you want to stop the whole process or continue with name update
      // For now, we stop.
      loading.value = false;
      return;
    }

    // --- Handle Name Update (Profiles Table) ---
    if (newName !== originalName) {
      profileUpdates.name = newName; // Add name to the update payload
    }

    // --- Execute Profile Update ---
    if (Object.keys(profileUpdates).length > 0) {
      // **FIXED**: Remove the incorrect generic <Profile>
      const { error: profileError } = await supabase
        .from('profiles') // Use only the table name string
        .update(profileUpdates) // Pass the correctly typed payload
        .eq('id', userId);      // .eq() types will be inferred correctly

      if (profileError) {
        // Throw error to be caught by the main catch block
        throw new Error(`Error al actualizar perfil: ${profileError.message}`);
      }
    }

    // --- Success ---
    // Only show general success if *something* was attempted (email or profile)
    if (needsEmailConfirmation || Object.keys(profileUpdates).length > 0) {
      toast.add({
        title: 'Éxito',
        description: 'Perfil actualizado. ' + (needsEmailConfirmation ? 'Confirma tu nuevo email.' : ''),
        color: 'success'
      });
    }


    // --- Update Local State (Reflect Changes) ---
    if (userData.value) { // Check if userData still exists
      if (profileUpdates.name !== undefined) {
        userData.value.name = profileUpdates.name;
      }
      // **Important**: Don't update userData.value.email immediately if confirmation is needed.
      // Supabase Auth user object (user.value) might update automatically *after* confirmation.
      // You might need to re-fetch user data or rely on auth state changes later.
      // For now, we only update the name locally.
    }


    isEditing.value = false; // Exit editing mode on success

  } catch (error: any) {
    console.error("Error guardando cambios:", error);
    toast.add({
      title: 'Error al guardar',
      description: error.message || 'No se pudo guardar los cambios.',
      color: 'error'
    });
  } finally {
    loading.value = false;
  }
};


// --- Ciclo de vida ---
onMounted(() => {
  fetchUserData();
});

// Observa cambios en el usuario de Supabase (login/logout)
watch(user, (newUser, oldUser) => {
  // Re-fetch data on user change (login/logout/token refresh potentially)
  // Consider if you need finer control (e.g., only fetch if ID differs)
  if (newUser) {
    fetchUserData();
  } else {
    // Clear data on logout
    userData.value = null;
    isEditing.value = false;
    emailChangeRequiresConfirmation.value = false;
  }
}, { immediate: false }); // 'immediate: true' might cause issues if user isn't ready initially

</script>
