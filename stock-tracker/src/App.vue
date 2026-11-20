<script setup lang="ts">
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import { useTheme } from 'vuetify'

const theme = useTheme()
const isDark = computed(() => theme.global.name.value === 'dark')

function toggleTheme() {
  theme.global.name.value = isDark.value ? 'light' : 'dark'
}
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
