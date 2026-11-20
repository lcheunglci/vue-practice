<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useWatchlistStore } from '@/stores/watchlist'
import type { Product, ProductForm } from '@/types'
import { discountPercent, formatCurrency, timeAgo } from '@/utils/format'
import StatCard from '@/components/StatCard.vue'
import PriceSparkline from '@/components/PriceSparkline.vue'
import ProductDialog from '@/components/ProductDialog.vue'

const store = useWatchlistStore()

const dialogOpen = ref(false)
const editing = ref<Product | null>(null)
const refreshingId = ref<string | null>(null)

const search = ref('')
const storeFilter = ref('all')
const statusFilter = ref('all')
const sortBy = ref('recent')

const statusOptions = [
  { title: 'All products', value: 'all' },
  { title: 'In stock', value: 'in-stock' },
  { title: 'On sale', value: 'on-sale' },
  { title: 'At or below target', value: 'at-target' },
]

const sortOptions = [
  { title: 'Recently added', value: 'recent' },
  { title: 'Price: low to high', value: 'price-asc' },
  { title: 'Price: high to low', value: 'price-desc' },
  { title: 'Biggest discount', value: 'discount' },
  { title: 'Name (A–Z)', value: 'name' },
]

const storeOptions = computed(() => [
  { title: 'All stores', value: 'all' },
  ...store.storeNames.map((name) => ({ title: name, value: name })),
])

const headers = [
  { title: 'Product', key: 'name', sortable: false },
  { title: 'Price', key: 'price', sortable: false },
  { title: 'Target', key: 'target', sortable: false },
  { title: 'Stock', key: 'stock', sortable: false },
  { title: 'Trend', key: 'trend', sortable: false },
  { title: 'Checked', key: 'checked', sortable: false },
  { title: '', key: 'actions', sortable: false, align: 'end' as const },
]

const filteredProducts = computed(() => {
  let list = [...store.products]
  const query = search.value.trim().toLowerCase()
  if (query) {
    list = list.filter((p) =>
      `${p.name} ${p.store} ${p.notes ?? ''}`.toLowerCase().includes(query),
    )
  }
  if (storeFilter.value !== 'all') {
    list = list.filter((p) => p.store === storeFilter.value)
  }
  switch (statusFilter.value) {
    case 'in-stock':
      list = list.filter((p) => p.inStock === true)
      break
    case 'on-sale':
      list = list.filter(
        (p) => p.currentPrice != null && p.originalPrice != null && p.currentPrice < p.originalPrice,
      )
      break
    case 'at-target':
      list = list.filter(
        (p) => p.inStock === true && p.currentPrice != null && p.currentPrice <= p.targetPrice,
      )
      break
  }
  switch (sortBy.value) {
    case 'price-asc':
      list.sort((a, b) => (a.currentPrice ?? Infinity) - (b.currentPrice ?? Infinity))
      break
    case 'price-desc':
      list.sort((a, b) => (b.currentPrice ?? -Infinity) - (a.currentPrice ?? -Infinity))
      break
    case 'discount':
      list.sort(
        (a, b) =>
          discountPercent(b.currentPrice, b.originalPrice) -
          discountPercent(a.currentPrice, a.originalPrice),
      )
      break
    case 'name':
      list.sort((a, b) => a.name.localeCompare(b.name))
      break
    default:
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }
  return list
})

const hasActiveFilters = computed(
  () => search.value.trim() !== '' || storeFilter.value !== 'all' || statusFilter.value !== 'all',
)

function openAdd() {
  editing.value = null
  dialogOpen.value = true
}

function openEdit(product: Product) {
  editing.value = product
  dialogOpen.value = true
}

async function handleSave(form: ProductForm) {
  if (editing.value) {
    store.updateProduct(editing.value.id, form)
  } else {
    await store.addProduct(form)
  }
}

async function refreshOne(product: Product) {
  refreshingId.value = product.id
  try {
    await store.refreshProduct(product.id)
  } finally {
    refreshingId.value = null
  }
}

function removeProduct(product: Product) {
  store.removeProduct(product.id)
}

function resetFilters() {
  search.value = ''
  storeFilter.value = 'all'
  statusFilter.value = 'all'
  sortBy.value = 'recent'
}

function stockColor(inStock: boolean | null) {
  if (inStock === null) return 'secondary'
  return inStock ? 'success' : 'error'
}

