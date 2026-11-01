<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router';
import { VAppBar, VBtn, VIcon } from 'vuetify/components';

const route = useRoute();
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
  </VAppBar>
</template>