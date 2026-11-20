import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#00897b',
          'primary-darken-1': '#00695c',
          secondary: '#5c6bc0',
          accent: '#ff6f00',
          success: '#43a047',
          warning: '#fb8c00',
          error: '#e53935',
          info: '#039be5',
          background: '#f4f6f8',
          surface: '#ffffff',
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: '#26a69a',
          'primary-darken-1': '#00897b',
          secondary: '#7986cb',
          accent: '#ffb300',
          success: '#66bb6a',
          warning: '#ffa726',
          error: '#ef5350',
          info: '#29b6f6',
          background: '#121212',
          surface: '#1e1e1e',
        },
      },
    },
  },
})
