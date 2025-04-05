<template>
  <div class="flex min-h-screen w-full bg-gray-50 dark:bg-gray-900">
    
    <!-- Form Container -->
    <div class="flex w-full md:w-1/2 items-center justify-center p-6 md:p-10">
      <div class="w-full max-w-md space-y-6">
        <img 
            src="/assets/css/logo.webp"  
            alt="Logo San Rafael" 
            class="h-21 w-auto mb-4"  
          />


        <!-- Contenido del formulario -->
        <div class="mt-8">
          <h2 class="text-3xl font-semibold text-gray-800 dark:text-white mb-2">
            Bienvenido de vuelta
          </h2>
          <p class="text-gray-500 dark:text-gray-400 mb-8">
            Por favor ingresa tus credenciales para continuar
          </p>

          <!-- Formulario -->
          <UForm :state="state" class="space-y-5" @submit="login">
            <UFormGroup label="Email" name="email">
              <UInput 
                v-model="state.email" 
                type="email" 
                placeholder="ejemplo@email.com" 
                icon="i-heroicons-envelope"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                autocomplete="username"
              />
            </UFormGroup>

            <UFormGroup label="Contraseña" name="password">
              <div class="relative">
                <UInput 
                  v-model="state.password" 
                  :type="showPassword ? 'text' : 'password'" 
                  placeholder="Ingresa tu contraseña"
                  icon="i-heroicons-lock-closed"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  autocomplete="current-password"
                />
                <button 
                  type="button" 
                  class="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  @click="showPassword = !showPassword"
                  aria-label="Toggle password visibility"
                >
                  <UIcon 
                    :name="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" 
                    class="w-5 h-5" 
                  />
                </button>
              </div>
            </UFormGroup>

            <div class="flex justify-between items-center">
              <label class="flex items-center space-x-2">
                <UCheckbox v-model="rememberMe" />
                <span class="text-sm text-gray-600 dark:text-gray-400">Recordar sesión</span>
              </label>
              
              <NuxtLink 
                to="/forgot-password" 
                class="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                ¿Olvidaste tu contraseña?
              </NuxtLink>
            </div>

            <UButton 
              block 
              type="submit" 
              :loading="isLoading"
              class="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <span v-if="!isLoading">Ingresar</span>
            </UButton>
          </UForm>
        </div>
      </div>
    </div>

    <!-- Sección de imagen -->
    <div class="hidden md:flex md:w-1/2 h-screen relative overflow-hidden">
      <img 
        src="/assets/img/orion.jpg" 
        alt="Imagen decorativa" 
        class="h-full w-full object-cover object-center"
      />
      <div class="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-10">
        <div class="text-white text-center max-w-md">
          <UIcon name="i-heroicons-rocket-launch" class="w-12 h-12 mx-auto mb-4" />
          <h3 class="text-3xl font-bold mb-4">Explora nuevas posibilidades</h3>
          <p class="text-lg opacity-90">Descubre todo lo que nuestra plataforma tiene para ofrecerte</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useSupabaseClient, useRouter } from '#imports';

const supabase = useSupabaseClient();
const router = useRouter();
const isLoading = ref(false);
const showPassword = ref(false);
const rememberMe = ref(false);

const state = reactive({
  email: '',
  password: ''
});

const login = async () => {
  if (!state.email || !state.password) {
    useToast().add({ 
      title: 'Campos requeridos', 
      description: 'Por favor completa todos los campos', 
      icon: 'i-heroicons-exclamation-circle',
      color: 'amber'
    });
    return;
  }

  try {
    isLoading.value = true;
    const { error } = await supabase.auth.signInWithPassword({ 
      email: state.email, 
      password: state.password 
    });
    
    if (error) throw error;
    
    useToast().add({ 
      title: '¡Bienvenido!', 
      description: 'Has iniciado sesión correctamente', 
      icon: 'i-heroicons-check-circle',
      color: 'emerald'
    });
    
    router.push('/');
  } catch (err) {
    let message = 'Error al iniciar sesión';
    if (err.message.includes('Invalid login credentials')) {
      message = 'Email o contraseña incorrectos';
    }
    
    useToast().add({ 
      title: 'Error', 
      description: message, 
      icon: 'i-heroicons-exclamation-circle',
      color: 'red'
    });
  } finally {
    isLoading.value = false;
  }
};
</script>