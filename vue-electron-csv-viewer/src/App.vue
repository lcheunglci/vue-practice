<template>
  <v-app class="h-screen">
    <v-app-bar app color="dark" elevation="1">
      <v-toolbar-title class="text-white">Reports Insight</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-navigation-drawer app permanent color="dark" width="240">
      <v-list class="bg-dark">
        <v-list-item class="px-3 py-3">
          <v-list-item-title class="text-white h5 mb-1">Reports Insight</v-list-item-title>
          <v-list-item-subtitle class="small text-secondary">Electron + Vue</v-list-item-subtitle>
        </v-list-item>

        <v-list-item
          to="/reports"
          exact
          append
          class="nav-link"
          active-class="active"
          exact-active-class="active"
        >
          <v-list-item-title class="text-white">All reports</v-list-item-title>
        </v-list-item>

        <v-list-item to="/export" exact append class="nav-link" active-class="active">
          <v-list-item-title class="text-white">Export</v-list-item-title>
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
</script>
