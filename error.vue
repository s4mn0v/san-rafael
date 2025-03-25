<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError | undefined
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
    :style="{ backgroundImage: 'url(https://picsum.photos/1920/1080?random)' }">
    <div
      class="max-w-lg w-full text-center p-10 rounded-xl shadow-2xl backdrop-blur-lg bg-white/20 bg-opacity-10">
      <div class="text-8xl font-extrabold text-indigo-600 mb-4">{{ error?.statusCode || 'Oops!' }}</div>
      <h1 class="text-3xl font-bold text-gray-800 mb-4">Oops! Ocurrio un error</h1>
      <NuxtLink to="/"
        class="inline-block bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-md">
        Volver al inicio
      </NuxtLink>
    </div>
  </div>
</template>