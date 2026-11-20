import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'

// Make the mock data source deterministic and instant so tests stay fast.
vi.mock('@/services/mockStore', () => ({
  basePriceFor: () => 100,
  fetchQuote: vi.fn<() => Promise<{ price: number; originalPrice: number; inStock: boolean }>>(
    async () => ({ price: 80, originalPrice: 100, inStock: true }),
  ),
}))

import { useWatchlistStore } from '../watchlist'

describe('watchlist store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('adds a product and records an initial quote', async () => {
    const store = useWatchlistStore()

    const product = await store.addProduct({
      name: 'Test headphones',
      store: 'Amazon',
      url: 'https://example.com/product',
      targetPrice: 90,
    })

    expect(store.products).toHaveLength(1)
    expect(product.currentPrice).toBe(80)
    expect(product.inStock).toBe(true)
    expect(product.priceHistory).toHaveLength(1)
    expect(product.lastChecked).not.toBeNull()
  })

  it('creates a price-drop alert when the price is at or below target', async () => {
    const store = useWatchlistStore()

    await store.addProduct({
      name: 'Deal item',
      store: 'Target',
      url: 'https://example.com/deal',
      targetPrice: 85,
    })

    expect(store.alerts).toHaveLength(1)
    expect(store.alerts[0]!.type).toBe('price-drop')
    expect(store.unreadAlertCount).toBe(1)
  })

  it('updates and removes products', async () => {
    const store = useWatchlistStore()
    const product = await store.addProduct({
      name: 'Original name',
      store: 'Best Buy',
      url: 'https://example.com/x',
      targetPrice: 100,
    })

    store.updateProduct(product.id, { name: 'New name', targetPrice: 50 })
    expect(store.products[0]!.name).toBe('New name')
    expect(store.products[0]!.targetPrice).toBe(50)

    store.removeProduct(product.id)
    expect(store.products).toHaveLength(0)
  })

  it('persists products to localStorage', async () => {
    const store = useWatchlistStore()
    await store.addProduct({
      name: 'Persisted',
      store: 'Walmart',
      url: 'https://example.com/persist',
      targetPrice: 10,
    })
    await nextTick()

    const raw = localStorage.getItem('stock-tracker-v1')
    expect(raw).toBeTruthy()
    expect(JSON.parse(raw!)).toMatchObject({ products: [{ name: 'Persisted' }] })
  })
})
