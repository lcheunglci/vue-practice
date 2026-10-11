import { createApp } from 'vue'
import App from './App.vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VDateInput } from 'vuetify/labs/VDateInput'
import { createPinia } from 'pinia'

const pinia = createPinia()
const vuetify = createVuetify({
  components: {
    ...components,
    VDateInput,
  },
  directives,
  theme: {
    defaultTheme: 'light',
  },
})

const app = createApp(App)
app.use(pinia)
app.use(vuetify)

app.mount('#app')
