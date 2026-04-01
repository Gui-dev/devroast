import { expect, test } from '@playwright/test'

test('can create a roast and view result', async ({ page }) => {
  await page.goto('/')

  await page.waitForSelector('textarea')

  const codeEditor = page.locator('textarea').first()
  await codeEditor.fill('const x = 1')

  await page.click('button:has-text("$ roast_my_code")')

  await page.waitForURL(/\/roast\/.*/)
})
