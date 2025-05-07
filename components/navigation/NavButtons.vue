<template>
  <!-- v-bind="$attrs" : Pasa automáticamente props y eventos no definidos (como color, size, @click) al botón -->
  <UButton
    class="gap-2 cursor-pointer hover:bg-[var(--color-custom-50)] hover:text-[var(--color-custom-500)] dark:hover:text-[var(--color-custom-50)] dark:hover:bg-[var(--color-custom-500)] w-full my-2" v-bind="$attrs">
    <UIcon :name="icon" class="size-6" />
    <span class="uppercase font-bold tracking-widest">{{ text }}</span>
  </UButton>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
})
</script>
