import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'

const routes = [
  { path: '/', component: App },
  { path: '/e/:id', component: App, name: 'edit' },
  { path: '/p/:id', component: App, name: 'preview' },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
