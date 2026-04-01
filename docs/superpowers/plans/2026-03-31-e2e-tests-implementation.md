# E2E Tests Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement end-to-end tests using Playwright and MSW to cover user flows in the Devroast application.

**Architecture:** Tests run on the same `localhost:3000` as the frontend - MSW intercepts HTTP requests in the browser via Service Worker, no URL conflicts.

**Tech Stack:** Playwright (test runner), MSW (HTTP mocking), Vitest (existing unit tests)

---

### Task 1: Install Dependencies

**Files:**
- Modify: `apps/web/package.json`

- [ ] **Step 1: Add Playwright and MSW dependencies**

Run in `apps/web/`:

```bash
pnpm add -D @playwright/test msw
```

- [ ] **Step 2: Add e2e test scripts to package.json**

```json
"test:e2e": "playwright test",
"test:e2e:ui": "playwright test --ui",
"test:e2e:headed": "playwright test --headed",
"test:e2e:debug": "playwright test --debug"
```

- [ ] **Step 3: Install Playwright browsers**

```bash
pnpm exec playwright install chromium
```

---

### Task 2: Generate MSW Service Worker

**Files:**
- Create: `apps/web/public/mockServiceWorker.js`

- [ ] **Step 1: Generate MSW service worker**

Run in `apps/web/`:

```bash
npx msw init public/ --save
```

This creates `public/mockServiceWorker.js` that MSW needs to intercept requests.

---

### Task 3: Create Playwright Configuration

**Files:**
- Create: `apps/web/playwright.config.ts`

- [ ] **Step 1: Write Playwright config**

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './test/e2e',
  testMatch: /.*\.spec\.ts$/,
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
})
```

---

### Task 4: Create Test Setup and MSW

**Files:**
- Create: `apps/web/test/mocks/handlers.ts`
- Create: `apps/web/test/mocks/browser.ts`
- Create: `apps/web/test/setup.ts`

- [ ] **Step 1: Write MSW handlers** (`apps/web/test/mocks/handlers.ts`)

```typescript
import { http, HttpResponse } from 'msw'

export const handlers = [
  // POST /roasts - Create roast
  http.post('http://localhost:3333/roasts', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({
      id: 'test-roast-id',
      code: body.code,
      language: body.language,
      lineCount: body.code.split('\n').length,
      score: 5,
      verdict: 'warning',
      roastQuote: 'This code needs work',
      roastMode: body.roastMode || 'roast',
      suggestedFix: null,
      userId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }),

  // GET /roasts/:id
  http.get('http://localhost:3333/roasts/:id', ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      code: 'const x = 1;',
      language: 'javascript',
      lineCount: 1,
      score: 5,
      verdict: 'warning',
      roastQuote: 'This code needs work',
      roastMode: 'roast',
      suggestedFix: null,
      userId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      issues: [
        {
          id: '1',
          title: 'Unused variable',
          description: 'Variable x is declared but never used',
          severity: 'warning',
          issueType: 'bad-practice',
          lineNumber: 1,
        },
      ],
      diffs: [],
    })
  }),

  // GET /leaderboard/worst
  http.get('http://localhost:3333/leaderboard/worst', () => {
    return HttpResponse.json([
      {
        id: '1',
        roastId: 'roast-1',
        rank: 1,
        score: 1.2,
        language: 'javascript',
        codePreview: 'var x = ',
        code: 'var x = 1;',
        lineCount: 1,
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        roastId: 'roast-2',
        rank: 2,
        score: 2.5,
        language: 'python',
        codePreview: 'print(',
        code: 'print(x)',
        lineCount: 1,
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        roastId: 'roast-3',
        rank: 3,
        score: 3.0,
        language: 'typescript',
        codePreview: 'const ',
        code: 'const y = 2;',
        lineCount: 1,
        updatedAt: new Date().toISOString(),
      },
    ])
  }),

  // GET /metrics
  http.get('http://localhost:3333/metrics', () => {
    return HttpResponse.json({
      totalRoasts: 100,
      avgScore: 5.5,
    })
  }),
]
```

- [ ] **Step 2: Write MSW browser setup** (`apps/web/test/mocks/browser.ts`)

```typescript
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)
```

- [ ] **Step 3: Write Playwright setup** (`apps/web/test/setup.ts`)

```typescript
import { beforeAll } from '@playwright/test'
import { worker } from './mocks/browser'

