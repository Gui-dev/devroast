# API E2E Tests Design

## Overview

Add integration tests for API endpoints using supertest with in-memory repositories.

## Motivation

The API currently has unit tests for use-cases but no integration tests that test the HTTP layer end-to-end. E2E tests will ensure the routes work correctly with real HTTP requests.

## Architecture

```
apps/api/src/
├── routes/
│   ├── roast.routes.ts
│   ├── roast.routes.e2e.test.ts    ← NEW
│   ├── metrics.routes.ts
│   ├── metrics.routes.e2e.test.ts  ← NEW
│   ├── leaderboard.routes.ts
│   ├── leaderboard.routes.e2e.test.ts ← NEW
│   └── health.routes.ts
├── repositories/in-memory/
│   └── ... (existing)
└── test/
    └── helpers/
        └── build-test-app.ts       ← NEW
```

## Dependencies

Add to `apps/api/package.json`:
- `supertest` - HTTP client for testing
- `@types/supertest` - TypeScript types

## Test Helper

Create `apps/api/src/test/helpers/build-test-app.ts`:
- Builds Fastify app with in-memory repositories
- Exports function to create app for each test file
- Reuses existing in-memory repositories

## Test Coverage

### roast.routes.e2e.test.ts
- POST /roasts - create roast with valid code
- POST /roasts - create roast with empty code (400 validation)
- GET /roasts - list roasts with limit
- GET /roasts/:id - get existing roast
- GET /roasts/:id - get non-existent roast (404)

### metrics.routes.e2e.test.ts
- GET /metrics - return metrics with data
- GET /metrics - return metrics with empty database

### leaderboard.routes.e2e.test.ts
- GET /leaderboard/worst - return worst roasts
- GET /leaderboard - return full leaderboard

## Test Patterns

Each test file follows this pattern:
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import supertest from 'supertest'
import { buildTestApp } from '../../test/helpers/build-test-app.js'

describe('roast routes', () => {
  let app: FastifyInstance
  let request: supertest.SuperTest<supertest.Test>

  beforeEach(async () => {
    app = await buildTestApp()
    request = supertest(app.server)
  })

  it('should create a roast', async () => {
    const response = await request
      .post('/roasts')
      .send({ code: 'const x = 1', language: 'javascript' })
      .expect(201)
    // assertions...
  })
})
```

## Execution

Run tests with:
```bash
pnpm --filter api test
```

## Considerations

- In-memory repositories isolate tests from database
- Each test gets fresh repositories (no data pollution)
- Tests are fast (no DB connection needed)
- supertest handles HTTP layer without starting real server
