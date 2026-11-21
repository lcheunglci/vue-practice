import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import type { Alert, Product, ProductForm, Quote } from '@/types'
import { basePriceFor, fetchQuote } from '@/services/mockStore'
import { formatCurrency } from '@/utils/format'

const STORAGE_KEY = 'stock-tracker-v1'

function uid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

interface PersistedState {
  products: Product[]
  alerts: Alert[]
  lastRefresh: string | null
}

export const useWatchlistStore = defineStore('watchlist', () => {
  const products = ref<Product[]>([])
  const alerts = ref<Alert[]>([])
  const lastRefresh = ref<string | null>(null)
  const isRefreshing = ref(false)

  // ---------------------------------------------------------------------------
  // Persistence
  // ---------------------------------------------------------------------------
  function loadFromStorage() {
    if (typeof localStorage === 'undefined') return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const data = JSON.parse(raw) as Partial<PersistedState>
      products.value = Array.isArray(data.products) ? data.products : []
      alerts.value = Array.isArray(data.alerts) ? data.alerts : []
      lastRefresh.value = data.lastRefresh ?? null
    } catch (err) {
      console.warn('Could not load watchlist from localStorage:', err)
    }
  }

  function saveToStorage() {
    if (typeof localStorage === 'undefined') return
    try {
      const payload: PersistedState = {
        products: products.value,
        alerts: alerts.value,
        lastRefresh: lastRefresh.value,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch (err) {
      console.warn('Could not save watchlist to localStorage:', err)
    }
  }

  // Load immediately so the first render already has data.
  loadFromStorage()
  watch([products, alerts, lastRefresh], saveToStorage, { deep: true })

  // ---------------------------------------------------------------------------
  // Alerts
  // ---------------------------------------------------------------------------
  function pushAlert(product: Product, type: Alert['type'], message: string) {
    alerts.value.unshift({
      id: uid(),
      productId: product.id,
      productName: product.name,
      type,
      message,
      createdAt: new Date().toISOString(),
      read: false,
    })
    // Keep the list from growing without bound.
    if (alerts.value.length > 100) alerts.value.length = 100
  }

  function markAlertsRead() {
    alerts.value.forEach((a) => (a.read = true))
  }

  function clearAlerts() {
    alerts.value = []
  }

  // ---------------------------------------------------------------------------
  // Refreshing
  // ---------------------------------------------------------------------------
  async function refreshProduct(id: string): Promise<void> {
    const product = products.value.find((p) => p.id === id)
    if (!product) return

    const previousPrice = product.currentPrice
    const previousInStock = product.inStock

    let quote: Quote
    try {
      quote = await fetchQuote(product)
    } catch (err) {
      console.warn(`Failed to check ${product.name}:`, err)
      return
    }

    product.currentPrice = quote.price
    product.originalPrice = quote.originalPrice
    product.inStock = quote.inStock
    product.lastChecked = new Date().toISOString()
    product.priceHistory.push({ date: product.lastChecked, price: quote.price })
    // Cap history so storage stays small.
    if (product.priceHistory.length > 120) {
      product.priceHistory.splice(0, product.priceHistory.length - 120)
    }

    if (quote.inStock && previousInStock === false) {
      pushAlert(
        product,
        'in-stock',
        `${product.name} is back in stock at ${formatCurrency(quote.price)}.`,
      )
    }

    if (
      quote.inStock &&
      quote.price <= product.targetPrice &&
      (previousPrice == null || previousPrice > product.targetPrice)
    ) {
      pushAlert(
        product,
        'price-drop',
        `${product.name} dropped to ${formatCurrency(quote.price)} (target ${formatCurrency(product.targetPrice)}).`,
      )
    }
  }

  async function refreshAll(): Promise<void> {
    if (isRefreshing.value) return
    isRefreshing.value = true
    try {
      await Promise.all(products.value.map((p) => refreshProduct(p.id)))
      lastRefresh.value = new Date().toISOString()
    } finally {
      isRefreshing.value = false
    }
  }

  // ---------------------------------------------------------------------------
  // CRUD
  // ---------------------------------------------------------------------------
  async function addProduct(data: ProductForm): Promise<Product> {
    const basePrice = basePriceFor(data.url, data.name, data.targetPrice)
    const now = new Date().toISOString()
    const product: Product = {
      id: uid(),
      name: data.name.trim(),
      store: data.store.trim(),
      url: data.url.trim(),
      targetPrice: data.targetPrice,
      basePrice,
      currentPrice: null,
      originalPrice: null,
      inStock: null,
      lastChecked: null,
      // Seed one point at the list price so the trend has a starting reference.
      priceHistory: [{ date: now, price: basePrice }],
      createdAt: now,
      notes: data.notes?.trim() || undefined,
    }
    products.value.push(product)
    await refreshProduct(product.id)
    return product
  }

  function removeProduct(id: string): void {
    products.value = products.value.filter((p) => p.id !== id)
    alerts.value = alerts.value.filter((a) => a.productId !== id)
  }

  function updateProduct(id: string, data: Partial<ProductForm>): void {
    const product = products.value.find((p) => p.id === id)
    if (!product) return
    if (data.name !== undefined) product.name = data.name.trim()
    if (data.store !== undefined) product.store = data.store.trim()
    if (data.url !== undefined) product.url = data.url.trim()
    if (data.targetPrice !== undefined) product.targetPrice = data.targetPrice
    if (data.notes !== undefined) product.notes = data.notes?.trim() || undefined
  }

  function clearAll(): void {
    products.value = []
    alerts.value = []
    lastRefresh.value = null
  }

  // ---------------------------------------------------------------------------
  // Demo data
  // ---------------------------------------------------------------------------
  async function loadDemoData(): Promise<void> {
    if (products.value.length > 0) return
    const demo: ProductForm[] = [
      {
        name: 'Sony WH-1000XM5 Headphones',
        store: 'Amazon',
        url: 'https://www.amazon.com/dp/B09XS7JWHH',
        targetPrice: 299,
        notes: 'Noise cancelling, want a big drop',
      },
      {
        name: 'Nintendo Switch 2',
        store: 'Best Buy',
        url: 'https://www.bestbuy.com/site/nintendo-switch-2',
        targetPrice: 449,
      },
      {
        name: 'LG C4 55" OLED TV',
        store: 'Target',
        url: 'https://www.target.com/p/lg-c4-55-oled',
        targetPrice: 1199,
        notes: 'Wait for Black Friday',
      },
      {
        name: 'Instant Pot Duo 7-in-1',
        store: 'Walmart',
        url: 'https://www.walmart.com/ip/instant-pot-duo-7-in-1',
        targetPrice: 69,
      },
      {
        name: 'Apple AirPods Pro',
        store: 'Amazon',
        url: 'https://www.amazon.com/dp/B0CHWRXH8B',
        targetPrice: 199,
      },
    ]
    isRefreshing.value = true
    try {
      await Promise.all(demo.map((item) => addProduct(item)))
      lastRefresh.value = new Date().toISOString()
    } finally {
      isRefreshing.value = false
    }
  }

  // ---------------------------------------------------------------------------
  // Computed
  // ---------------------------------------------------------------------------
  const inStockCount = computed(
    () => products.value.filter((p) => p.inStock === true).length,
  )

  const onSaleCount = computed(
    () =>
      products.value.filter(
        (p) => p.currentPrice != null && p.originalPrice != null && p.currentPrice < p.originalPrice,
      ).length,
  )

  const atTargetCount = computed(
    () =>
      products.value.filter(
        (p) => p.inStock === true && p.currentPrice != null && p.currentPrice <= p.targetPrice,
      ).length,
  )

  const unreadAlertCount = computed(() => alerts.value.filter((a) => !a.read).length)

  const storeNames = computed(() => {
    const names = new Set(products.value.map((p) => p.store).filter(Boolean))
    return [...names].sort((a, b) => a.localeCompare(b))
  })

  return {
    // state
    products,
    alerts,
    lastRefresh,
    isRefreshing,
    // actions
    addProduct,
    removeProduct,
    updateProduct,
    refreshProduct,
    refreshAll,
    clearAll,
    loadDemoData,
    markAlertsRead,
    clearAlerts,
    // computed
    inStockCount,
    onSaleCount,
    atTargetCount,
    unreadAlertCount,
    storeNames,
  }
})
