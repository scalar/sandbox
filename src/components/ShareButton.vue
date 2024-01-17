<script lang="ts" setup>
defineProps<{
  disabled?: boolean,
}>()

defineEmits<{
  (e: 'share'): void
}>()
</script>

<template>
  <button type="button" @click="$emit('share')" :disabled="disabled" class="button">
    Share
  </button>
</template>

<style scoped>
.button {
  background: var(--default-theme-background-3);
  font-weight: normal;
  border: none;
  font-family: var(--default-theme-font);
  font-size: var(--default-theme-small);
  padding: 6px 12px;
  border-radius: var(--default-theme-radius-lg);
}
</style>