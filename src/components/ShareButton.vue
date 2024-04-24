<script lang="ts" setup>
withDefaults(
  defineProps<{
    loading?: boolean
  }>(),
  {
    loading: false,
  },
)

defineEmits<{
  (e: 'share'): void
}>()
</script>

<template>
  <button
    type="button"
    @click="$emit('share')"
    :disabled="loading"
    class="button">
    Share
  </button>
</template>

<style scoped>
.button {
  background: var(--scalar-background-3);
  font-weight: normal;
  border: none;
  font-family: var(--scalar-font);
  font-size: var(--scalar-small);
  padding: 6px 12px;
  border-radius: var(--scalar-radius-lg);
  transition: all 0.5s ease-in-out;
}

.button[disabled] {
  color: var(--scalar-color-3);
}
</style>
