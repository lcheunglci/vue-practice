import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { createVuetify } from 'vuetify'
import { themes } from '@/theme'

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'light',
    themes,
  },
})

const app = createApp(App)

app.config.errorHandler = (err, instance, info) => {
  console.error('[app error]', {
    error: err,
    info,
    component: instance?.$options?.name,
  })
}

window.addEventListener('unhandledrejection', (event) => {
  console.error('[unhandled rejection]', event.reason)
})

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')