<template>
  <div class="flex min-h-screen w-full overflow-hidden bg-[var(--color-m7)] dark:bg-[var(--color-m2)]">
    <!-- Form Container con animación de entrada -->
    <div class="animate-fade-in-right flex w-full items-center justify-center p-6 md:w-1/2 md:p-10">
      <div class="absolute top-4 right-4 z-50">
        <Theming />
      </div>
      <div class="w-full max-w-md space-y-6">
        <ClientOnly>
          <!-- Logo con animación -->
          <div class="animate-bounce-in">
            <!-- Imagen para el tema oscuro (se muestra si isDark es true) -->
            <img v-if="isDark" src="/assets/img/logo/logo-white.webp" alt="Logo San Rafael - Tema Oscuro"
              class="mx-auto h-70 w-auto transform transition-transform duration-300 hover:scale-105" />

            <!-- Imagen para el tema claro (se muestra si isDark es false) -->
            <img v-else src="/assets/img/logo/logo-black.webp" alt="Logo San Rafael - Tema Claro"
              class="mx-auto h-70 w-auto transform transition-transform duration-300 hover:scale-105 grayscale-100" />
          </div>
        </ClientOnly>

        <!-- Contenido del formulario -->
        <div class="mt-8 space-y-6">
          <div class="animate-fade-in-up delay-100">
            <h2 class="mb-2 text-center text-3xl font-semibold text-gray-800 dark:text-white">Bienvenido de vuelta</h2>
            <p class="text-center text-gray-500 dark:text-gray-400">Por favor ingresa tus credenciales para continuar
            </p>
          </div>

          <ClientOnly>
            <UForm :state="state" class="space-y-5" @submit="login">
              <div class="animate-fade-in-up delay-200">
                <UInput v-model="state.email" type="email" placeholder="ejemplo@email.com" icon="i-heroicons-envelope"
                  class="w-full rounded-lg" autocomplete="username" />
              </div>

              <div class="animate-fade-in-up delay-300">
                <UFormGroup label="Contraseña" name="password">
                  <div class="relative">
                    <UInput v-model="state.password" :type="showPassword ? 'text' : 'password'"
                      placeholder="Ingresa tu contraseña" icon="i-heroicons-lock-closed" class="w-full rounded-lg pr-10"
                      autocomplete="current-password" />
                    <button type="button"
                      class="absolute inset-y-0 right-2 flex cursor-pointer items-center text-gray-500 transition-colors dark:text-gray-300"
                      @click="showPassword = !showPassword" aria-label="Toggle password visibility">
                      <UIcon :name="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" class="h-5 w-5" />
                    </button>
                  </div>
                </UFormGroup>
              </div>

              <div class="animate-fade-in-up delay-500">
                <UButton block type="submit" :loading="isLoading" >
                  <span v-if="!isLoading" class="uppercase tracking-widest font-bold">Ingresar</span>
                </UButton>
              </div>
            </UForm>
          </ClientOnly>
        </div>
      </div>
    </div>

    <!-- Sección de imagen con efecto parallax -->
    <div class="relative hidden h-screen overflow-hidden md:flex md:w-1/2">
      <div class="parallax-bg h-full w-full">
        <img src="/assets/img/login/orion.webp" alt="Imagen decorativa"
          class="h-full w-full scale-110 transform object-cover object-center grayscale" />
      </div>
      <div
        class="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 to-black/30 p-10 backdrop-blur-sm transition-all duration-500 hover:backdrop-blur-none">
        <div class="animate-fade-in max-w-md text-center text-white">
          <UIcon name="i-heroicons-rocket-launch" class="mx-auto mb-4 h-12 w-12 animate-pulse" />
          <h3 class="mb-4 text-3xl font-bold">Explora nuevas posibilidades</h3>
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
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

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
      color: 'warning',
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
      color: 'success'
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
      color: 'error'
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

/* Ajustes para modo oscuro */
.dark .parallax-bg img {
  filter: brightness(0.8);
}
</style>