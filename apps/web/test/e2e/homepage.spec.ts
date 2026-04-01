import { expect, test } from '@playwright/test'

test('homepage loads and displays main content', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('h1')).toContainText('paste your code')
  await expect(page.locator('h1')).toContainText('get roasted')

  await expect(page.locator('button:has-text("$ roast_my_code")')).toBeVisible()
})

test('creates a roast and redirects to detail page', async ({ page }) => {
  await page.goto('/')

  const textarea = page.locator('textarea')
  await textarea.fill('console.log("test");')

  const select = page.locator('select').first()
  await select.selectOption('javascript')

  await page.click('button:has-text("$ roast_my_code")')

  await page.waitForURL(/\/roast\/[\w-]+/, { timeout: 30000 })

  await expect(page.locator('text=verdict:')).toBeVisible()
})

test('leaderboard displays worst roasts', async ({ page }) => {
  await page.goto('/leaderboard')

  await expect(page.locator('h1')).toContainText('shame_leaderboard')

  await expect(page.locator('text=lang:')).toBeVisible()
})
