<template>
  <v-app class="h-screen">
    <v-app-bar app :color="themeColor" elevation="1">
      <v-toolbar-title :class="textColor">Reports Insight</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-navigation-drawer app permanent :color="themeColor" width="240">
      <v-list :class="drawerListClass">
        <v-list-item class="px-3 py-3">
          <v-list-item-title class="h5 mb-1" :class="textColor">Reports Insight</v-list-item-title>
          <v-list-item-subtitle class="small">Electron + Vue</v-list-item-subtitle>
        </v-list-item>

        <v-list-item to="/reports" exact append class="nav-link" active-class="active" exact-active-class="active">
          <v-list-item-title :class="navTextColor">All reports</v-list-item-title>
        </v-list-item>

        <v-list-item to="/export" exact append class="nav-link" active-class="active">
          <v-list-item-title :class="navTextColor">Export</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="pa-4 overflow-auto" style="margin-left: 240px; padding-top: 96px">
      <RouterView />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useTheme } from 'vuetify'
import { computed, ref, onMounted } from 'vue'

const theme = useTheme()

// Use a local ref instead of relying on theme.global.current.value.dark
const isDark = ref(true)

const themeColor = computed(() => isDark.value ? 'dark' : 'white')

const textColor = computed(() => isDark.value ? 'text-white' : 'text-dark')

const drawerListClass = computed(() => isDark.value ? 'bg-dark' : 'bg-white')

const navTextColor = computed(() => isDark.value ? 'text-white' : 'text-dark')

function toggleTheme() {
  isDark.value = !isDark.value
  theme.change(isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  window.reportApi?.onToggleTheme?.(() => toggleTheme())
  window.reportApi?.logError?.('info', 'App initialized via Electron')
})
</script>