function stockLabel(inStock: boolean | null) {
  if (inStock === null) return 'Unknown'
  return inStock ? 'In stock' : 'Out of stock'
}

function isAtTarget(product: Product) {
  return (
    product.inStock === true &&
    product.currentPrice != null &&
    product.currentPrice <= product.targetPrice
  )
}

function discountFor(product: Product) {
  return discountPercent(product.currentPrice, product.originalPrice)
}
</script>

<template>
  <v-container class="py-6" max-width="1280">
    <!-- Page header -->
    <div class="d-flex flex-wrap align-center ga-3 mb-5">
      <div>
        <h1 class="text-h4 font-weight-bold mb-1">Watchlist</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          Track availability and prices across your favourite stores.
          <template v-if="store.lastRefresh">Last checked {{ timeAgo(store.lastRefresh) }}.</template>
          <template v-else>No checks yet.</template>
        </p>
      </div>
      <v-spacer />
      <v-btn
        variant="tonal"
        prepend-icon="mdi-refresh"
        :loading="store.isRefreshing"
        :disabled="store.products.length === 0"
        @click="store.refreshAll()"
      >
        Refresh all
      </v-btn>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openAdd">Add product</v-btn>
    </div>

    <!-- Stats -->
    <v-row class="mb-2">
      <v-col cols="6" md="3">
        <StatCard icon="mdi-format-list-checks" label="Tracked products" :value="store.products.length" color="primary" />
      </v-col>
      <v-col cols="6" md="3">
        <StatCard icon="mdi-check-circle-outline" label="In stock" :value="store.inStockCount" color="success" />
      </v-col>
      <v-col cols="6" md="3">
        <StatCard icon="mdi-sale" label="On sale" :value="store.onSaleCount" color="warning" />
      </v-col>
      <v-col cols="6" md="3">
        <StatCard icon="mdi-target" label="At or below target" :value="store.atTargetCount" color="secondary" />
      </v-col>
    </v-row>

    <!-- Alerts -->
    <v-card v-if="store.alerts.length > 0" class="mb-4" variant="outlined">
      <v-card-title class="d-flex align-center text-subtitle-1">
        <v-icon color="warning" class="mr-2">mdi-bell-ring-outline</v-icon>
        Alerts
        <v-chip
          v-if="store.unreadAlertCount > 0"
          color="error"
          size="small"
          class="ml-2"
        >
          {{ store.unreadAlertCount }} new
        </v-chip>
        <v-spacer />
        <v-btn size="small" variant="text" @click="store.markAlertsRead()">Mark all read</v-btn>
        <v-btn size="small" variant="text" color="error" @click="store.clearAlerts()">Clear</v-btn>
      </v-card-title>
      <v-divider />
      <v-list density="compact" max-height="220" class="overflow-y-auto">
        <v-list-item
          v-for="alert in store.alerts.slice(0, 8)"
          :key="alert.id"
          :to="`/product/${alert.productId}`"
        >
          <template #prepend>
            <v-icon :color="alert.type === 'price-drop' ? 'success' : 'info'">
              {{ alert.type === 'price-drop' ? 'mdi-tag-arrow-down-outline' : 'mdi-package-variant-closed-check' }}
            </v-icon>
          </template>
          <v-list-item-title :class="{ 'font-weight-bold': !alert.read }">
            {{ alert.message }}
          </v-list-item-title>
          <v-list-item-subtitle>{{ timeAgo(alert.createdAt) }}</v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card>

    <!-- Filters -->
    <v-card class="mb-4">
      <v-card-text>
        <v-row dense align="center">
          <v-col cols="12" md="4">
            <v-text-field
              v-model="search"
              label="Search products"
              prepend-inner-icon="mdi-magnify"
              density="comfortable"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="6" md="2">
            <v-select
              v-model="storeFilter"
              :items="storeOptions"
              label="Store"
              density="comfortable"
              hide-details
            />
          </v-col>
          <v-col cols="6" md="3">
            <v-select
              v-model="statusFilter"
              :items="statusOptions"
              label="Status"
              density="comfortable"
              hide-details
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="sortBy"
              :items="sortOptions"
              label="Sort by"
              prepend-inner-icon="mdi-sort"
              density="comfortable"
              hide-details
            />
          </v-col>
        </v-row>
        <div v-if="hasActiveFilters" class="mt-2">
          <v-btn size="small" variant="text" prepend-icon="mdi-filter-off-outline" @click="resetFilters">
            Clear filters
          </v-btn>
          <span class="text-caption text-medium-emphasis ml-2">
            Showing {{ filteredProducts.length }} of {{ store.products.length }}
          </span>
        </div>
      </v-card-text>
    </v-card>

    <!-- Table / empty state -->
    <v-card>
      <v-data-table
        v-if="store.products.length > 0"
        :headers="headers"
        :items="filteredProducts"
        item-value="id"
        :items-per-page="10"
        :items-per-page-options="[10, 25, 50]"
        hover
      >
        <template #no-data>
          <div class="text-center py-10 text-medium-emphasis">
            <v-icon size="48" class="mb-2">mdi-filter-off-outline</v-icon>
            <div>No products match your filters.</div>
            <v-btn class="mt-3" variant="tonal" @click="resetFilters">Clear filters</v-btn>
          </div>
        </template>

        <template #item.name="{ item }">
          <div class="py-1">
            <RouterLink
              :to="`/product/${item.id}`"
              class="text-body-1 font-weight-medium text-primary text-decoration-none"
            >
              {{ item.name }}
            </RouterLink>
            <div class="text-caption text-medium-emphasis d-flex align-center ga-1">
              <v-icon size="12">mdi-storefront-outline</v-icon>{{ item.store }}
              <template v-if="item.notes">· {{ item.notes }}</template>
            </div>
          </div>
        </template>

        <template #item.price="{ item }">
          <div class="d-flex flex-column">
            <span class="font-weight-bold">{{ formatCurrency(item.currentPrice) }}</span>
            <span v-if="discountFor(item) > 0" class="text-caption">
              <span class="text-decoration-line-through text-medium-emphasis">
                {{ formatCurrency(item.originalPrice) }}
              </span>
              <v-chip color="warning" size="x-small" class="ml-1" variant="flat">
                -{{ discountFor(item) }}%
              </v-chip>
            </span>
          </div>
        </template>

        <template #item.target="{ item }">
          <v-chip
            :color="isAtTarget(item) ? 'success' : 'default'"
            size="small"
            variant="tonal"
          >
            {{ formatCurrency(item.targetPrice) }}
          </v-chip>
        </template>

        <template #item.stock="{ item }">
          <v-chip :color="stockColor(item.inStock)" size="small" variant="tonal">
            {{ stockLabel(item.inStock) }}
          </v-chip>
        </template>

        <template #item.trend="{ item }">
          <PriceSparkline :points="item.priceHistory" :target="item.targetPrice" :width="110" :height="36" />
        </template>

        <template #item.checked="{ item }">
          <span class="text-caption text-medium-emphasis">{{ timeAgo(item.lastChecked) }}</span>
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex align-center justify-end">
            <v-btn
              :icon="refreshingId === item.id ? 'mdi-loading' : 'mdi-refresh'"
              :loading="refreshingId === item.id"
              size="small"
              variant="text"
              aria-label="Refresh price"
              @click="refreshOne(item)"
            />
            <v-btn
              icon="mdi-pencil-outline"
              size="small"
              variant="text"
              aria-label="Edit product"
              @click="openEdit(item)"
            />
            <v-btn
              icon="mdi-open-in-new"
              size="small"
              variant="text"
              aria-label="Open product page"
              :href="item.url"
              target="_blank"
              rel="noopener noreferrer"
            />
            <v-btn
              icon="mdi-delete-outline"
              size="small"
              variant="text"
              color="error"
              aria-label="Remove product"
              @click="removeProduct(item)"
            />
          </div>
        </template>
      </v-data-table>

      <!-- Empty state -->
      <div v-else class="text-center py-14 px-6">
        <v-icon size="64" color="primary" class="mb-3">mdi-chart-timeline-variant-shimmer</v-icon>
        <h2 class="text-h6 mb-1">No products yet</h2>
        <p class="text-body-2 text-medium-emphasis mb-5">
          Add a product to start tracking its price and availability, or load some demo data to explore.
        </p>
        <v-btn color="primary" prepend-icon="mdi-plus" class="mr-2" @click="openAdd">Add product</v-btn>
        <v-btn variant="tonal" prepend-icon="mdi-database-import-outline" :loading="store.isRefreshing" @click="store.loadDemoData()">
          Load demo data
        </v-btn>
      </div>
    </v-card>

    <ProductDialog v-model="dialogOpen" :product="editing" @save="handleSave" />
  </v-container>
</template>
