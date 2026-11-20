<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import { VApp, VAppBar, VAppBarNavIcon, VAppBarTitle, VBtn, VIcon, VMain, 
  VNavigationDrawer, VSpacer, VToolbar, VContainer, VList, VListItem, 
  VListItemTitle
} from 'vuetify/components'

const drawer = ref(false)
const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
}
</script>

<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-app-bar-title>Stock Tracker</v-app-bar-title>
      <v-spacer />
      <v-toolbar-items>
        <v-btn variant="text" to="/">Watchlist</v-btn>
        <v-btn variant="text" to="/about">About</v-btn>
        <v-btn variant="text" @click="toggleTheme()">
          <v-icon start>{{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer">
      <v-list>
        <v-list-item to="/" prepend-icon="mdi-view-dashboard">
          <v-list-item-title>Watchlist</v-list-item-title>
        </v-list-item>
        <v-list-item to="/about" prepend-icon="mdi-information">
          <v-list-item-title>About</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>
