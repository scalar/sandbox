<script setup lang="ts">
import { Switch } from '@headlessui/vue'
import { computed } from 'vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
}>()

const model = computed<boolean>({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
</script>
<template>
  <Switch
    v-slot="{ checked }"
    v-model="model"
    as="template">
    <button
      class="toggle-group"
      :class="{ 'toggle-group-checked': !checked }"
      type="button">
      <span
        class="toggle-item"
        :class="{ 'toggle-item-active': checked }">
        Edit
      </span>
      <span
        class="toggle-item"
        :class="{ 'toggle-item-active': !checked }">
        Preview
      </span>
    </button>
  </Switch>
</template>
<style scoped>
.toggle-group {
  display: flex;
  position: relative;
  border-radius: var(--theme-radius, var(--scalar-radius));
}
.toggle-group:hover,
.toggle-group:focus-visible {
  background: var(--theme-background-3, var(--scalar-background-3));
}
.toggle-group:before {
  content: '';
  display: block;
  border-radius: var(--theme-radius, var(--scalar-radius));
  width: 50%;
  height: 100%;
  position: absolute;
  background: var(--theme-background-3, var(--scalar-background-3));
  transition: transform 0.2s ease-in-out;
  transform: translate3d(0%, 0, 0);
}
.toggle-group:hover:before,
.toggle-group:focus-visible:before {
  background: var(--theme-background-4, var(--scalar-background-4));
}
.toggle-group-checked:before {
  transform: translate3d(100%, 0, 0);
}

.toggle-item {
  flex: 1;
  font-size: var(--theme-font-size-4, var(--scalar-font-size-4));
  color: var(--theme-color-3, var(--scalar-color-3));
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  min-width: 74px;
  text-align: center;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
  position: relative;
}
@media screen and (max-width: 580px) {
  .toggle-item {
    min-width: 57px;
  }
}

.toggle-item-active {
  color: var(--theme-color-1, var(--scalar-color-1));
}
</style>
