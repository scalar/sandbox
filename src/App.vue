<script setup lang="ts">
import { ApiReference } from '@scalar/api-reference';
import MonacoEditor from './components/MonacoEditor.vue'
</script>

<template>
  <div class="app">
    <header class="header">
      <div class="logo">
        Play
      </div>
      <div class="actions">
        <button type="button">
          Share
        </button>
      </div>
    </header>
    <div class="layout">
      <div class="left">
        <MonacoEditor />
      </div>
      <div class="right">
        <ApiReference />
      </div>
    </div>
  </div>
</template>

<style scoped>
.app {
  font-family: var(--default-theme-font)
}
.header {
  height: 50px;
  border-bottom: 1px solid var(--default-theme-border-color);
  color: var(--default-theme-color-1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
}

.logo {
  font-size: var(--default-theme-small);
  font-weight: bold;
}
.layout {
  display: flex;
  flex-direction: row;
  height: calc(100vh - 50px);
}
.left {
  width: 50%;
  height: 100%;
  border-right: 1px solid var(--default-theme-border-color);
}
.right {
  width: 50%;
  height: 100%;
}
</style>

