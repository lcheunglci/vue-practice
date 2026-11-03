import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.min.css'

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
const savedTheme = localStorage.getItem('theme')
const initialTheme = savedTheme ? savedTheme : prefersDark ? 'dark' : 'light'

const vuetify = createVuetify({
  components,
  directives,
  icons: { defaultSet: 'mdi' },
  theme: { defaultTheme: initialTheme === 'dark' ? 'dark' : 'light' },
})

const app = createApp(App)
app.use(vuetify)
app.use(router)

app.mount('#app')