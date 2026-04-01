# API E2E Tests Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add integration tests for API endpoints using supertest with in-memory repositories

**Architecture:** Create test helper to build Fastify app with in-memory repositories, then use supertest to make HTTP requests to test routes

**Tech Stack:** supertest, vitest, in-memory repositories

---

### Task 1: Install supertest dependency

**Files:**
- Modify: `apps/api/package.json`

- [ ] **Step 1: Add supertest and @types/supertest to devDependencies**

```json
"supertest": "^7.0.0",
"@types/supertest": "^6.0.0",
```

Run: `cd apps/api && pnpm install`

- [ ] **Step 2: Commit**

```bash
cd apps/api && git add package.json pnpm-lock.yaml && git commit -m "chore(api): add supertest for e2e tests"
```

---

### Task 2: Create test helper

**Files:**
- Create: `apps/api/src/test/helpers/build-test-app.ts`

- [ ] **Step 1: Create directory and file**

```bash
mkdir -p apps/api/src/test/helpers
```

- [ ] **Step 2: Write build-test-app.ts**

```typescript
import Fastify from 'fastify'
import { buildApp } from '../../app.js'
import { InMemoryRoastRepository } from '../../repositories/in-memory/roast-in-memory.repository.js'
import { InMemoryAnalysisIssueRepository } from '../../repositories/in-memory/analysis-issue-in-memory.repository.js'
import { InMemoryCodeDiffRepository } from '../../repositories/in-memory/code-diff-in-memory.repository.js'

export async function buildTestApp() {
  const roastRepository = new InMemoryRoastRepository()
  const analysisIssueRepository = new InMemoryAnalysisIssueRepository()
  const codeDiffRepository = new InMemoryCodeDiffRepository()

  const app = await buildApp({
    repository: roastRepository,
    analysisIssueRepository,
    codeDiffRepository,
  })

  return app
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/api/src/test/helpers/build-test-app.ts && git commit -m "test(api): add build-test-app helper for e2e tests"
```

---

### Task 3: Create roast routes e2e tests

**Files:**
- Create: `apps/api/src/routes/roast.routes.e2e.test.ts`

- [ ] **Step 1: Create test file with all test cases**

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import type { FastifyInstance } from 'fastify'
import supertest from 'supertest'
import { buildTestApp } from '../../test/helpers/build-test-app.js'

describe('roast routes', () => {
  let app: FastifyInstance
  let request: supertest.SuperTest<supertest.Test>

  beforeEach(async () => {
    app = await buildTestApp()
    request = supertest(app.server)
  })

  describe('POST /roasts', () => {
    it('should create a roast with valid code', async () => {
      const response = await request
        .post('/roasts')
        .send({ code: 'const x = 1', language: 'javascript' })
        .expect(201)

      expect(response.body).toHaveProperty('id')
      expect(response.body.code).toBe('const x = 1')
      expect(response.body.language).toBe('javascript')
    })

    it('should return 400 for empty code', async () => {
      const response = await request
        .post('/roasts')
        .send({ code: '', language: 'javascript' })
        .expect(400)

      expect(response.body).toHaveProperty('error')
    })
  })

  describe('GET /roasts', () => {
    it('should list roasts with limit', async () => {
      await request
        .post('/roasts')
        .send({ code: 'const x = 1', language: 'javascript' })

      const response = await request
        .get('/roasts')
        .query({ limit: 10 })
        .expect(200)

      expect(Array.isArray(response.body)).toBe(true)
    })
  })

  describe('GET /roasts/:id', () => {
    it('should return 404 for non-existent roast', async () => {
      const response = await request
        .get('/roasts/non-existent-id')
        .expect(404)

      expect(response.body).toHaveProperty('error')
    })
  })
})
```

- [ ] **Step 2: Commit**

```bash
git add apps/api/src/routes/roast.routes.e2e.test.ts && git commit -m "test(api): add roast routes e2e tests"
```

---

### Task 4: Create metrics routes e2e tests

**Files:**
- Create: `apps/api/src/routes/metrics.routes.e2e.test.ts`

- [ ] **Step 1: Create test file**

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import type { FastifyInstance } from 'fastify'
import supertest from 'supertest'
import { buildTestApp } from '../../test/helpers/build-test-app.js'

describe('metrics routes', () => {
  let app: FastifyInstance
  let request: supertest.SuperTest<supertest.Test>

  beforeEach(async () => {
    app = await buildTestApp()
    request = supertest(app.server)
  })

  describe('GET /metrics', () => {
    it('should return metrics with empty database', async () => {
      const response = await request.get('/metrics').expect(200)

      expect(response.body).toHaveProperty('totalRoasts')
      expect(response.body).toHaveProperty('avgScore')
    })

    it('should return metrics with data', async () => {
      await request
        .post('/roasts')
        .send({ code: 'const x = 1', language: 'javascript' })

      const response = await request.get('/metrics').expect(200)

      expect(response.body.totalRoasts).toBeGreaterThan(0)
    })
  })
})
```

- [ ] **Step 2: Commit**

```bash
git add apps/api/src/routes/metrics.routes.e2e.test.ts && git commit -m "test(api): add metrics routes e2e tests"
```

---

### Task 5: Create leaderboard routes e2e tests

**Files:**
- Create: `apps/api/src/routes/leaderboard.routes.e2e.test.ts`

- [ ] **Step 1: Create test file**

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import type { FastifyInstance } from 'fastify'
import supertest from 'supertest'
import { buildTestApp } from '../../test/helpers/build-test-app.js'

describe('leaderboard routes', () => {
  let app: FastifyInstance
  let request: supertest.SuperTest<supertest.Test>

  beforeEach(async () => {
    app = await buildTestApp()
    request = supertest(app.server)
  })

  describe('GET /leaderboard/worst', () => {
    it('should return worst roasts', async () => {
      const response = await request.get('/leaderboard/worst').expect(200)

      expect(Array.isArray(response.body)).toBe(true)
    })
  })

  describe('GET /leaderboard', () => {
    it('should return full leaderboard', async () => {
      const response = await request.get('/leaderboard').expect(200)

      expect(Array.isArray(response.body)).toBe(true)
    })
  })
})
```

- [ ] **Step 2: Commit**

```bash
git add apps/api/src/routes/leaderboard.routes.e2e.test.ts && git commit -m "test(api): add leaderboard routes e2e tests"
```

---

### Task 6: Run all tests

**Files:**
- N/A

- [ ] **Step 1: Run tests to verify**

```bash
cd apps/api && pnpm test
```

Expected: All tests pass

- [ ] **Step 2: Commit final**

```bash
git push
```

---

## Plan Complete

**Spec:** `docs/superpowers/specs/2026-04-01-api-e2e-tests-design.md`

Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
