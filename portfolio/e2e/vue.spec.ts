import { test, expect } from '@playwright/test'

test('visits the app root url', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toHaveText('Software Developer')
  await expect(page.getByText('Direct. Focused. Committed to growth.')).toBeVisible()
})

test('shows a 404 page for unknown routes', async ({ page }) => {
  await page.goto('/this-route-does-not-exist')
  await expect(page.locator('h1')).toHaveText('404')
})