<script setup lang="ts">
defineProps<{
  icon: string
  label: string
  value: string | number
  color?: string
  subtitle?: string
}>()
</script>

<template>
  <v-card class="h-100" variant="tonal" :color="color">
    <v-card-text class="d-flex align-center ga-3">
      <v-avatar :color="color ?? 'primary'" variant="flat" size="44">
        <v-icon size="24">{{ icon }}</v-icon>
      </v-avatar>
      <div>
        <div class="text-h5 font-weight-bold lh-1">{{ value }}</div>
        <div class="text-caption text-medium-emphasis">{{ label }}</div>
        <div v-if="subtitle" class="text-caption text-medium-emphasis">{{ subtitle }}</div>
      </div>
    </v-card-text>
  </v-card>
</template>
