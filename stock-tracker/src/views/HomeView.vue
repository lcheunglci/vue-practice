<script setup lang="ts">
import { ref, computed } from 'vue'
import { useWatchlistStore } from '@/stores/watchlist'

// Types
interface Product {
  id: string
  name: string
  store: string
  url: string
  targetPrice: number
  currentPrice: number | null
  inStock: boolean | null
  lastChecked: string | null
}

interface ProductForm {
  name: string
  store: string
  url: string
  targetPrice: number
}

// Store instance
const watchlistStore = useWatchlistStore()

// Form state
const form = ref<ProductForm>({
  name: '',
  store: '',
  url: '',
  targetPrice: 0
})

// Computed properties - Pinia auto-unwraps refs, so access directly
const products = computed(() => watchlistStore.products)
const affordableProducts = computed(() => watchlistStore.affordableProducts)
const recentlyAdded = computed(() => watchlistStore.recentlyAdded)

// Table headers
const headers = [
  { title: 'Product', key: 'name' },
  { title: 'Store', key: 'store' },
  { title: 'Current', key: 'currentPrice' },
  { title: 'Target', key: 'targetPrice' },
  { title: 'Actions', key: 'actions', sortable: false }
]

// Methods
const addProduct = () => {
  if (form.value.name && form.value.store && form.value.url && form.value.targetPrice > 0) {
    watchlistStore.addProduct(form.value)
    form.value = { name: '', store: '', url: '', targetPrice: 0 }
  }
}

const removeProduct = (id: string) => {
  watchlistStore.removeProduct(id)
}

const refreshPrices = () => {
  // In a real app, this would fetch current prices from stores
  // For now, simulate some updates
  products.value.forEach((product: Product) => {
    if (Math.random() > 0.5) {
      product.currentPrice = Math.round(Math.random() * 100 * 100) / 100
    }
    product.lastChecked = new Date().toLocaleTimeString()
  })
  watchlistStore.saveToLocalStorage()
}

// Helper for status display
const getStatusClass = (inStock: boolean | null, currentPrice: number | null, targetPrice: number) => {
  if (inStock === null || currentPrice === null) return 'secondary'
  if (currentPrice <= targetPrice) return 'success'
  return 'error'
}
</script>

<template>
  <v-container fluid fill-height>
    <v-row justify="center" align="center" height="100%">
      <v-col cols="12" md="8">
        
        <!-- Header -->
        <v-card class="mx-auto mb-8" max-width="600">
          <v-card-title>
            <v-card-title-text>
              <v-icon left>mdi-inventory</v-icon>
              <h2 class="headline">Stock Tracker</h2>
            </v-card-title-text>
          </v-card-title>
          
          <v-card-text>
            <p class="body-1">Track product availability and prices across your favorite e-commerce stores. Get notified when items go on sale or drop to your target price.</p>
            
            <!-- Stats -->
            <v-row>
              <v-col cols="12" sm="6" md="3" class="mb-2">
                <v-chip small text>Total: {{ products.length }}</v-chip>
              </v-col>
              <v-col cols="12" sm="6" md="3" class="text-success mb-2">
                <v-chip small text>In Stock: {{ affordableProducts.length }}</v-chip>
              </v-col>
              <v-col cols="12" sm="6" md="3" class="text-warning mb-2">
                <v-chip small text>On Sale: {{ recentlyAdded.length }}</v-chip>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Add Product Form -->
        <v-card class="mx-auto mb-8" max-width="600">
          <v-card-title>Add Product to Watchlist</v-card-title>
          
          <v-card-text>
            <v-form @submit.prevent="addProduct">
              <v-row>
                <v-col cols="12" md="6">
                  <v-textfield
                    v-model="form.name"
                    label="Product Name"
                    required
                    density="compact"
                  ></v-textfield>
                </v-col>
                <v-col cols="12" md="6">
                  <v-textfield
                    v-model="form.store"
                    label="Store (e.g. Amazon, Best Buy)"
                    required
                    density="compact"
                  ></v-textfield>
                </v-col>
              </v-row>
              
              <v-row>
                <v-col cols="12" md="6">
                  <v-textfield
                    v-model="form.url"
                    label="Product URL"
                    required
                    density="compact"
                    prepend-inner-icon="mdi-link"
                  ></v-textfield>
                </v-col>
                <v-col cols="12" md="6">
                  <v-textfield
                    v-model="form.targetPrice"
                    type="number"
                    label="Target Price ($)"
                    required
                    density="compact"
                  ></v-textfield>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          
          <v-card-actions>
            <v-btn type="submit" color="primary">
              <v-icon start>mdi-plus</v-icon>
              Add Product
            </v-btn>
            <v-btn variant="text" @click="form = { name: '', store: '', url: '', targetPrice: 0 }">
              Clear
            </v-btn>
          </v-card-actions>
        </v-card>

        <!-- Products Table -->
        <v-card class="mx-auto" max-width="1200">
          <v-card-title>
            <v-icon start>mdi-grid</v-icon>
            <h3>Watchlist {{ affordableProducts.length > 0 ? '(Price Drop!)' : '' }}</h3>
          </v-card-title>
          
          <v-card-text>
            <v-data-table
              :items="products"
              :headers="headers"
              :items-per-page-items="[5, 10, 20]"
              no-data-text="No products in watchlist yet. Add products using the form above to start tracking availability and prices."
            >
              <template #item.name="{ item }">
                <td>
                  <v-chip small :color="item.inStock ? 'success' : 'error'" text>{{ item.name }}</v-chip>
                </td>
              </template>
              <template #item.currentPrice="{ item }">
                <td>{{ item.currentPrice || 'N/A' }}</td>
              </template>
              <template #item.targetPrice="{ item }">
                <td>
                  <v-chip
                    small
                    :color="item.currentPrice && item.currentPrice <= item.targetPrice ? 'success' : 'primary'"
                    text
                  >
                    {{ item.currentPrice || 'N/A' }} / {{ item.targetPrice }}
                  </v-chip>
                </td>
              </template>
              <template #item.actions="{ item }">
                <td class="text-end">
                  <v-btn
                    small
                    variant="text"
                    color="error"
                    @click="removeProduct(item.id)"
                  >
                    <v-icon>mdi-remove</v-icon>
                  </v-btn>
                </td>
              </template>
            </v-data-table>
          </v-card-text>
          
          <v-card-actions>
            <v-btn
              small
              variant="text"
              @click="refreshPrices"
            >
              <v-icon start>mdi-refresh</v-icon>
              Refresh Prices
            </v-btn>
          </v-card-actions>
        </v-card>

      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
</style>