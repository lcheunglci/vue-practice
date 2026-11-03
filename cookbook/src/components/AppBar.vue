<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router';
import { useTheme } from 'vuetify';
import { VAppBar, VBtn, VIcon } from 'vuetify/components';
import { ref, getCurrentInstance } from 'vue';

// Initialize from localStorage or system preference
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = savedTheme ? savedTheme : prefersDark ? 'dark' : 'light';

const isDark = ref(initialTheme === 'dark');

function toggleTheme() {
  const before = isDark.value;
  isDark.value = !before;
  const attr = document.documentElement.getAttribute('data-theme');
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
  console.log('before:', before, 'after:', isDark.value, 'attr:', attr);
}
</script>

<template>
  <VAppBar color="primary" class="d-flex align-center">
    <RouterLink to="/recipes" class="text-h6 text-white text-decoration-none">
      🍳 Cookbook
    </RouterLink>
    <VBtn
      v-for="item in [
        { to: '/recipes', label: 'Recipes', icon: 'mdi-book-open-variant' },
        { to: '/tags', label: 'Tags', icon: 'mdi-tag-multiple' },
        { to: '/recipes/new', label: 'Add Recipe', icon: 'mdi-plus' },
      ]"
      :key="item.to"
      :to="item.to"
      variant="text"
      class="mx-2 text-white"
    >
      <VIcon start>{{ item.icon }}</VIcon>
      {{ item.label }}
    </VBtn>
    <VBtn variant="text" class="mx-2 text-white" @click="toggleTheme">
      <VIcon start>{{ isDark.value ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</VIcon>
    </VBtn>
  </VAppBar>
</template>