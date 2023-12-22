<script setup lang="ts">
import * as monaco from 'monaco-editor'
import { onMounted, ref,  nextTick } from 'vue'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const monacoEditorRef = ref<HTMLElement>()

let editor: monaco.editor.IStandaloneCodeEditor | null = null

async function init() {
  await nextTick()

  if (!monacoEditorRef.value) {
    return
  }

  self.MonacoEnvironment = {
    getWorker: function (workerId, label) {
      const getWorkerModule = (moduleUrl, label) => {
        return new Worker(self.MonacoEnvironment.getWorkerUrl(moduleUrl), {
          name: label,
          type: 'module'
        });
      };

      switch (label) {
        case 'json':
          return getWorkerModule('/monaco-editor/esm/vs/language/json/json.worker?worker', label);
        case 'javascript':
          return getWorkerModule('/monaco-editor/esm/vs/language/typescript/ts.worker?worker', label);
        default:
          return getWorkerModule('/monaco-editor/esm/vs/editor/editor.worker?worker', label);
      }
    }
  };


  editor = monaco.editor.create(monacoEditorRef.value, {
    theme: 'vs-dark',
    minimap: { enabled: false },
    value: props.modelValue,
    language: 'json'
  })

  editor.onDidChangeModelContent(_ => {
    console.log('change')
    emit('update:modelValue', editor?.getValue())
  })
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