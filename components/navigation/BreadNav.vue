<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'
import type { DropdownMenuItem } from '@nuxt/ui'
import { useRoute } from 'vue-router'
import { ref, computed } from 'vue'

// Props
const props = defineProps<{ items: BreadcrumbItem[] }>()

const route = useRoute()

// Items para el breadcrumb
const breadcrumbItems = computed(() =>
  props.items.filter(item => item.showInBreadcrumb !== false)
)

// Índice de la ruta actual
const currentIndex = computed(() =>
  props.items.findIndex(item => item.to === route.path)
)

// Ítems posteriores a la ruta actual
const nextItemsRaw = computed(() =>
  currentIndex.value !== -1 ? props.items.slice(currentIndex.value + 1) : []
)

// Mapeamos a DropdownMenuItem
const dropdownItems = computed<DropdownMenuItem[]>(() =>
  nextItemsRaw.value.map(item => ({
    item: item.label,
    label: item.label,
    icon: item.icon ?? undefined,
    to: item.to,
    onSelect: (e: Event) => {
      // Evitamos el comportamiento por defecto si hace falta
      e.preventDefault()
    }
  }))
)
</script>

<template>
  <div class="space-y-2 bg-[var(--color-custom-500)] dark:bg-[var(--color-custom-50)] px-4 py-2 rounded-xl mb-6">
    <div class="flex items-center justify-between">
      <!-- Breadcrumb -->
      <UBreadcrumb
        :items="breadcrumbItems"
        :ui="{ link: 'hover:text-white dark:hover:text-[var(--color-custom-500)]' }"
      >
        <template #item-label="{ item, index }">
          <span :class="index === breadcrumbItems.length - 1 ? '' : 'hidden sm:inline'">
            {{ item.label }}
          </span>
        </template>
      </UBreadcrumb>

      <!-- Desplegable al lado derecho -->
      <UDropdownMenu
        v-if="dropdownItems.length"
        :items="dropdownItems"
        :content="{ align: 'end' }"
        :ui="{ content: 'w-48' }"
      >
        <!-- Botón que activa el menú -->
        <UButton
          label=""
          icon="i-lucide-menu"
        />
      </UDropdownMenu>
    </div>
  </div>
</template>
