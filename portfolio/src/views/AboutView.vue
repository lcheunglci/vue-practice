<script setup lang="ts">
import { ref } from 'vue'

const aboutItems = ref([
  { title: 'Experience', description: '15+ years across game engines, enterprise systems, and web platforms', icon: 'mdi-briefcase-outline' },
  { title: 'Technical Stack', description: 'Vue.js, TypeScript, Node.js, React, Python, Unity, Unreal', icon: 'mdi-code-tags' },
  { title: 'Approach', description: 'Data-driven, user-centered, and always learning', icon: 'mdi-compass-outline' },
  { title: 'Passion', description: 'Building tools that empower people and businesses', icon: 'mdi-heart-outline' }
])
</script>

<template>
  <v-row align="center" justify="center" class="min-vh-100 py-12">
    <v-col cols="12" lg="8" md="10">
      <v-card class="pa-0" outlined>
        <v-card-title class="text-center py-8">
          <h1 class="display-1 font-weight-bold mb-2">About Me</h1>
          <p class="body-1 text-medium-emphasis">
            Passionate software developer with 15+ years of experience spanning 
            video game development, business software, and modern web applications.
          </p>
        </v-card-title>

        <v-card-text class="py-8">
          <v-list class="mx-4">
            <v-list-item 
              v-for="item in aboutItems" 
              :key="item.title" 
              :prepend-icon="item.icon"
              class="mb-2"
            >
              <v-list-item-title class="text-h6">{{ item.title }}</v-list-item-title>
              <v-list-item-subtitle class="text-body-2">
                {{ item.description }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
</style>