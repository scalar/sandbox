<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['drop'])

const drop = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()

  // If is text file, read the content of the dropped file
  const type = e.dataTransfer?.items[0].type
  const allowedTypes = [
    'text/plain',
    'application/json',
    'application/x-yaml',
    'text/yaml',
  ]

  if (type && allowedTypes.includes(type)) {
    const reader = new FileReader()

    reader.onload = function (event) {
      // @ts-ignore
      emit('drop', event.target.result)
    }

    reader.readAsText(
      // @ts-ignore
      e.dataTransfer?.items[0].getAsFile(),
    )
  }
}

const dragover = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()
}

onMounted(() => {
  document.addEventListener('drop', drop)
  document.addEventListener('dragover', dragover)
})

onUnmounted(() => {
  document.removeEventListener('drop', drop)
  document.removeEventListener('dragover', dragover)
})
</script>
<template>
  <slot />
</template>
