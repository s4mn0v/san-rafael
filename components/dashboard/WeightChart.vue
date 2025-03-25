<template>
    <canvas ref="chartCanvas"></canvas>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { Chart } from 'chart.js'
  
  const chartCanvas = ref(null)
  
  onMounted(() => {
    const ctx = chartCanvas.value.getContext('2d')
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril'], // Ejemplo de meses
        datasets: [
          {
            label: 'Incremento de Peso',
            data: [2, 4, 3, 5], // Datos de ejemplo
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    })
  })
  </script>
  
  <style scoped>
  canvas {
    max-width: 100%;
  }
  </style>
  