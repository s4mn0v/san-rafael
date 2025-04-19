<!-- components/VueFlowTree.vue -->
<template>
  <div class="vue-flow-container h-[500px] w-full border rounded-lg bg-gray-50 dark:bg-gray-800">
    <VueFlow 
      v-model:nodes="nodes"
      v-model:edges="edges"
      :fit-view-on-init="true"
      :max-zoom="1.5"
      :min-zoom="0.5"
      :node-drag-threshold="0"
    >
      <Background :gap="35" :size="1" pattern-color="var(--color-gray-300)" />
      <Controls />
    </VueFlow>
  </div>
</template>

<script setup lang="ts">
import { VueFlow } from '@vue-flow/core'
import { Background, Controls } from '@vue-flow/additional-components'
import type { Node, Edge } from '@vue-flow/core'

const props = defineProps<{
  treeData: any
}>()

const nodes = ref<Node[]>([])
const edges = ref<Edge[]>([])

const positionCache = new Map()

const buildTree = (node: any, x: number = 0, y: number = 0, isMain: boolean = false) => {
  if (!node) return

  const verticalSpacing = 300
  const horizontalSpacing = 100

  const currentNode: Node = {
    id: node.id,
    label: `${node.id} | ${node.raza} | ${node.tipo_animal}`,
    position: { x, y },
    data: node,
    connectable: false
  }

  nodes.value.push(currentNode)
  positionCache.set(node.id, { x, y })

  if (node.madre) {
    const madreX = x - horizontalSpacing
    const madreY = y - verticalSpacing
    edges.value.push({
      id: `${node.madre.id}-${node.id}`,
      source: node.madre.id,
      target: node.id,
      label: 'Madre',
      labelBgPadding: [8, 4],
    })
    buildTree(node.madre, madreX, madreY)
  }

  if (node.padre) {
    const padreX = x + horizontalSpacing
    const padreY = y - verticalSpacing
    edges.value.push({
      id: `${node.padre.id}-${node.id}`,
      source: node.padre.id,
      target: node.id,
      label: 'Padre',
      labelBgPadding: [8, 4],
    })
    buildTree(node.padre, padreX, padreY)
  }
}

watch(() => props.treeData, (newVal) => {
  if (newVal) {
    nodes.value = []
    edges.value = []
    buildTree(newVal, 500, 50)
  }
}, { immediate: true })
</script>