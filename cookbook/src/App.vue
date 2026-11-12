<template>
  <v-app>
    <AppBar />
    <v-main>
      <router-view />
    </v-main>
    <v-snackbar
      v-if="currentToast"
      v-model="snackbarOpen"
      :color="currentToast.type === 'success' ? 'success' : currentToast.type === 'error' ? 'error' : 'info'"
      :timeout="3000"
      bottom
      right
    >
      {{ currentToast.text }}
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
import AppBar from './components/AppBar.vue';
import { computed } from 'vue';
import { useToast } from './composables/useToast';

const { currentToast, hideToast } = useToast();

const snackbarOpen = computed({
  get: () => !!currentToast.value,
  set: (value: boolean) => {
    if (!value) {
      hideToast();
    }
  },
});
</script>