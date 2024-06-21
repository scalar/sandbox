<script setup lang="ts">
import * as monaco from 'monaco-editor'
import { nextTick, onMounted, ref, watch } from 'vue'

import { useDarkMode } from '../hooks/useDarkMode'
import OpenAPI30 from './openapi-3.0.json'
import OpenAPI31 from './openapi-3.1.json'
import Swagger20 from './swagger-2.0.json'

const isDark = useDarkMode()
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const monacoEditorRef = ref<HTMLElement>()
const openApiVersion = ref<'3.1' | '3.0' | '2.0' | null>('3.1')

let editor: monaco.editor.IStandaloneCodeEditor | null = null

async function init() {
  await nextTick()

  if (!monacoEditorRef.value) {
    return
  }

  self.MonacoEnvironment = {
    getWorker(_workerId: string, label: string): Worker {
      switch (label) {
        case 'json': {
          return new Worker(
            new URL(
              'monaco-editor/esm/vs/language/json/json.worker.js',
              import.meta.url,
            ),
            { type: 'module' },
          )
        }

        default: {
          return new Worker(
            new URL(
              'monaco-editor/esm/vs/editor/editor.worker.js',
              import.meta.url,
            ),
            { type: 'module' },
          )
        }
      }
    },
  }

  editor = monaco.editor.create(monacoEditorRef.value, {
    theme: isDark.value ? 'vs-dark' : 'vs',
    minimap: { enabled: false },
    overviewRulerLanes: 0,
    scrollbar: {
      useShadows: false,
      verticalScrollbarSize: 5,
    },
    scrollBeyondLastLine: false,
    guides: {
      indentation: false,
    },
    formatOnPaste: true,
    formatOnType: true,
    lineHeight: 20,
    renderLineHighlight: 'none',
    fontFamily: `'JetBrains Mono', monospace`,
    value: props.modelValue,
    language: 'json',
    automaticLayout: true,
  })

  editor.onDidChangeModelContent((_) => {
    const newValue = editor?.getValue()

    emit('update:modelValue', newValue)

    determineOpenApiVersion(newValue)

    // if YAML, set Monaco to use YAML
    // else use JSON syntax highlighting
    if (newValue?.startsWith('openapi:') || newValue?.startsWith('swagger:')) {
      monaco.editor.setModelLanguage(editor?.getModel()!, 'yaml')
    } else {
      monaco.editor.setModelLanguage(editor?.getModel()!, 'json')
    }
  })

  watch(
    () => props.modelValue,
    (value) => {
      if (editor?.getValue() !== value) {
        editor?.setValue(value)
      }
    },
  )

  watch(isDark, () => {
    editor?.updateOptions({
      theme: isDark.value ? 'vs-dark' : 'vs',
    })
  })

  const determineOpenApiVersion = (value?: string) => {
    try {
      const data = JSON.parse(value ?? '')

      if (data.swagger === '2.0') {
        openApiVersion.value = '2.0'
      } else if (data.openapi?.match(/^3\.0\.\d(-.+)?$/)) {
        openApiVersion.value = '3.0'
      } else {
        openApiVersion.value = '3.1'
      }
    } catch {
      openApiVersion.value = '3.1'

      return
    }
  }

  watch(
    openApiVersion,
    () => {
      const jsonSchema =
        openApiVersion.value === '2.0'
          ? {
              uri: 'http://swagger.io/v2/schema.json#',
              fileMatch: ['*'],
              schema: Swagger20,
            }
          : openApiVersion.value === '3.0'
            ? {
                uri: 'http://swagger.io/v2/schema.json#',
                fileMatch: ['*'],
                schema: OpenAPI30,
              }
            : {
                uri: 'http://swagger.io/v2/schema.json#',
                fileMatch: ['*'],
                schema: OpenAPI31,
              }

      // Set JSON schema for the editor
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        schemas: [jsonSchema],
      })
    },
    { immediate: true },
  )
}

onMounted(() => {
  init()
})
</script>

<template>
  <div
    ref="monacoEditorRef"
    class="editor"></div>
</template>

<style>
.editor {
  height: 100%;
}
</style>
