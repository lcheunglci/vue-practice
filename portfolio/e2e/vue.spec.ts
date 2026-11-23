import { test, expect } from '@playwright/test'

test('visits the app root url', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toHaveText('Software Developer')
  await expect(page.locator('p')).toHaveText('Direct. Focused. Committed to growth.')
})