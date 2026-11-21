import type { Product, Quote } from '@/types'

/**
 * Mock data source.
 *
 * In a real app this module would call a backend that scrapes the stores
 * (Amazon, Best Buy, Target, Walmart, ...) or talks to an official API.
 * Browsers cannot scrape those sites directly because of CORS, so a backend
 * is required for real data. For now we simulate realistic responses so the
 * whole UI and logic can be built and tested end to end.
 *
 * Swapping in a real backend later only requires replacing `fetchQuote`.
 */

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** Small deterministic hash so each URL gets a stable starting price. */
export function hashString(input: string): number {
  let hash = 2166136261
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return Math.abs(hash)
}

export function round2(value: number): number {
  return Math.round(value * 100) / 100
}

/** Pick a plausible starting/list price for a newly added product. */
export function basePriceFor(url: string, name: string, targetPrice?: number): number {
  const seed = hashString(`${url}|${name}`)
  if (targetPrice && targetPrice > 0) {
    // Anchor the list price 15% - 55% above the target so drops are meaningful.
    return round2(targetPrice * (1.15 + (seed % 40) / 100))
  }
  // Fallback: range roughly $20 - $500, with cents
  return round2(20 + (seed % 48000) / 100)
}

/**
 * Simulate checking a store for the current price / stock of a product.
 * Prices wander a little around the product's base price on every check.
 */
export async function fetchQuote(product: Product): Promise<Quote> {
  // Simulate network latency so loading states are visible.
  await sleep(250 + Math.random() * 550)

  const base =
    product.basePrice > 0
      ? product.basePrice
      : basePriceFor(product.url, product.name, product.targetPrice)
  // Random walk roughly between -12% and +10% of the base price.
  const drift = (Math.random() - 0.55) * 0.22
  const price = round2(Math.max(3, base * (1 + drift)))

  // Roughly half the time the product is discounted from its list price.
  const onSale = Math.random() > 0.45
  const markup = 0.05 + Math.random() * 0.4
  const originalPrice = onSale ? round2(price * (1 + markup)) : price

  // Most products are in stock, but some are not.
  const inStock = Math.random() > 0.22

  return { price, originalPrice, inStock }
}
