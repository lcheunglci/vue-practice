<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWatchlistStore } from '@/stores/watchlist'
import type { Product, ProductForm } from '@/types'
import { discountPercent, formatCurrency, formatDateTime, timeAgo } from '@/utils/format'
import PriceHistoryChart from '@/components/PriceHistoryChart.vue'
import ProductDialog from '@/components/ProductDialog.vue'

const route = useRoute()
const router = useRouter()
const store = useWatchlistStore()

const dialogOpen = ref(false)

const product = computed<Product | undefined>(() =>
  store.products.find((p) => p.id === route.params.id),
)

const discount = computed(() =>
  product.value ? discountPercent(product.value.currentPrice, product.value.originalPrice) : 0,
)

const atTarget = computed(
  () =>
    !!product.value &&
    product.value.inStock === true &&
    product.value.currentPrice != null &&
    product.value.currentPrice <= product.value.targetPrice,
)

const history = computed(() => [...(product.value?.priceHistory ?? [])].reverse())

async function refresh() {
  if (product.value) await store.refreshProduct(product.value.id)
}

function handleSave(form: ProductForm) {
  if (product.value) store.updateProduct(product.value.id, form)
}

function remove() {
  if (!product.value) return
  store.removeProduct(product.value.id)
  router.push('/')
}

const stockColor = computed(() => {
  if (!product.value || product.value.inStock === null) return 'secondary'
  return product.value.inStock ? 'success' : 'error'
})

const stockLabel = computed(() => {
  if (!product.value || product.value.inStock === null) return 'Unknown'
  return product.value.inStock ? 'In stock' : 'Out of stock'
})
</script>

<template>
  <v-container class="py-6" max-width="1100">
    <template v-if="product">
      <!-- Header -->
      <div class="d-flex flex-wrap align-center ga-3 mb-5">
        <v-btn icon="mdi-arrow-left" variant="text" to="/" aria-label="Back to watchlist" />
        <div class="flex-grow-1">
          <h1 class="text-h5 font-weight-bold mb-1">{{ product.name }}</h1>
          <div class="d-flex align-center flex-wrap ga-2 text-body-2 text-medium-emphasis">
            <span class="d-inline-flex align-center">
              <v-icon size="16" class="mr-1">mdi-storefront-outline</v-icon>{{ product.store }}
            </span>
            <v-divider vertical />
            <span>Added {{ formatDateTime(product.createdAt) }}</span>
          </div>
        </div>
        <v-btn
          variant="tonal"
          prepend-icon="mdi-refresh"
          :loading="store.isRefreshing"
          @click="refresh"
        >
          Refresh
        </v-btn>
        <v-btn variant="tonal" prepend-icon="mdi-pencil-outline" @click="dialogOpen = true">Edit</v-btn>
        <v-btn
          variant="tonal"
          color="error"
          prepend-icon="mdi-delete-outline"
          @click="remove"
        >
          Remove
        </v-btn>
      </div>

      <v-alert
        v-if="atTarget"
        type="success"
        variant="tonal"
        class="mb-4"
        icon="mdi-party-popper"
      >
        This product is in stock and at or below your target price of
        {{ formatCurrency(product.targetPrice) }}!
      </v-alert>

      <!-- Summary cards -->
      <v-row class="mb-2">
        <v-col cols="6" md="3">
          <v-card variant="tonal" color="primary" class="h-100">
            <v-card-text>
              <div class="text-caption text-medium-emphasis">Current price</div>
              <div class="text-h5 font-weight-bold">{{ formatCurrency(product.currentPrice) }}</div>
              <div v-if="discount > 0" class="text-caption">
                <span class="text-decoration-line-through">{{ formatCurrency(product.originalPrice) }}</span>
                <v-chip color="warning" size="x-small" class="ml-1">-{{ discount }}%</v-chip>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6" md="3">
          <v-card variant="tonal" color="secondary" class="h-100">
            <v-card-text>
              <div class="text-caption text-medium-emphasis">Target price</div>
              <div class="text-h5 font-weight-bold">{{ formatCurrency(product.targetPrice) }}</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6" md="3">
          <v-card variant="tonal" :color="stockColor" class="h-100">
            <v-card-text>
              <div class="text-caption text-medium-emphasis">Availability</div>
              <div class="text-h5 font-weight-bold">{{ stockLabel }}</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6" md="3">
          <v-card variant="tonal" color="info" class="h-100">
            <v-card-text>
              <div class="text-caption text-medium-emphasis">Last checked</div>
              <div class="text-h6 font-weight-bold">{{ timeAgo(product.lastChecked) }}</div>
              <div class="text-caption">{{ formatDateTime(product.lastChecked) }}</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <!-- Chart -->
        <v-col cols="12" md="8">
          <v-card class="h-100">
            <v-card-title class="text-subtitle-1 d-flex align-center">
              <v-icon class="mr-2">mdi-chart-line</v-icon>Price history
            </v-card-title>
            <v-card-text>
              <PriceHistoryChart :points="product.priceHistory" :target="product.targetPrice" />
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Details -->
        <v-col cols="12" md="4">
          <v-card class="h-100">
            <v-card-title class="text-subtitle-1">
              <v-icon class="mr-2">mdi-information-outline</v-icon>Details
            </v-card-title>
            <v-card-text>
              <v-list density="compact">
                <v-list-item prepend-icon="mdi-link-variant">
                  <v-list-item-title>Product URL</v-list-item-title>
                  <v-list-item-subtitle class="text-truncate">
                    <a :href="product.url" target="_blank" rel="noopener noreferrer">{{ product.url }}</a>
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item prepend-icon="mdi-note-text-outline">
                  <v-list-item-title>Notes</v-list-item-title>
                  <v-list-item-subtitle>{{ product.notes || '—' }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item prepend-icon="mdi-history">
                  <v-list-item-title>Price points</v-list-item-title>
                  <v-list-item-subtitle>{{ product.priceHistory.length }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
              <v-btn
                block
                variant="tonal"
                prepend-icon="mdi-open-in-new"
                :href="product.url"
                target="_blank"
                rel="noopener noreferrer"
                class="mt-2"
              >
                Open product page
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- History table -->
      <v-card class="mt-4">
        <v-card-title class="text-subtitle-1">
          <v-icon class="mr-2">mdi-format-list-bulleted</v-icon>Recent checks
        </v-card-title>
        <v-table density="compact">
          <thead>
            <tr>
              <th>Date</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(point, i) in history.slice(0, 15)" :key="i">
              <td>{{ formatDateTime(point.date) }}</td>
              <td>{{ formatCurrency(point.price) }}</td>
            </tr>
            <tr v-if="history.length === 0">
              <td colspan="2" class="text-center text-medium-emphasis py-4">
                No checks recorded yet.
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>

      <ProductDialog v-model="dialogOpen" :product="product" @save="handleSave" />
    </template>

    <!-- Not found -->
    <v-card v-else class="text-center py-14">
      <v-icon size="64" color="warning" class="mb-3">mdi-help-circle-outline</v-icon>
      <h2 class="text-h6 mb-2">Product not found</h2>
      <p class="text-body-2 text-medium-emphasis mb-4">
        It may have been removed from your watchlist.
      </p>
      <v-btn color="primary" to="/" prepend-icon="mdi-arrow-left">Back to watchlist</v-btn>
    </v-card>
  </v-container>
</template>
