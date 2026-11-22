import { test, expect } from '@playwright/test'

test('shows the empty watchlist and loads demo data', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Watchlist' })).toBeVisible()
  await expect(page.getByText('No products yet')).toBeVisible()

  await page.getByRole('button', { name: /load demo data/i }).click()

  // The mock service has a small artificial delay per product.
  await expect(page.getByText('Sony WH-1000XM5 Headphones')).toBeVisible({ timeout: 15000 })
})

test('can navigate to the about page', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'About' }).click()
  await expect(page.getByRole('heading', { name: 'About Stock Tracker' })).toBeVisible()
})

test('removes a product and can undo', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /load demo data/i }).click()
  await expect(page.getByText('Apple AirPods Pro')).toBeVisible({ timeout: 15000 })

  const row = page.getByRole('row', { name: /Apple AirPods Pro/ })
  await row.getByRole('button', { name: 'Remove product' }).click()

  await expect(page.getByText(/Removed/)).toBeVisible()
  await expect(page.getByRole('row', { name: /Apple AirPods Pro/ })).toHaveCount(0)

  await page.getByRole('button', { name: 'Undo' }).click()
  await expect(page.getByRole('row', { name: /Apple AirPods Pro/ })).toBeVisible()
})

