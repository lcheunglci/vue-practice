import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { defineStore } from 'pinia'
import type { Product, ProductForm } from '@/types/product'

export const useWatchlistStore = defineStore('watchlist', () => {
  const products = ref<Product[]>([])

  // Persistent storage using localStorage
  const saveToLocalStorage = () => {
    try {
      localStorage.setItem('watchlist', JSON.stringify(products.value))
    } catch (e) {
      console.warn('Could not save watchlist to localStorage:', e)
    }
  }

  const loadFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem('watchlist')
      if (stored) {
        products.value = JSON.parse(stored)
      }
    } catch (e) {
      console.warn('Could not load watchlist from localStorage:', e)
    }
  }

  // Load on init
  onMounted(loadFromLocalStorage)

  // Save when products change
  watch(products, saveToLocalStorage, { deep: true })

  // Actions
  const addProduct = (data: ProductForm) => {
    const newProduct: Product = {
      id: crypto.randomUUID(),
      ...data,
      currentPrice: null,
      inStock: null,
      lastChecked: null
    }
    products.value.push(newProduct)
  }

  const removeProduct = (id: string) => {
    products.value = products.value.filter(p => p.id !== id)
  }

  const updateProduct = (id: string, data: Partial<Product>) => {
    const product = products.value.find(p => p.id === id)
    if (product) {
      Object.assign(product, data)
    }
  }

  // Computed properties
  const affordableProducts = computed(() => {
    return products.value.filter(p =>
      p.inStock && p.currentPrice && p.currentPrice <= p.targetPrice
    )
  })

  const recentlyAdded = computed(() => {
    return products.value.slice(-3).reverse()
  })

  return {
    products,
    addProduct,
    removeProduct,
    updateProduct,
    saveToLocalStorage,
    affordableProducts,
    recentlyAdded
  }
})