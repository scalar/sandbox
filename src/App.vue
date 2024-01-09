<script setup lang="ts">
import { ApiReference } from '@scalar/api-reference';
import MonacoEditor from './components/MonacoEditor.vue'
import { ref, watch } from 'vue'

const content = ref<string>(JSON.stringify({
  'openapi': '3.1.0',
  'info': {
    'title': 'Hello World',
    'version': '1.0.0'
  },
  paths: {},
}, null, 2))

const contentChanged = ref<boolean>(true)

const share = () => {
  fetch('/api/share', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: '{}'
    // JSON.stringify({
    //   content: content.value
    // })
  }).then(res => res.json()).then(res => {
    console.log(res)
    contentChanged.value = true
    // window.location.href = `/play/${res.id}`
  })
}

watch(content, (value) => {
  contentChanged.value = true
  console.log('content changed', value)
})
</script>

<template>
  <div class="app">
    <header class="header">
      <div class="logo">
        Play
      </div>
      <div class="actions">
        <button type="button" @click="share" :disabled="!contentChanged">
          Share
        </button>
      </div>
    </header>
    <div class="layout">
      <div class="left">
        <MonacoEditor v-model="content" />
      </div>
      <div class="right">
        <ApiReference :configuration="{ spec: { content } }" />
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

