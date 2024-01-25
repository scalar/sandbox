<script setup lang="ts">
import { ApiReference } from '@scalar/api-reference';
import MonacoEditor from './components/MonacoEditor.vue'
import FileDrop from './components/FileDrop.vue'
import DarkModeToggle from './components/DarkModeToggle.vue'
import { ref, reactive, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import ShareButton from './components/ShareButton.vue'
import { Toaster, toast } from 'vue-sonner'
import { useDark } from '@vueuse/core'

const isDark = useDark()

const route = useRoute()
const router = useRouter()

const loading = ref<boolean>(false)

const editing = ref<boolean>(true)

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
  loading.value = true

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
  }).then(res => res.json()).then(async data => {
    contentChanged.value = false
    Object.assign(storedContent, data)
    router.replace({ name: 'edit', params: { id: data.id } })

    await nextTick()

    copyToClipboard(window.location.origin + route.fullPath)
  }).finally(() => {
    loading.value = false
  })
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    toast.success('Copied URL to clipboard.', {
      description: text
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

onMounted(() => {
  window.onbeforeunload = function() {
    if (contentChanged.value) {
      return false
    }
  }
})

onUnmounted(() => {
  window.onbeforeunload = null
})
</script>

<template>
  <Toaster theme="dark" />
  <FileDrop @drop="handleDrop">
    <div class="app">
      <header class="header">
        <div class="logo">
          <svg width="25" height="25" viewBox="0 0 593 593" xmlns="http://www.w3.org/2000/svg"><path d="M347 0c6 0 12 5 12 12v134l94-95c5-5 13-5 17 0l72 72c4 4 5 12 0 16v1l-95 94h134c7 0 12 5 12 12v101c0 7-5 12-12 12H447l95 94c4 5 5 13 0 17l-72 72c-4 4-12 5-16 0h-1l-94-95v134c0 7-5 12-12 12H246c-7 0-12-5-12-12v-70c0-22 9-43 24-59l130-130c14-14 14-37 0-51L259 142a84 84 0 0 1-25-59V12c0-7 5-12 12-12h101ZM138 52h1l219 219c14 14 14 37 0 51L139 542c-4 5-12 5-17 0l-71-70c-4-5-5-12 0-17l95-96H12c-7 0-12-5-12-12V246c0-7 5-12 12-12h134l-95-94c-4-5-4-12 0-17l71-71c4-5 12-5 16 0Z" fill="currentColor" fill-rule="evenodd"></path></svg>
          <div class="logo-text">
            Sandbox
          </div>
        </div>
        <div class="mode" v-if="route.params.id">
          <RouterLink v-if="route.name === 'preview'" :to="{ name: 'edit', params: { id: route.params.id } }">Edit</RouterLink>
          <RouterLink v-if="route.name === 'edit'" :to="{ name: 'preview', params: { id: route.params.id } }">Preview</RouterLink>
        </div>
        <div class="mode" v-else>
          <button type="button" v-if="!editing" @click="editing = true">Edit</button>
          <button type="button" v-if="editing" @click="editing = false">Preview</button>
        </div>
        <div class="actions">
          <DarkModeToggle />
          <a href="https://github.com/scalar/scalar">
            <!-- make the SVG 20px high-->
            <svg width="20" height="20" viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg" class="github-logo">
                <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
                    fill="currentColor" />
            </svg>
          </a>
          <ShareButton @click="share" :loading="loading" />
        </div>
      </header>
      <div class="layout">
        <div class="left" v-if="route.name !== 'preview' && (!route.params.id && editing)">
          <MonacoEditor v-model="content" />
        </div>
        <div class="right">
          <ApiReference :configuration="{ spec: { content }, darkMode: isDark }" />
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
  gap: 20px;
  align-items: center;
}

.mode a, .mode button, .actions a {
  text-decoration: none;
  color: var(--default-theme-color-1);
  font-size: var(--default-theme-small);
}

.mode a,
.mode button {
  font-size: var(--default-theme-small);
  font-family: var(--default-theme-font);
  border: none;
  background: var(--default-theme-background-4);
  padding: 6px 12px;
  border-radius: var(--default-theme-radius-lg);
  color: var(--default-theme-color-1);
}

.logo {
  font-size: var(--default-theme-small);
  font-weight: var(--default-theme-bold);
  display: flex;
  align-items: center;
  gap: 8px;
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

