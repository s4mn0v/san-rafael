<template>
  <!-- Tittle Dashboard -->
  <h1 class="text-2xl font-semibold uppercase tracking-widest">Dashboard</h1>
  <br>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <DashboardCard title="Total de Animales" icon="i-healthicons-animal-cow">
      <div class="p-4 w-full bg-[var(--color-m7)] dark:bg-[var(--color-m2)] rounded-2xl">00</div>
    </DashboardCard>

    <DashboardCard title="Incremento de Peso (Mensual)" icon="i-healthicons-cardiogram-outline-24px">
      <div class="p-4 w-full bg-[var(--color-m7)] dark:bg-[var(--color-m2)] rounded-2xl">00</div>
    </DashboardCard>
  </div>

  <br>

  <DashboardCard title="Control de Inventario">
    <!-- Este div sigue siendo necesario para el layout flex horizontal y scroll -->
    <div class="flex flex-col sm:flex-row gap-6 w-full">
      <!-- Cada DashboardContainer se renderizará como un bloque separado -->
      <DashboardContainer title="Total Insumos" icon="i-healthicons-ui-menu-grid-outline" class="w-full">
        <div class="text-2xl font-semibold">00</div>
      </DashboardContainer>

      <DashboardContainer title="Stock Bajo" icon="i-heroicons-arrow-trending-down-16-solid" class="w-full">
        <div class="text-2xl font-semibold">00</div>
      </DashboardContainer>

      <DashboardContainer title="Gastos (30 D)" icon="i-heroicons-currency-dollar-20-solid" class="w-full">
        <div class="text-2xl font-semibold">$00</div>
      </DashboardContainer>
    </div>
  </DashboardCard>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'logged'
})
</script>