beforeAll(async () => {
  await worker.start({
    onUnhandledRequest: 'bypass',
  })
})
```

---

### Task 5: Create E2E Tests

**Files:**
- Create: `apps/web/test/e2e/homepage.spec.ts`
- Create: `apps/web/test/e2e/create-roast.spec.ts`
- Create: `apps/web/test/e2e/roast-detail.spec.ts`
- Create: `apps/web/test/e2e/leaderboard.spec.ts`

- [ ] **Step 1: Write homepage test** (`apps/web/test/e2e/homepage.spec.ts`)

```typescript
import { test, expect } from '@playwright/test'

test('homepage loads and displays metrics', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/Devroast/)

  await expect(page.locator('h1')).toContainText('Roast Your Code')
})
```

- [ ] **Step 2: Write create-roast test** (`apps/web/test/e2e/create-roast.spec.ts`)

```typescript
import { test, expect } from '@playwright/test'

test('creates a roast and redirects to detail page', async ({ page }) => {
  await page.goto('/')

  const codeEditor = page.locator('textarea').first()
  await codeEditor.fill('const x = 1;')

  const languageSelect = page.locator('select').first()
  await languageSelect.selectOption('javascript')

  await page.click('button[type="submit"]')

  await expect(page).toHaveURL(/\/roast\/[\w-]+/)

  await expect(page.locator('[data-testid="score"]')).toBeVisible()
})
```

- [ ] **Step 3: Write roast-detail test** (`apps/web/test/e2e/roast-detail.spec.ts`)

```typescript
import { test, expect } from '@playwright/test'

test('displays roast with issues and suggested fix', async ({ page }) => {
  await page.goto('/roast/test-roast-id')

  await expect(page.locator('[data-testid="score"]')).toHaveText('5')
  await expect(page.locator('[data-testid="verdict"]')).toHaveText('warning')

  await expect(page.locator('[data-testid="issues"]')).toContainText('Unused variable')
})
```

- [ ] **Step 4: Write leaderboard test** (`apps/web/test/e2e/leaderboard.spec.ts`)

```typescript
import { test, expect } from '@playwright/test'

test('displays worst roasts ranked', async ({ page }) => {
  await page.goto('/leaderboard')

  const rows = page.locator('tbody tr')
  await expect(rows).toHaveCount(3)

  await expect(rows.first()).toContainText('1')
  await expect(rows.first()).toContainText('1.2')
})
```

---

### Task 6: Run and Verify Tests

**Files:**
- Test: `apps/web/test/e2e/*.spec.ts`

- [ ] **Step 1: Run e2e tests in headless mode**

```bash
pnpm --filter web test:e2e
```

Expected: All tests should pass with MSW intercepting API calls.

- [ ] **Step 2: Verify with UI mode**

```bash
pnpm --filter web test:e2e:ui
```

This opens Playwright UI for debugging if needed.

---

### Task 7: Update Turbo Configuration

**Files:**
- Modify: `turbo.json`

- [ ] **Step 1: Add e2e task to turbo.json**

Add a new task to run e2e tests via turbo:

```json
{
  "tasks": {
    "test:e2e": {
      "dependsOn": ["build"],
      "inputs": ["$WEB/src", "$WEB/test"],
      "outputs": []
    }
  }
}
```

---

## Summary

| Task | Files Created/Modified |
|------|------------------------|
| Task 1 | `apps/web/package.json` |
| Task 2 | `apps/web/public/mockServiceWorker.js` |
| Task 3 | `apps/web/playwright.config.ts` |
| Task 4 | `apps/web/test/mocks/handlers.ts`, `browser.ts`, `setup.ts` |
| Task 5 | `apps/web/test/e2e/homepage.spec.ts`, `create-roast.spec.ts`, `roast-detail.spec.ts`, `leaderboard.spec.ts` |
| Task 6 | Test execution |
| Task 7 | `turbo.json` |
