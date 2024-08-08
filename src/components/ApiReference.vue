<script lang="ts" setup>
import type {
  ReferenceConfiguration,
  ReferenceProps,
} from '@scalar/api-reference'
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
      console.info('Ready:', url)

      updateConfiguration()

      // reloadReferences()
    })
    .catch(() => {
      console.error('Failed:', url)
    })
})

// Update the configuration when it changes
watch(
  () => props.configuration,
  () => updateConfiguration,
)

// function reloadReferences() {
//   document.dispatchEvent(new Event('scalar:reload-references'))
// }

function updateConfiguration() {
  console.log('updateConfiguration')
  const event = new CustomEvent('scalar:update-references-config', {
    detail: {
      configuration: props.configuration,
    } satisfies ReferenceProps,
  })

  document.dispatchEvent(event)
}
</script>

<template>
  <div id="api-reference" />
</template>
