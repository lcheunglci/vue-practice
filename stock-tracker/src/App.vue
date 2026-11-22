<script setup lang="ts">
import { computed, watch } from 'vue'
import { RouterView } from 'vue-router'
import { useTheme } from 'vuetify'

const THEME_KEY = 'stock-tracker-theme'

const theme = useTheme()

// Restore the saved theme, otherwise follow the OS preference.
if (typeof localStorage !== 'undefined') {
  const saved = localStorage.getItem(THEME_KEY)
  if (saved === 'light' || saved === 'dark') {
    theme.global.name.value = saved
  } else if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    theme.global.name.value = 'dark'
  }
}

const isDark = computed(() => theme.global.name.value === 'dark')

function toggleTheme() {
  theme.global.name.value = isDark.value ? 'light' : 'dark'
}

watch(
  () => theme.global.name.value,
  (name) => {
    try {
      localStorage.setItem(THEME_KEY, name)
    } catch {
      // Ignore storage failures (e.g. private mode).
    }
  },
)
</script>

<template>
  <v-app>
    <v-app-bar color="primary" flat>
      <v-app-bar-title>
        <v-icon class="mr-2">mdi-chart-line-variant</v-icon>
        Stock Tracker
      </v-app-bar-title>

      <v-spacer />

      <v-btn to="/" variant="text" prepend-icon="mdi-view-dashboard">Watchlist</v-btn>
      <v-btn to="/about" variant="text" prepend-icon="mdi-information">About</v-btn>
      <v-btn
        :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        variant="text"
        :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
        @click="toggleTheme"
      />
    </v-app-bar>

    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>
