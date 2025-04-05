<template>
  <div class="flex min-h-screen w-full bg-gray-50 dark:bg-gray-900 overflow-hidden">
    <!-- Form Container con animación de entrada -->
    <div class="flex w-full md:w-1/2 items-center justify-center p-6 md:p-10 animate-fade-in-right">
      <div class="w-full max-w-md space-y-6">
        <!-- Logo con animación -->
        <div class="animate-bounce-in">
          <img 
            src="/assets/css/logo.webp"  
            alt="Logo San Rafael" 
            class="h-24 w-auto mx-auto mb-4 transform hover:scale-105 transition-transform duration-300" 
          />
        </div>

        <!-- Contenido del formulario -->
        <div class="mt-8 space-y-6">
          <div class="animate-fade-in-up delay-100">
            <h2 class="text-3xl font-semibold text-gray-800 dark:text-white mb-2 text-center">
              Bienvenido de vuelta
            </h2>
            <p class="text-gray-500 dark:text-gray-400 text-center">
              Por favor ingresa tus credenciales para continuar
            </p>
          </div>

          <!-- Formulario con animaciones escalonadas -->
          <UForm :state="state" class="space-y-5" @submit="login">
            <div class="animate-fade-in-up delay-200">
              <UFormGroup label="Email" name="email">
                <UInput 
                  v-model="state.email" 
                  type="email" 
                  placeholder="ejemplo@email.com" 
                  icon="i-heroicons-envelope"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:shadow-md"
                  autocomplete="username"
                />
              </UFormGroup>
            </div>

            <div class="animate-fade-in-up delay-300">
              <UFormGroup label="Contraseña" name="password">
                <div class="relative">
                  <UInput 
                    v-model="state.password" 
                    :type="showPassword ? 'text' : 'password'" 
                    placeholder="Ingresa tu contraseña"
                    icon="i-heroicons-lock-closed"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:shadow-md"
                    autocomplete="current-password"
                  />
                  <button 
                    type="button" 
                    class="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
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
            </div>

            <div class="animate-fade-in-up delay-400">
              <div class="flex justify-between items-center">
                <label class="flex items-center space-x-2">
                  <UCheckbox v-model="rememberMe" class="hover:ring-2 hover:ring-blue-300 transition-all" />
                  <span class="text-sm text-gray-600 dark:text-gray-400">Recordar sesión</span>
                </label>
                
                <NuxtLink 
                  to="/forgot-password" 
                  class="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  
                </NuxtLink>
              </div>
            </div>

            <div class="animate-fade-in-up delay-500">
              <UButton 
                block 
                type="submit" 
                :loading="isLoading"
                class="mt-6 w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium rounded-lg transition-all transform hover:scale-[1.01] shadow-md hover:shadow-lg"
              >
                <span v-if="!isLoading">Ingresar</span>
              </UButton>
            </div>
          </UForm>
        </div>
      </div>
    </div>

    <!-- Sección de imagen con efecto parallax -->
    <div class="hidden md:flex md:w-1/2 h-screen relative overflow-hidden">
      <div class="parallax-bg h-full w-full">
        <img 
          src="/assets/img/orion.jpg" 
          alt="Imagen decorativa" 
          class="h-full w-full object-cover object-center transform scale-110"
        />
      </div>
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-black/30 backdrop-blur-sm flex items-center justify-center p-10 transition-all duration-500 hover:backdrop-blur-none">
        <div class="text-white text-center max-w-md animate-fade-in">
          <UIcon name="i-heroicons-rocket-launch" class="w-12 h-12 mx-auto mb-4 animate-pulse" />
          <h3 class="text-3xl font-bold mb-4">Explora nuevas posibilidades</h3>
          <p class="text-lg opacity-90">Descubre todo lo que nuestra plataforma tiene para ofrecerte</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
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
    
    // Animación de salida antes de redireccionar
    document.querySelector('.animate-fade-in-right').classList.add('animate-fade-out-left');
    await new Promise(resolve => setTimeout(resolve, 500));
    
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

// Efecto parallax
onMounted(() => {
  const parallaxBg = document.querySelector('.parallax-bg');
  if (parallaxBg) {
    window.addEventListener('scroll', () => {
      const scrollPosition = window.pageYOffset;
      parallaxBg.style.transform = `translateY(${scrollPosition * 0.3}px)`;
    });
  }
});
</script>

<style>
/* Animaciones personalizadas */
@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOutLeft {
  to {
    opacity: 0;
    transform: translateX(-20px);
  }
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.animate-fade-in-right {
  animation: fadeInRight 0.6s ease-out forwards;
}

.animate-fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
}

.animate-fade-out-left {
  animation: fadeOutLeft 0.5s ease-in forwards;
}

.animate-bounce-in {
  animation: bounceIn 0.8s ease-out forwards;
}

.delay-100 {
  animation-delay: 0.1s;
}

.delay-200 {
  animation-delay: 0.2s;
}

.delay-300 {
  animation-delay: 0.3s;
}

.delay-400 {
  animation-delay: 0.4s;
}

.delay-500 {
  animation-delay: 0.5s;
}

.parallax-bg {
  will-change: transform;
  transition: transform 0.1s ease-out;
}

/* Efecto de gradiente en el botón */
.hover\:from-blue-700:hover {
  --tw-gradient-from: #1d4ed8;
  --tw-gradient-to: rgba(29, 78, 216, 0);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.hover\:to-blue-600:hover {
  --tw-gradient-to: #2563eb;
}
  /* Ajustes para modo oscuro */
.dark .parallax-bg img {
  filter: brightness(0.8);
}

</style>