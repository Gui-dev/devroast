import { expect, test } from '@playwright/test'

test('homepage loads and displays main content', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('h1')).toContainText('paste your code')
  await expect(page.locator('h1')).toContainText('get roasted')

  await expect(page.locator('button:has-text("$ roast_my_code")')).toBeVisible()
})

test('leaderboard displays worst roasts', async ({ page }) => {
  await page.goto('/leaderboard')

  await expect(page.locator('h1')).toContainText('shame_leaderboard')

  await expect(page.locator('text=lang:')).toBeVisible()
})
