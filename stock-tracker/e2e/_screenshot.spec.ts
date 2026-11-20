import { test } from '@playwright/test'

test('capture dashboard and detail screenshots', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/')

  // Load demo data (sequential mock checks take a few seconds)
  await page.getByRole('button', { name: /load demo data/i }).click()
  await page.getByText('Sony WH-1000XM5 Headphones').waitFor({ timeout: 20000 })
  await page.waitForTimeout(500)
  await page.screenshot({ path: 'test-results/dashboard.png', fullPage: true })

  // Detail page
  await page.getByText('Sony WH-1000XM5 Headphones').click()
  await page.waitForTimeout(600)
  await page.screenshot({ path: 'test-results/detail.png', fullPage: true })
})
