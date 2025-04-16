<template>
  <h1 class="text-2xl font-semibold uppercase tracking-widest">Dashboard</h1>

  <div class="grid grid-cols-2 gap-4">
    <DashboardCard title="Total de Animales" icon="i-healthicons-animal-cow">
      <div class="px-6">00</div>
    </DashboardCard>

    <DashboardCard title="Incremento de Peso (Mensual)" icon="i-healthicons-cardiogram-outline-24px">
      <div class="px-6">00</div>
    </DashboardCard>
  </div>

  <DashboardCard title="Control de Inventario">
    <div class="grid grid-cols-3 gap-6 content-container">
      <DashboardContainer title="Total de Insumos" icon="i-healthicons-ui-menu-grid-outline">
        <div class="text-2xl font-semibold">00</div>
      </DashboardContainer>

      <DashboardContainer title="Stock Bajo" icon="i-heroicons-arrow-trending-down-16-solid">
        <div class="text-2xl font-semibold">00</div>
      </DashboardContainer>

      <DashboardContainer title="Gastos (30 D)" icon="i-heroicons-currency-dollar-20-solid">
        <div class="text-2xl font-semibold">$00</div>
      </DashboardContainer>
    </div>
  </DashboardCard>
  
  <UButton color>Button</UButton>
</template>

<script setup lang="ts">
import { UButton } from '#components';

definePageMeta({
  layout: 'logged'
})
</script>