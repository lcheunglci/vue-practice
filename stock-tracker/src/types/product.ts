export interface Product {
  id: string
  name: string
  store: string
  url: string
  targetPrice: number
  currentPrice: number | null
  inStock: boolean | null
  lastChecked: string | null
}

export interface ProductForm {
  name: string
  store: string
  url: string
  targetPrice: number
}
