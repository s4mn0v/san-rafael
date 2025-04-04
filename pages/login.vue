<template>
  <div class="flex min-h-screen">
    <!-- Form Container -->
    <div class="flex w-full items-center justify-center p-8">
      <div class="w-full max-w-sm space-y-6">
        <!-- Logo/Welcome Message -->
        <h2 class="text-center text-3xl font-extrabold tracking-widest text-[var(--color-m2)] uppercase">
          Bienvenido
        </h2>

        <!-- Login Form -->
        <UForm :state="state" class="space-y-4" @submit="login">
          <!-- Email Input -->
          <UFormGroup label="Email" name="email">
            <UInput v-model="state.email" type="email" placeholder="Ingrese su email" class="font-sans" />
          </UFormGroup>

          <!-- Password Input with Toggle Visibility Button -->
          <UFormGroup label="Contraseña" name="password">
            <div class="relative">
              <UInput v-model="state.password" :type="showPassword ? 'text' : 'password'"
                placeholder="Ingrese su contraseña" class="pr-10 font-sans" />
              <!-- Button to Show/Hide Password -->
              <button type="button"
                class="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                @click="showPassword = !showPassword">
                <UIcon :name="showPassword ? 'i-heroicons-eye' : 'i-heroicons-eye-slash'" class="h-5 w-5" />
              </button>
            </div>
          </UFormGroup>

          <!-- Forgot Password Link -->
          <div class="flex justify-end text-sm">
            <a href="#" class="hover:underline">¿Contraseña perdida?</a>
          </div>

          <!-- Submit Button -->
          <UButton block type="submit" class="bg-[var(--color-m2)] tracking-widest text-[var(--color-m7)] uppercase">
            Ingresar
          </UButton>
        </UForm>

        <!-- Footer -->
        <p class="mt-auto text-center text-sm text-[var(--color-m5)] uppercase">
          © 2024 All Rights Reserved
        </p>
      </div>
    </div>

    <!-- Image Section - Hidden on Small Screens -->
    <div class="hidden h-screen w-4/5 p-4 md:flex">
      <img src="../assets/img/cow.webp" alt="Login Image" class="h-full w-full rounded-2xl object-cover grayscale" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useSupabaseClient, useRouter, useToast } from '#imports';

const supabase = useSupabaseClient();
const router = useRouter();
const toast = useToast();

const state = reactive({
  email: '',
  password: ''
});

const showPassword = ref(false);

const login = async () => {
  try {
    if (!state.email.trim() || !state.password.trim()) {
      toast.add({ title: 'Error', description: 'Todos los campos son obligatorios.', color: 'red' });
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: state.email.trim(),
      password: state.password.trim(),
    });

    if (error) throw error;

    toast.add({ title: 'Éxito', description: 'Inicio de sesión exitoso.', color: 'green' });
    router.push('/');
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error inesperado.';
    console.error('Error al iniciar sesión:', errorMessage);
    toast.add({ title: 'Error', description: errorMessage, color: 'red' });
  }
};

definePageMeta({
  layout: 'login',
  ssr: false
});
</script>

<style scoped></style>
