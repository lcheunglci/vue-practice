<template>
  <v-app>
    <AppBar />
    <v-main>
      <router-view />
    </v-main>
    <v-snackbar
      v-for="toast in toastMessages"
      :key="toast.id"
      v-model="toastMessages"
      :color="toast.type === 'success' ? 'success' : toast.type === 'error' ? 'error' : 'info'"
      :timeout="3000"
      bottom
      right
      class="toast-snackbar"
    >
      {{ toast.text }}
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
import AppBar from './components/AppBar.vue';
import { useToast } from './composables/useToast';

const { messages: toastMessages } = useToast();
</script>

<style scoped>
.toast-snackbar {
  margin: 0 16px 16px 0;
}
</style>