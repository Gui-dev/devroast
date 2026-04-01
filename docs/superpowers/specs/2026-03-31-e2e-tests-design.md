# E2E Tests Design - Devroast

## Overview

Implement end-to-end tests using Playwright and MSW to cover user flows and UI interactions in the Devroast application.

## Current Test Coverage

- **Unit tests (Vitest)**: 271 web + 74 API = 345 tests
- **E2E tests**: None currently

## Technology Stack

- **Playwright** — Test runner for browser automation
- **MSW (Mock Service Worker)** — HTTP mocking for API calls

## Scope

### User Flows (Priority 1)

1. **Create Roast Flow**
   - User visits homepage
   - User enters code in code editor
   - User selects language
   - User submits roast
   - User redirected to roast detail page
   - Page shows score, verdict, issues, suggested fix

2. **View Roast Detail**
   - User visits `/roast/[id]`
   - Page displays full roast data
   - OG image renders correctly

3. **Leaderboard Flow**
   - User visits leaderboard page
   - Sees worst roasts ranked

### UI Interactions (Priority 2)

- Toggle component interaction
- Code editor character count
- Expandable code in leaderboard rows

## Architecture

```
devroast/
├── apps/web/
│   ├── test/                     # E2E tests (separate from unit tests)
│   │   ├── e2e/                  # Playwright tests
│   │   │   ├── homepage.spec.ts
│   │   │   ├── create-roast.spec.ts
│   │   │   ├── roast-detail.spec.ts
│   │   │   └── leaderboard.spec.ts
│   │   ├── mocks/                # MSW handlers
│   │   │   ├── handlers.ts
│   │   │   └── browser.ts        # MSW browser setup
│   │   └── setup.ts              # Playwright setup
│   └── playwright.config.ts
```

> **Note on URL**: MSW runs in the browser as a Service Worker - no conflict with the real API. Tests run on the same `localhost:3000` as the frontend.

## Configuration

### `playwright.config.ts`

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

### MSW Setup

```typescript
// test/mocks/browser.ts
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)
```

```typescript
// test/setup.ts
import { beforeAll } from '@playwright/test'
import { worker } from './mocks/browser'

beforeAll(async () => {
  await worker.start({
    onUnhandledRequest: 'bypass',
  })
})
```

## Test Cases

### 1. Create Roast Flow (`create-roast.spec.ts`)

```typescript
test('creates a roast and redirects to detail page', async ({ page }) => {
  await page.goto('/')
  
  // Enter code
  await page.fill('[data-testid=code-editor]', 'const x = 1;')
  
  // Select language
  await page.selectOption('[data-testid=language-select]', 'javascript')
  
  // Submit
  await page.click('[data-testid=submit-button]')
  
  // Should redirect to detail page
  await expect(page).toHaveURL(/\/roast\/[\w-]+/)
  
  // Should display roast data
  await expect(page.locator('[data-testid=score]')).toBeVisible()
  await expect(page.locator('[data-testid=roast-quote]')).toBeVisible()
})
```

### 2. View Roast Detail (`roast-detail.spec.ts`)

```typescript
test('displays roast with issues and suggested fix', async ({ page }) => {
  // MSW mocks GET /roasts/:id response
  await page.goto('/roast/test-roast-id')
  
  await expect(page.locator('[data-testid=score]')).toHaveText('5.0')
  await expect(page.locator('[data-testid=verdict]')).toHaveText('warning')
  
  // Issues section
  await expect(page.locator('[data-testid=issues]')).toContainText('Unused variable')
  
  // Suggested fix
  await expect(page.locator('[data-testid=suggested-fix]')).toBeVisible()
})
```

### 3. Leaderboard (`leaderboard.spec.ts`)

```typescript
test('displays worst roasts ranked', async ({ page }) => {
  await page.goto('/leaderboard')
  
  const rows = page.locator('[data-testid=leaderboard-row]')
  await expect(rows).toHaveCount(3)
  
  // First row should have lowest score
  await expect(rows.first()).toContainText('1.')
})
```

## MSW Handlers

```typescript
// test/mocks/handlers.ts
import { http, HttpResponse } from 'msw'

export const handlers = [
  // POST /roasts - Create roast
  http.post('http://localhost:3333/roasts', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({
      id: 'test-roast-id',
      code: body.code,
      language: body.language,
      score: 5,
      verdict: 'warning',
      roastQuote: 'This code needs work',
      issues: [],
      diffs: [],
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
      issues: [{ id: '1', title: 'Unused variable', description: 'Variable x', severity: 'warning', issueType: 'bad-practice', lineNumber: null }],
      diffs: [],
    })
  }),
  
  // GET /leaderboard/worst
  http.get('http://localhost:3333/leaderboard/worst', () => {
    return HttpResponse.json([
      { rank: 1, score: 1.2, language: 'javascript', codePreview: 'var x = ', code: 'var x = 1;', lineCount: 1, roastId: '1' },
      { rank: 2, score: 2.5, language: 'python', codePreview: 'print(', code: 'print(x)', lineCount: 1, roastId: '2' },
      { rank: 3, score: 3.0, language: 'typescript', codePreview: 'const ', code: 'const y = 2;', lineCount: 1, roastId: '3' },
    ])
  }),
  
  // GET /metrics
  http.get('http://localhost:3333/metrics', () => {
    return HttpResponse.json({ totalRoasts: 100, avgScore: 5.5 })
  }),
]
```

## Dependencies

```json
{
  "devDependencies": {
    "@playwright/test": "^1.50.0",
    "msw": "^2.7.0"
  }
}
```

## Scripts

```json
{
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui",
  "test:e2e:headed": "playwright test --headed",
  "test:e2e:debug": "playwright test --debug"
}
```

## CI Integration

```yaml
- name: E2E Tests
  run: pnpm --filter web test:e2e
```

## File Changes Summary

| File | Action |
|------|--------|
| `apps/web/test/e2e/homepage.spec.ts` | Create |
| `apps/web/test/e2e/create-roast.spec.ts` | Create |
| `apps/web/test/e2e/roast-detail.spec.ts` | Create |
| `apps/web/test/e2e/leaderboard.spec.ts` | Create |
| `apps/web/test/mocks/handlers.ts` | Create |
| `apps/web/test/mocks/browser.ts` | Create |
| `apps/web/test/setup.ts` | Create |
| `apps/web/playwright.config.ts` | Create |
| `apps/web/package.json` | Modify (add deps & scripts) |
| `turbo.json` | Modify (add e2e task) |

## Testing Anti-Patterns to Avoid

- Don't test implementation details (class names, internal state)
- Don't use excessive assertions on same element
- Don't forget to handle loading states
- Don't mock internal component functions — test user-facing behavior only