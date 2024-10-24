<script lang="ts" setup>
import type { ReferenceConfiguration } from '@scalar/types'
import { onMounted, watch } from 'vue'
import { loadScript } from 'vue-plugin-load-script'

const props = defineProps<{
  configuration?: ReferenceConfiguration
}>()

onMounted(() => {
  /** Version in the URL (optional) */
  const [version] = window.location.pathname.match(/@([\d.]+)/) ?? []

  /** CDN URL */
  const url = [
    'https://cdn.jsdelivr.net/npm/@scalar/api-reference',
    version ?? '',
  ].join('')

  // Load the script
  loadScript(url)
    .then(() => {
      console.info('CDN:', url)
      updateConfiguration()
    })
    .catch(() => {
      console.error('Failed to load:', url)
    })
})

// Update the configuration when it changes
watch(
  () => props.configuration,
  () => {
    updateConfiguration()
  },
)

function updateConfiguration() {
  document.dispatchEvent(
    new CustomEvent('scalar:update-references-config', {
      detail: {
        configuration: props.configuration,
      },
    }),
  )
}
</script>

<template>
  <div id="api-reference" />
</template>
