<script lang="ts" setup>
withDefaults(defineProps<{
  loading?: boolean,
}>(), {
  loading: false,
})

defineEmits<{
  (e: 'share'): void
}>()
</script>

<template>
  <button type="button" @click="$emit('share')" :disabled="loading" class="button">
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
  transition: all .5s ease-in-out;
}

.button[disabled] {
  color: var(--default-theme-color-3);
}
</style>