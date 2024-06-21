<script lang="ts" setup>
import { useToggle } from '@vueuse/core'

import { useDarkMode } from '../hooks/useDarkMode'

const isDark = useDarkMode()
const toggleDark = useToggle(isDark)
</script>
<template>
  <button
    type="button"
    @click="() => toggleDark()"
    class="darkmode-toggle">
    <template v-if="isDark">
      <svg
        width="20px"
        height="20px"
        viewBox="0 0 10 10"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M3.500 5.000 A1.500 1.500 0 1 0 6.500 5.000 A1.500 1.500 0 1 0 3.500 5.000 Z"
          fill="currentColor"
          stroke="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="0"></path>
        <path
          d="M5,2.25a.625.625,0,0,1-.625-.625v-1a.625.625,0,0,1,1.25,0v1A.625.625,0,0,1,5,2.25Z"
          fill="currentColor"
          stroke="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="0"></path>
        <path
          d="M6.945,3.055a.623.623,0,0,1,0-.883l.707-.708a.625.625,0,0,1,.884.884l-.708.707A.623.623,0,0,1,6.945,3.055Z"
          fill="currentColor"
          stroke="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="0"></path>
        <path
          d="M7.75,5a.625.625,0,0,1,.625-.625h1a.625.625,0,0,1,0,1.25h-1A.625.625,0,0,1,7.75,5Z"
          fill="currentColor"
          stroke="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="0"></path>
        <path
          d="M6.945,6.945a.623.623,0,0,1,.883,0l.708.707a.625.625,0,0,1-.884.884l-.707-.708A.623.623,0,0,1,6.945,6.945Z"
          fill="currentColor"
          stroke="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="0"></path>
        <path
          d="M5,7.75a.625.625,0,0,1,.625.625v1a.625.625,0,0,1-1.25,0v-1A.625.625,0,0,1,5,7.75Z"
          fill="currentColor"
          stroke="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="0"></path>
        <path
          d="M3.055,6.945a.623.623,0,0,1,0,.883l-.707.708a.625.625,0,0,1-.884-.884l.708-.707A.623.623,0,0,1,3.055,6.945Z"
          fill="currentColor"
          stroke="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="0"></path>
        <path
          d="M2.25,5a.625.625,0,0,1-.625.625h-1a.625.625,0,0,1,0-1.25h1A.625.625,0,0,1,2.25,5Z"
          fill="currentColor"
          stroke="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="0"></path>
        <path
          d="M3.055,3.055a.623.623,0,0,1-.883,0l-.708-.707a.625.625,0,0,1,.884-.884l.707.708A.623.623,0,0,1,3.055,3.055Z"
          fill="currentColor"
          stroke="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="0"></path>
      </svg>
    </template>
    <template v-else>
      <svg
        width="20px"
        height="20px"
        viewBox="0 0 10 10"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M9.557,7.243A.456.456,0,0,0,9.1,6.991C9.023,7,8.951,7,8.877,7A4,4,0,0,1,5.546.781.5.5,0,0,0,5.564.256.476.476,0,0,0,5.1,0,5,5,0,1,0,9.539,7.767.5.5,0,0,0,9.557,7.243Z"
          fill="currentColor"
          stroke="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="0"></path>
      </svg>
    </template>
  </button>
</template>

<style scoped>
.darkmode-toggle {
  color: var(--scalar-color-1);
  cursor: pointer;
  font-family: var(--scalar-font);
  font-size: var(--scalar-small);
  border-radius: var(--scalar-radius-lg);
}
</style>
