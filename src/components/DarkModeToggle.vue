<script lang="ts" setup>
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <button type="button" @click="() => toggleDark()" class="button">
    <template v-if="isDark">
      Light Mode
    </template>
    <template v-else>
      Dark Mode
    </template>
  </button>
</template>

<style scoped>
.button {
  background: none;
  padding: 0;
  color: var(--default-theme-color-3);
  font-weight: normal;
  border: none;
  font-family: var(--default-theme-font);
  font-size: var(--default-theme-small);
  border-radius: var(--default-theme-radius-lg);
}
</style>