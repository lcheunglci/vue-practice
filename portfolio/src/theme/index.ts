import type { ThemeDefinition } from 'vuetify'

const light: ThemeDefinition = {
  dark: false,
  colors: {
    primary: '#0052CC',
    'primary-darken-1': '#003366',
    secondary: '#36B2C3',
    accent: '#FF4081',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107',
    background: '#F4F5F7',
    surface: '#FFFFFF',
  },
}

const dark: ThemeDefinition = {
  dark: true,
  colors: {
    primary: '#4D9FFF',
    'primary-darken-1': '#0052CC',
    secondary: '#36B2C3',
    accent: '#FF4081',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107',
    background: '#141414',
    surface: '#1E1E1E',
  },
}

export const themes = { light, dark }
