<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useDisplay, useTheme } from 'vuetify'

const drawer = ref(true)
const { mobile } = useDisplay()
const theme = useTheme()

// Initialise from localStorage so the saved preference wins on first paint
const isDark = ref(localStorage.getItem('theme') === 'dark')

watch(isDark, (val) => {
  theme.global.name.value = val ? 'dark' : 'light'
  localStorage.setItem('theme', val ? 'dark' : 'light')
}, { immediate: true })
</script>

<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" :mobile="mobile" temporary>
      <v-container class="pa-4 text-center">
        <v-avatar color="primary" size="64" class="mb-3">
          <span class="text-h4 font-weight-bold text-white">L</span>
        </v-avatar>
        <div class="text-h6 font-weight-bold">Your Name</div>
        <div class="text-body-2 text-medium-emphasis mb-4">Software Developer</div>

        <v-divider class="my-3" />

        <v-list nav density="compact" selectable>
          <v-list-item to="/" title="Home" value="home" prepend-icon="mdi-home" />
          <v-list-item to="/about" title="About" value="about" prepend-icon="mdi-account" />
          <v-list-item to="/projects" title="Projects" value="projects" prepend-icon="mdi-briefcase" />
          <v-list-item to="/contact" title="Contact" value="contact" prepend-icon="mdi-email" />
        </v-list>
      </v-container>
    </v-navigation-drawer>

    <v-app-bar color="primary" dark :elevation="2">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title class="font-weight-bold">Your Name</v-toolbar-title>
      <v-spacer />
      <v-btn-toggle v-model="isDark" density="comfortable" class="d-none d-sm-flex">
        <v-btn :value="false" icon="mdi-white-balance-sunny" size="small" />
        <v-btn :value="true" icon="mdi-moon-waning-crescent" size="small" />
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