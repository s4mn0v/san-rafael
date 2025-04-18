<template>
  <div class="max-w-2xl mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">Cuenta</h1>

    <UCard v-if="userData">
      <template #header>
        <div class="flex items-center gap-4">
          <!-- <UAvatar :text="userInitials" size="lg" /> -->
           <!-- Imagen aleatoria para el avatar -->
          <UAvatar src="https://picsum.photos/512/512?random" size="lg" />
          <div>
            <h2 class="text-xl font-semibold">{{ userData.name || 'Sin nombre' }}</h2>
            <p class="text-gray-600 dark:text-gray-300">{{ userData.email }}</p>
          </div>
        </div>
      </template>

      <div class="space-y-2">
        <p><strong class="font-medium">Rol:</strong> {{ userData.role || 'Sin rol asignado' }}</p>
        <p><strong class="font-medium">UID:</strong> <code class="text-sm">{{ userData.id }}</code></p>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'logged',
  middleware: 'role-guard'
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const userData = ref<any>(null)
const userInitials = computed(() => {
  if (!userData.value?.name) return '??'
  return userData.value.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
})

// Obtener datos del usuario y perfil
onMounted(async () => {
  if (!user.value) return

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role, name')
    .eq('id', user.value.id)
    .single<Profile>()

  if (error) {
    console.error("Error cargando perfil:", error.message)
    return
  }

  userData.value = {
    id: user.value.id,
    name: profile?.name,
    email: user.value.email,
    role: profile?.role,
  }
})

</script>