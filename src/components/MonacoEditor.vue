<script setup lang="ts">
import * as monaco from 'monaco-editor'
import { onMounted, ref,  nextTick } from 'vue'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
import openApi31 from './openapi-3.1.json'

const monacoEditorRef = ref<HTMLElement>()

let editor: monaco.editor.IStandaloneCodeEditor | null = null

const jsonSchema = openApi31

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
        );
      }

      default: {
        return new Worker(
          new URL('monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url),
          { type: 'module' },
        );
      }
    }
  },
  }

  editor = monaco.editor.create(monacoEditorRef.value, {
    theme: 'vs-dark',
    minimap: { enabled: false },
    value: props.modelValue,
    language: 'json'
  })

  editor.onDidChangeModelContent(_ => {
    emit('update:modelValue', editor?.getValue())
  })

  // Set JSON schema for the editor
  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: [{
          uri: 'http://example.com/foobar-schema.json',
          fileMatch: ['*'],
          schema: jsonSchema
      }]
  });
}

onMounted(() => {
  init()
})
</script>

<template>
  <div ref="monacoEditorRef" class="editor"></div>
</template>

<style>
.editor {
  height: 100%;
}
</style>