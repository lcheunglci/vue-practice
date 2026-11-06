<script setup lang="ts">
import { ref } from 'vue'

const drawer = ref(false)

const navigate = (path: string) => {
  drawer.value = false
  // In a real app, we'd use router.push(path)
  console.log('Navigate to:', path)
}
</script>

<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-container>
        <v-spacer />
        <v-toolbar-title>Timesheet Entry</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="drawer = !drawer">
          <v-icon>mdi-drawer</v-icon>
        </v-btn>
      </v-container>
    </v-app-bar>
    <v-drawer v-model="drawer" app>
      <v-list>
        <v-list-item @click="navigate('/timesheet')">
          <v-list-item-title>Timesheet</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-drawer>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style scoped>
/* Add any custom styles here */
</style>