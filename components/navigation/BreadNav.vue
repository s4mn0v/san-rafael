<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'
import { useRoute } from 'vue-router'

// Props
const props = defineProps<{
  items: BreadcrumbItem[]
}>()

const route = useRoute()

// Filtro de ítems visibles en el breadcrumb
const breadcrumbItems = computed(() =>
  props.items.filter(item => item.showInBreadcrumb !== false)
)

// Ítems posteriores a la ruta actual (como botones)
const currentIndex = computed(() =>
  props.items.findIndex(item => item.to === route.path)
)

// Ítems posteriores a la ruta actual
const nextItems = computed(() =>
  currentIndex.value !== -1 ? props.items.slice(currentIndex.value + 1) : []
)
</script>

<template>
  <div class="space-y-2 bg-[var(--color-custom-500)] dark:bg-[var(--color-custom-50)] p-4 rounded-xl mb-6">
    <!-- Breadcrumb (con ítems visibles) -->
    <UBreadcrumb :items="breadcrumbItems" :ui="{ link: 'hover:text-white dark:hover:text-[var(--color-custom-500)]' }" />

    <!-- Botones adicionales de navegación -->
    <div v-if="nextItems.length" class="flex flex-wrap gap-2 mt-4">
      <UButton
        v-for="item in nextItems"
        :key="item.to as string"
        :label="item.label"
        :icon="item.icon"
        :to="item.to"
        color="secondary"
        :ui="{ base: 'bg-[var(--color-custom-50)] text-[var(--color-custom-500) hover:bg-[var(--color-custom-100)]' }"
      />
    </div>
  </div>
</template>
