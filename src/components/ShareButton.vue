<script lang="ts" setup>
defineProps<{
  disabled?: boolean,
}>()

defineEmits<{
  (e: 'share'): void
}>()
</script>

<template>
  <button type="button" @click="$emit('share')" :disabled="disabled">
    Share
  </button>
</template>