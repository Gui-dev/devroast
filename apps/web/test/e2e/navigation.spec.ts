import { expect, test } from '@playwright/test'

test.describe('Navigation', () => {
  test('can navigate from homepage to leaderboard', async ({ page }) => {
    await page.goto('/')

    await page.click('text=leaderboard')

    await expect(page).toHaveURL('/leaderboard')
    await expect(page.getByRole('heading', { name: 'shame_leaderboard' })).toBeVisible()
  })

  test('can navigate from leaderboard to homepage', async ({ page }) => {
    await page.goto('/leaderboard')

    await page.click('text=devroast')

    await expect(page).toHaveURL('/')
    await expect(page.getByRole('heading', { name: 'paste your code' })).toBeVisible()
  })
})

test.describe('Homepage', () => {
  test('displays metrics', async ({ page }) => {
    await page.route('http://localhost:3333/metrics', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ totalRoasts: 999, avgScore: 7.5 }),
      })
    })

    await page.goto('/')

    await expect(page.getByText('codes roasted')).toBeVisible()
    await expect(page.getByText('avg score:')).toBeVisible()
  })
})
