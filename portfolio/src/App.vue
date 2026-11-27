<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDisplay, useTheme } from 'vuetify'

const STORAGE_KEY = 'theme'

type ThemeName = 'light' | 'dark'

function readStoredTheme(): ThemeName | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'dark' || value === 'light' ? value : null
  } catch {
    // localStorage can throw when storage is disabled (e.g. private mode)
    return null
  }
}

function preferredTheme(): ThemeName {
  const stored = readStoredTheme()
  if (stored) return stored
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return 'light'
}

const drawer = ref(true)
const { mobile } = useDisplay()
const theme = useTheme()

const isDark = ref(preferredTheme() === 'dark')

watch(
  isDark,
  (val) => {
    const name: ThemeName = val ? 'dark' : 'light'
    theme.change(name)
    try {
      localStorage.setItem(STORAGE_KEY, name)
    } catch {
      // Ignore storage errors; the theme still applies for this session
    }
  },
  { immediate: true },
)
</script>

<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" :temporary="mobile" :permanent="!mobile">
      <v-container class="pa-4 text-center">
        <v-avatar color="primary" size="64" class="mb-3">
          <v-icon icon="mdi-account" size="32" color="white" />
        </v-avatar>
        <div class="text-h6 font-weight-bold">Your Name</div>
        <div class="text-body-2 text-medium-emphasis mb-4">Software Developer</div>

        <v-divider class="my-3" />

        <v-list nav density="compact" selectable>
          <v-list-item to="/" title="Home" value="home" prepend-icon="mdi-home" @click="drawer = false" />
          <v-list-item to="/about" title="About" value="about" prepend-icon="mdi-account" @click="drawer = false" />
          <v-list-item to="/projects" title="Projects" value="projects" prepend-icon="mdi-briefcase" @click="drawer = false" />
          <v-list-item to="/contact" title="Contact" value="contact" prepend-icon="mdi-email" @click="drawer = false" />
        </v-list>
      </v-container>
    </v-navigation-drawer>

    <v-app-bar color="primary" dark :elevation="2">
      <v-app-bar-nav-icon
        aria-label="Toggle navigation menu"
        @click="drawer = !drawer"
      />
      <v-toolbar-title class="font-weight-bold">Your Name</v-toolbar-title>
      <v-spacer />
      <v-btn-toggle v-model="isDark" density="comfortable" class="d-flex">
        <v-btn
          :value="false"
          icon="mdi-white-balance-sunny"
          size="small"
          aria-label="Switch to light mode"
        />
        <v-btn
          :value="true"
          icon="mdi-moon-waning-crescent"
          size="small"
          aria-label="Switch to dark mode"
        />
      </v-btn-toggle>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <v-footer color="surface-variant" class="text-center">
      <div class="w-100 py-4 text-body-2 text-medium-emphasis">
        © {{ new Date().getFullYear() }} Your Name · Built with Vue 3 & Vuetify
      </div>
    </v-footer>
  </v-app>
</template>

<style scoped>
</style>