export interface PricePoint {
  /** ISO timestamp of when the price was recorded */
  date: string
  price: number
}

export interface Product {
  id: string
  name: string
  store: string
  url: string
  /** Desired price the user wants to pay */
  targetPrice: number
  /** Simulated base/list price used by the mock data source */
  basePrice: number
  currentPrice: number | null
  /** Original (pre-discount) price used to compute the discount */
  originalPrice: number | null
  inStock: boolean | null
  /** ISO timestamp of the last successful check */
  lastChecked: string | null
  priceHistory: PricePoint[]
  createdAt: string
  notes?: string
}

export interface ProductForm {
  name: string
  store: string
  url: string
  targetPrice: number
  notes?: string
}

export type AlertType = 'in-stock' | 'price-drop'

export interface Alert {
  id: string
  productId: string
  productName: string
  type: AlertType
  message: string
  createdAt: string
  read: boolean
}

export interface Quote {
  price: number
  originalPrice: number
  inStock: boolean
}
