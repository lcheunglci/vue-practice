import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'

import App from './App.vue'
import router from './router'

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#00897b',
          secondary: '#5c6bc0',
          accent: '#ff6f00',
          success: '#43a047',
          warning: '#fb8c00',
          error: '#e53935',
          info: '#039be5',
        },
      },
      dark: {
        colors: {
          primary: '#26a69a',
          secondary: '#7986cb',
          accent: '#ffb300',
          success: '#66bb6a',
          warning: '#ffa726',
          error: '#ef5350',
          info: '#29b6f6',
        },
      },
    },
  },
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')