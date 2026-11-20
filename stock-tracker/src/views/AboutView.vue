<script setup lang="ts">
const features = [
  {
    icon: 'mdi-format-list-checks',
    title: 'Watchlist & target price',
    text: 'Add any product from Amazon, Best Buy, Target, Walmart or a custom store, then set the price you are willing to pay.',
  },
  {
    icon: 'mdi-refresh',
    title: 'Manual refresh',
    text: 'Re-check every product with one click. Each item shows when it was last checked and how its price has moved.',
  },
  {
    icon: 'mdi-bell-ring-outline',
    title: 'Alerts',
    text: 'Get an in-app alert when an item comes back in stock or drops to (or below) your target price.',
  },
  {
    icon: 'mdi-chart-line',
    title: 'Price history',
    text: 'Every check is recorded so you can see the price trend and a full history for each product.',
  },
  {
    icon: 'mdi-filter-variant',
    title: 'Filter, sort & search',
    text: 'Find products fast by name, store or status, and sort by price, discount or date added.',
  },
  {
    icon: 'mdi-database-outline',
    title: 'Saved locally',
    text: 'Your watchlist is stored in your browser with localStorage, so it survives page reloads.',
  },
]
</script>

<template>
  <v-container class="py-8" max-width="1000">
    <div class="text-center mb-8">
      <v-icon size="56" color="primary" class="mb-3">mdi-chart-line-variant</v-icon>
      <h1 class="text-h4 font-weight-bold mb-2">About Stock Tracker</h1>
      <p class="text-body-1 text-medium-emphasis mx-auto" style="max-width: 640px">
        A small Vue + Vuetify app for keeping an eye on products you want to buy.
        Track availability and prices across several e-commerce stores and get
        notified when something is in stock and on sale.
      </p>
    </div>

    <v-row>
      <v-col v-for="feature in features" :key="feature.title" cols="12" sm="6">
        <v-card class="h-100" variant="outlined">
          <v-card-item>
            <template #prepend>
              <v-avatar color="primary" variant="tonal">
                <v-icon>{{ feature.icon }}</v-icon>
              </v-avatar>
            </template>
            <v-card-title class="text-subtitle-1">{{ feature.title }}</v-card-title>
          </v-card-item>
          <v-card-text class="text-body-2 text-medium-emphasis">{{ feature.text }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-alert type="info" variant="tonal" class="mt-8" icon="mdi-information-outline">
      <strong>Demo data:</strong> product prices and availability are simulated by a
      mock service. Browsers can't scrape store pages directly because of CORS, so a
      real deployment would need a small backend or a third-party price API. The app is
      structured so only <code>src/services/mockStore.ts</code> needs to change to use
      real data.
    </v-alert>
  </v-container>
</template>
