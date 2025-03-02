<template>
  <h1 class="text-2xl font-semibold uppercase tracking-widest">Dashboard</h1>
  
  <UDivider class="my-6"/>

  <div class="grid grid-cols-2 gap-4">
    <DashboardCard title="Total de Animales" icon="i-healthicons-animal-cow">
      <div class="px-6">00</div>
    </DashboardCard>

    <DashboardCard title="Incremento de Peso (Mensual)" icon="i-healthicons-animal-cow">
      <div class="px-6">00</div>
    </DashboardCard>
  </div>
  
  <UDivider class="my-6"/>

  <DashboardCard title="Control de Inventario" icon="i-healthicons-animal-cow">
    <div class="grid grid-cols-3 gap-4 content-container">
      <DashboardContainer title="Total de Insumos" icon="i-healthicons-animal-cow">
        <div class="text-2xl font-semibold">00</div>
      </DashboardContainer>

      <DashboardContainer title="Stock Bajo" icon="i-healthicons-animal-cow">
        <div class="text-2xl font-semibold">00</div>
      </DashboardContainer>

      <DashboardContainer title="Gastos Recientes" icon="i-healthicons-animal-cow">
        <div class="text-2xl font-semibold">$00</div>
      </DashboardContainer>
    </div>
  </DashboardCard>
</template>