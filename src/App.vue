<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Toaster, toast } from 'vue-sonner'

import ApiReference from './components/ApiReference.vue'
import DarkModeToggle from './components/DarkModeToggle.vue'
import FileDrop from './components/FileDrop.vue'
import GitHubLogo from './components/GithubLogo.vue'
import ModeToggleButton from './components/ModeToggleButton.vue'
import MonacoEditor from './components/MonacoEditor.vue'
import ScalarLogo from './components/ScalarLogo.vue'
import ShareButton from './components/ShareButton.vue'
import { useDarkMode } from './hooks/useDarkMode'

const isDark = useDarkMode()

const route = useRoute()
const router = useRouter()

const loading = ref<boolean>(false)

const editing = ref<boolean>(true)

const content = ref<string>(
  JSON.stringify(
    {
      openapi: '3.1.0',
      info: {
        title: 'Hello World',
        version: '1.0.0',
      },
      paths: {},
    },
    null,
    2,
  ),
)

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
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      parentId: storedContent.id ?? null,
      content: content.value,
    }),
    credentials: 'same-origin',
  })
    .then((res) => res.json())
    .then(async (data) => {
      const path = router.resolve({
        name: 'edit',
        params: { id: data.id },
      }).href

      // Delay the clipboard copy to avoid issues with the browser window focus.
      // @see https://github.com/scalar/scalar/issues/2739
      window.setTimeout(() => {
        copyToClipboard(window.location.origin + path)
      }, 100)

      contentChanged.value = false
      Object.assign(storedContent, data)

      router.replace({ name: 'edit', params: { id: data.id } })
    })
    .finally(() => {
      loading.value = false
    })
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    toast.success('Copied URL to clipboard.', {
      description: text,
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

watch(editing, (value) => {
  if (!route.params.id) {
    return
  }

  if (value) {
    router.replace({ name: 'edit', params: { id: route.params.id } })
  } else {
    router.replace({ name: 'preview', params: { id: route.params.id } })
  }
})

// Fetch content from the server
watch(
  () => route.params.id,
  (id) => {
    if (id) {
      fetch(`/api/share/${id}`, {
        credentials: 'same-origin',
      })
        .then((res) => res.json())
        .then((data) => {
          Object.assign(storedContent, data)
          content.value = data.content
        })
    }
  },
)

function handleDrop(text: string) {
  content.value = text
}

onMounted(() => {
  window.onbeforeunload = function () {
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
          <ScalarLogo />
          <div class="logo-text">Sandbox</div>
        </div>
        <div class="mode">
          <ModeToggleButton v-model="editing" />
        </div>
        <div class="actions">
          <DarkModeToggle />
          <a href="https://github.com/scalar/scalar">
            <GitHubLogo />
          </a>
          <ShareButton
            @click="share"
            :loading="loading" />
        </div>
      </header>
      <div class="layout">
        <div
          class="editor"
          v-if="editing">
          <MonacoEditor v-model="content" />
        </div>
        <div class="preview">
          <ApiReference
            :configuration="{ spec: { content }, darkMode: isDark }" />
        </div>
      </div>
    </div>
  </FileDrop>
</template>

<style scoped>
.app {
  font-family: var(--scalar-font);
}

.header {
  height: 50px;
  border-bottom: 1px solid var(--scalar-border-color);
  color: var(--scalar-color-1);
  display: flex;
  align-items: center;
  padding: 12px;
}

.header > * {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}

.header > :first-child {
  justify-content: start;
}

.header > :last-child {
  justify-content: end;
}

.actions {
  gap: 12px;
}

.mode a,
.mode button,
.actions a {
  text-decoration: none;
  color: var(--scalar-color-1);
  font-size: var(--scalar-small);
}

.mode a,
.mode button {
  font-size: var(--scalar-small);
  font-family: var(--scalar-font);
  border: none;
  background: var(--scalar-background-4);
  padding: 6px 12px;
  border-radius: var(--scalar-radius-lg);
  color: var(--scalar-color-1);
}

.logo {
  font-size: var(--scalar-small);
  font-weight: var(--scalar-bold);
  gap: 8px;
}

.layout {
  display: flex;
  height: calc(100vh - 50px);
  position: relative;
}

.layout > * {
  flex: 1;
  min-width: 0;
}

.layout > * + * {
  border-left: 1px solid var(--scalar-border-color);
}

.preview {
  overflow: auto;
  z-index: 0;
}

@media (max-width: 1000px) {
  .editor {
    position: absolute;
    inset: 0;
    z-index: 1;
  }
}
</style>
