<template>
  <div class="flex h-screen w-screen items-center justify-center overflow-hidden">
    <div
      class="absolute top-4 right-4 z-[999] rounded-full bg-[var(--color-custom-500)] dark:bg-[var(--color-custom-50)]">
      <Theming />
    </div>
    <div class="max-w-2xl px-4 text-center">
      <UIcon name="i-heroicons-rocket-launch" class="mx-auto mb-4 h-12 w-12 animate-pulse" />
      <h1 class="mb-4 text-2xl font-bold uppercase">Hola Mundo</h1>

      <code
        class="block text-left text-sm/8 whitespace-pre-wrap">Entre líneas y teclas va mi día, bailando con el código y la lógica fría. Café en la mano, sueños en la mente, buscando errores que nadie ve, paciente. La vida del programador, sencilla y compleja, creando mundos donde la rutina no aqueja. Entre ceros y unos, mi arte escondido, escribo el futuro, bit a bit, sin ruido.</code>

      <div class="my-4 flex justify-center space-x-4">
        <UButton title="Juan Fonseca" label="JuanesB2F" to="https://github.com/juanesb2f" icon="i-lucide-github" />
        <UButton title="Samuel Novoa" label="S4M-N0V" to="https://github.com/s4mn0v" icon="i-lucide-github" />
      </div>
    </div>
  </div>
</template>
