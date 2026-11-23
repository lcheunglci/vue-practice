<script setup lang="ts">
import { ref } from 'vue'

const HERO_FALLBACK = 'https://via.placeholder.com/1200x400?text=Software+Developer'

const heroFailed = ref(false)

function handleHeroImageError() {
  heroFailed.value = true
}
</script>

<template>
  <v-row align="center" justify="center" class="min-vh-100 py-12">
    <v-col cols="12" lg="8" md="10">
      <v-card class="pa-0" outlined>
        <v-img
          :src="heroFailed ? HERO_FALLBACK : 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop'"
          contain
          aspect-ratio="16/9"
          class="mb-4"
          filter="saturate(0.3) brightness(0.4)"
          @error="handleHeroImageError"
        />
        <v-card-title class="text-center py-8">
          <h1 class="display-1 font-weight-bold mb-2">Software Developer</h1>
          <p class="body-1 text-medium-emphasis">Direct. Focused. Committed to growth.</p>
        </v-card-title>

        <v-card-text class="text-center">
          <p class="text-body-1 mb-6">
            15+ years building software — from video game engines to business
            applications to modern web platforms. I help teams ship reliable,
            maintainable products that scale.
          </p>
          <v-btn color="primary" to="/about" size="large" block class="mb-3">About Me</v-btn>
          <v-btn color="primary" variant="tonal" to="/projects" size="large" block>Projects</v-btn>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
</style>