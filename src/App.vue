<script setup lang="ts">
import { ApiReference } from '@scalar/api-reference';
import MonacoEditor from './components/MonacoEditor.vue'
import FileDrop from './components/FileDrop.vue'
import { ref, reactive, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import ShareButton from './components/ShareButton.vue'
import { Toaster, toast } from 'vue-sonner'

const route = useRoute()
const router = useRouter()

const content = ref<string>(JSON.stringify({
  'openapi': '3.1.0',
  'info': {
    'title': 'Hello World',
    'version': '1.0.0'
  },
  paths: {},
}, null, 2))

const contentChanged = ref<boolean>(false)

export type SpecObject = {
  id: number | null
  content: string
  createdAt: string
}

const storedContent = reactive<SpecObject>({
  id: null,
  content: '',
  createdAt: '',
})

// Store the content
const share = () => {
  // Nothing changed, just copy the URL.
  if (!contentChanged.value) {
    return copyToClipboard(window.location.href)
  }

  // Something changed, create a new URL.
  fetch('/api/share', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      parentId: storedContent.id ?? null,
      content: content.value
    }),
    credentials: 'same-origin'
  }).then(res => res.json()).then(data => {
    contentChanged.value = false
    router.replace({ name: 'edit', params: { id: data.id } })
    Object.assign(storedContent, data)

    copyToClipboard(window.location.href)
  })
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    toast.success('Copied URL to clipboard.', {
      description: window.location.href
    })
  })
}

// Mark content as 'dirty'
watch(content, (value) => {
  if (value !== storedContent.content) {
    contentChanged.value = true
  } else {
    contentChanged.value = false
  }
})

// Fetch content from the server
watch(() => route.params.id, (id) => {
  if (id) {
    fetch(`/api/share/${id}`, {
      credentials: 'same-origin'
    }).then(res => res.json()).then(data => {
      Object.assign(storedContent, data)
      content.value = data.content
    })
  }
})

function handleDrop(text: string) {
  content.value = text
}
</script>

<template>
  <Toaster theme="dark" />
  <FileDrop @drop="handleDrop">
    <div class="app">
      <header class="header">
        <div class="logo">
          Scalar Play
        </div>
        <div class="mode" v-if="route.params.id">
          <RouterLink v-if="route.name === 'preview'" :to="{ name: 'edit', params: { id: route.params.id } }">Edit</RouterLink>
          <RouterLink v-if="route.name === 'edit'" :to="{ name: 'preview', params: { id: route.params.id } }">Preview</RouterLink>
        </div>
        <div class="actions">
          <a href="https://github.com/scalar/scalar">
            GitHub
          </a>
          <ShareButton @click="share" />
        </div>
      </header>
      <div class="layout">
        <div class="left" v-if="route.name !== 'preview'">
          <MonacoEditor v-model="content" />
        </div>
        <div class="right">
          <ApiReference :configuration="{ spec: { content } }" />
        </div>
      </div>
    </div>
  </FileDrop>
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

.actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.mode a, .actions a {
  text-decoration: none;
  color: var(--default-theme-color-1);
  font-size: var(--default-theme-small);
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
  width: 100%;
  height: 100%;
}

.left+.right {
  width: 50%;
}
</style>

