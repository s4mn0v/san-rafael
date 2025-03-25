<template>
      <ClientOnly>
            <UButton icon="i-heroicons-arrow-left-start-on-rectangle-16-solid" color="black" variant="ghost"
                  aria-label="Theme" size="xl" class="p-3" title="Cerrar Sesi&oacute;n">
            </UButton>
            <template #fallback>
                  <div class="w-12 h-12" />
            </template>
      </ClientOnly>
</template>