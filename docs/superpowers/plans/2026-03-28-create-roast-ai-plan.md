# Create Roast AI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar análise de código via Ollama ao criar roasts

**Architecture:** API faz chamada síncrona ao Ollama após criar roast no banco, atualiza com resultado (quote, issues, diff, score, verdict). Frontend usa mutation para submeter código e redireciona para página de detalhe.

**Tech Stack:** Fastify (API), Next.js (Frontend), TanStack Query, Ollama (qwen2.5-coder:1.5b)

---

### Task 1: Criar OllamaClient

**Files:**
- Create: `apps/api/src/lib/ollama-client.ts`
- Test: `apps/api/src/lib/ollama-client.test.ts`

- [ ] **Step 1: Write failing test**

```typescript
// apps/api/src/lib/ollama-client.test.ts
import { describe, it, expect, vi } from 'vitest'

describe('OllamaClient', () => {
  it('should call Ollama API and return parsed response', async () => {
    const mockResponse = {
      message: {
        content: JSON.stringify({
          roastQuote: 'Test quote',
          issues: [{ title: 'Test issue', description: 'Test', severity: 'warning', issueType: 'bad-practice' }],
          suggestedFix: 'diff content',
          score: 5.0
        })
      }
    }
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    })

    const { OllamaClient } = await import('./ollama-client')
    const client = new OllamaClient()
    const result = await client.analyze('const x = 1', 'javascript', 'roast')

    expect(result.roastQuote).toBe('Test quote')
    expect(result.score).toBe(5.0)
  })

  it('should throw error when Ollama unavailable', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Connection refused'))

    const { OllamaClient } = await import('./ollama-client')
    const client = new OllamaClient()

    await expect(client.analyze('code', 'javascript', 'roast'))
      .rejects.toThrow('Ollama unavailable')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter api test apps/api/src/lib/ollama-client.test.ts`
Expected: FAIL with "Cannot find module './ollama-client'"

- [ ] **Step 3: Write minimal implementation**

```typescript
// apps/api/src/lib/ollama-client.ts
export interface AnalyzeResult {
  roastQuote: string
  issues: Array<{
    title: string
    description: string
    severity: 'critical' | 'warning' | 'good'
    issueType: string
  }>
  suggestedFix: string
  score: number
}

export class OllamaClient {
  private baseUrl: string
  private model: string

  constructor() {
    this.baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
    this.model = process.env.OLLAMA_MODEL || 'qwen2.5-coder:1.5b'
  }

  async analyze(code: string, language: string, roastMode: 'honest' | 'roast'): Promise<AnalyzeResult> {
    const prompt = this.buildPrompt(code, language, roastMode)

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt,
          stream: false,
        }),
        signal: AbortSignal.timeout(60000),
      })

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`)
      }

      const data = await response.json()
      const content = data.message?.content || ''

      const parsed = JSON.parse(content)
      return parsed
    } catch (error) {
      if (error instanceof Error && error.name === 'TimeoutError') {
        throw new Error('Ollama timeout - model took too long')
      }
      throw new Error('Ollama unavailable')
    }
  }

  private buildPrompt(code: string, language: string, roastMode: 'honest' | 'roast'): string {
    const tone = roastMode === 'roast'
      ? 'Be brutally honest and sarcastic. Use developer humor.'
      : 'Provide constructive feedback, be friendly and helpful.'

    return `Analyze this ${language} code and provide a JSON response with:
1. "roastQuote": A ${roastMode === 'roast' ? 'roasting quote (1-2 sentences, funny/sarcastic' : 'constructive feedback quote (1-2 sentences, friendly'} about the code quality)
2. "issues": Array of issues, each with:
   - "title": Short descriptive title
   - "description": Detailed explanation
   - "severity": "critical" | "warning" | "good"
   - "issueType": Type of issue (e.g., "bad-practice", "security", "performance")
3. "suggestedFix": Unified diff format showing improvements
4. "score": Number from 0-10 rating the code quality

${tone}
Respond ONLY with valid JSON, no explanations.

Code to analyze:
---
${code}
---`
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter api test apps/api/src/lib/ollama-client.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/lib/ollama-client.ts apps/api/src/lib/ollama-client.test.ts
git commit -m "feat: add OllamaClient for code analysis"
```

---

### Task 2: Modificar CreateRoastUseCase para incluir análise

**Files:**
- Modify: `apps/api/src/use-cases/create-roast.use-case.ts`
- Test: `apps/api/src/use-cases/create-roast.use-case.test.ts`

- [ ] **Step 1: Write failing test**

```typescript
// apps/api/src/use-cases/create-roast.use-case.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CreateRoastUseCase } from './create-roast.use-case'
import type { RoastContract } from '../contracts/roast.contract'

describe('CreateRoastUseCase', () => {
  let mockRepository: RoastContract
  let mockOllamaClient: any
  let useCase: CreateRoastUseCase

  beforeEach(() => {
    mockRepository = {
      create: vi.fn().mockResolvedValue({
        id: 'test-id',
        code: 'const x = 1',
        language: 'javascript',
        lineCount: 1,
        score: 0,
        verdict: 'pending',
        roastMode: 'roast',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      findById: vi.fn().mockResolvedValue({
        id: 'test-id',
        code: 'const x = 1',
        language: 'javascript',
        lineCount: 1,
        score: 7.5,
        verdict: 'warning',
        roastQuote: 'Nice try!',
        suggestedFix: 'diff here',
        roastMode: 'roast',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      findAll: vi.fn(),
      update: vi.fn().mockResolvedValue({
        id: 'test-id',
        code: 'const x = 1',
        language: 'javascript',
        lineCount: 1,
        score: 7.5,
        verdict: 'warning',
        roastQuote: 'Nice try!',
        suggestedFix: 'diff here',
        roastMode: 'roast',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      delete: vi.fn(),
      getMetrics: vi.fn(),
    }

    mockOllamaClient = {
      analyze: vi.fn().mockResolvedValue({
        roastQuote: 'Nice try!',
        issues: [{ title: 'Test', description: 'Test', severity: 'warning', issueType: 'bad-practice' }],
        suggestedFix: 'diff here',
        score: 7.5,
      }),
    }

    useCase = new CreateRoastUseCase(mockRepository, mockOllamaClient)
  })

  it('should call Ollama after creating roast', async () => {
    await useCase.execute({
      code: 'const x = 1',
      language: 'javascript',
      roastMode: 'roast',
    })

    expect(mockOllamaClient.analyze).toHaveBeenCalledWith('const x = 1', 'javascript', 'roast')
  })

  it('should update roast with AI analysis result', async () => {
    await useCase.execute({
      code: 'const x = 1',
      language: 'javascript',
      roastMode: 'roast',
    })

    expect(mockRepository.update).toHaveBeenCalledWith('test-id', {
      score: 7.5,
      verdict: 'warning',
      roastQuote: 'Nice try!',
      suggestedFix: 'diff here',
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter api test apps/api/src/use-cases/create-roast.use-case.test.ts`
Expected: FAIL - "Cannot read properties of undefined (reading 'analyze')"

- [ ] **Step 3: Write minimal implementation**

```typescript
// apps/api/src/use-cases/create-roast.use-case.ts
import type { RoastContract } from '../contracts/roast.contract.js'
import type { CreateRoastInput, Roast } from '../entities/roast.entity.js'
import { OllamaClient } from '../lib/ollama-client.js'

export class CreateRoastUseCase {
  private readonly ollamaClient: OllamaClient

  constructor(
    private readonly repository: RoastContract,
    ollamaClient?: OllamaClient
  ) {
    this.ollamaClient = ollamaClient || new OllamaClient()
  }

  async execute(input: CreateRoastInput): Promise<Roast> {
    if (!input.code || input.code.trim().length === 0) {
      throw new Error('Code is required')
    }

    if (!input.language) {
      throw new Error('Language is required')
    }

    const roast = await this.repository.create({
      ...input,
      code: input.code.trim(),
    })

    try {
      const analysis = await this.ollamaClient.analyze(
        input.code,
        input.language,
        (input.roastMode as 'honest' | 'roast') || 'roast'
      )

      const verdict = this.scoreToVerdict(analysis.score)

      const updated = await this.repository.update(roast.id, {
        score: analysis.score,
        verdict,
        roastQuote: analysis.roastQuote,
        suggestedFix: analysis.suggestedFix,
      })

      return updated
    } catch (error) {
      console.error('AI analysis failed:', error)
      return roast
    }
  }

  private scoreToVerdict(score: number): string {
    if (score <= 3) return 'needs_serious_help'
    if (score <= 5) return 'warning'
    if (score <= 7) return 'good'
    return 'good'
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter api test apps/api/src/use-cases/create-roast.use-case.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/use-cases/create-roast.use-case.ts apps/api/src/use-cases/create-roast.use-case.test.ts
git commit -m "feat: integrate Ollama analysis in CreateRoastUseCase"
```

---

### Task 3: Atualizar roast routes para passar ollamaClient

**Files:**
- Modify: `apps/api/src/routes/roast.routes.ts`
- Modify: `apps/api/src/app.ts` (registrar ollamaClient)

- [ ] **Step 1: Write failing test - check current route behavior**

Run: `pnpm --filter api test apps/api/src/routes/roast.routes.test.ts 2>/dev/null || echo "No route tests yet"`
Expected: Shows if tests exist or not

- [ ] **Step 2: Modify app.ts to register OllamaClient**

```typescript
// apps/api/src/app.ts - add near other plugin registrations
import { OllamaClient } from './lib/ollama-client.js'

// After repositories are registered
fastify.decorate('ollamaClient', new OllamaClient())
```

- [ ] **Step 3: Modify roast routes to use ollamaClient**

```typescript
// apps/api/src/routes/roast.routes.ts - modify plugin function
export function roastRoutes(
  fastify: FastifyInstance,
  { repository }: { repository: RoastContract }
) {
  const ollamaClient = fastify.ollamaClient

  fastify.post<{ Body: CreateRoastInput }>(
    '/roasts',
    {
      schema: {
        body: CreateRoastBodySchema,
        response: {
          201: RoastResponseSchema,
        },
        tags: ['Roasts'],
        description: 'Create a new roast',
      },
    },
    async (request, reply) => {
      try {
        const useCase = new CreateRoastUseCase(repository, ollamaClient)
        const roast = await useCase.execute(request.body)

        const response = {
          ...roast,
          createdAt: roast.createdAt.toISOString(),
          updatedAt: roast.updatedAt.toISOString(),
        }

        return reply.code(201).send(response)
      } catch (error) {
        if (error instanceof Error && error.message === 'Code is required') {
          return reply.code(400).send({ error: error.message })
        }
        throw error
      }
    }
  )
  // ... rest of routes unchanged
}
```

- [ ] **Step 4: Run API to verify no errors**

Run: `pnpm --filter api dev &` then test with curl
Expected: API starts without errors

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/routes/roast.routes.ts apps/api/src/app.ts
git commit -m "feat: integrate OllamaClient in roast routes"
```

---

### Task 4: Adicionar variáveis de ambiente

**Files:**
- Modify: `apps/api/.env`
- Modify: `apps/api/.env.example`

- [ ] **Step 1: Add env vars**

```bash
# apps/api/.env - add at end
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5-coder:1.5b
```

- [ ] **Step 2: Update .env.example**

```bash
# apps/api/.env.example - add at end
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5-coder:1.5b
```

- [ ] **Step 3: Commit**

```bash
git add apps/api/.env apps/api/.env.example
git commit -m "feat: add Ollama env configuration"
```

---

### Task 5: Criar useCreateRoast hook no frontend

**Files:**
- Create: `apps/web/src/app/hooks/use-create-roast.ts`
- Test: `apps/web/src/app/hooks/use-create-roast.spec.ts`

- [ ] **Step 1: Write failing test**

```typescript
// apps/web/src/app/hooks/use-create-roast.spec.ts
import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCreateRoast } from './use-create-roast'
import * as nextNavigation from 'next/navigation'

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
}))

describe('useCreateRoast', () => {
  it('should call API with correct payload', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'test-id', code: 'const x = 1' }),
    })

    const { result } = renderHook(() => useCreateRoast())
    
    await act(async () => {
      await result.current.mutateAsync({
        code: 'const x = 1',
        language: 'javascript',
        roastMode: 'roast',
      })
    })

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3333/roasts',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          code: 'const x = 1',
          language: 'javascript',
          roastMode: 'roast',
        }),
      })
    )
  })

  it('should redirect on success', async () => {
    const mockPush = vi.fn()
    vi.spyOn(nextNavigation, 'useRouter').mockImplementation(() => ({ push: mockPush }))

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'test-id-123' }),
    })

    const { result } = renderHook(() => useCreateRoast())
    
    await act(async () => {
      await result.current.mutateAsync({
        code: 'const x = 1',
        language: 'javascript',
        roastMode: 'roast',
      })
    })

    expect(mockPush).toHaveBeenCalledWith('/roast/test-id-123')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter web test apps/web/src/app/hooks/use-create-roast.spec.ts`
Expected: FAIL - "Cannot find module './use-create-roast'"

- [ ] **Step 3: Write minimal implementation**

```typescript
// apps/web/src/app/hooks/use-create-roast.ts
'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

interface CreateRoastInput {
  code: string
  language: string
  roastMode: 'honest' | 'roast'
}

export function useCreateRoast() {
  const router = useRouter()
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'

  return useMutation({
    mutationFn: async (input: CreateRoastInput) => {
      const res = await fetch(`${baseUrl}/roasts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (!res.ok) throw new Error('Failed to create roast')
      return res.json()
    },
    onSuccess: (data: { id: string }) => {
      router.push(`/roast/${data.id}`)
    },
  })
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter web test apps/web/src/app/hooks/use-create-roast.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/app/hooks/use-create-roast.ts apps/web/src/app/hooks/use-create-roast.spec.ts
git commit -m "feat: add useCreateRoast hook"
```

---

### Task 6: Conectar home-client ao useCreateRoast

**Files:**
- Modify: `apps/web/src/components/home-client.tsx`

- [ ] **Step 1: Read current home-client.tsx**

```bash
cat apps/web/src/components/home-client.tsx
```

- [ ] **Step 2: Add useState from toggle**

```typescript
// Modify imports and component
import { useState } from 'react'
import { useCreateRoast } from '@/app/hooks/use-create-roast'

export function HomeClient() {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState<string | null>(null)
  const [isOverLimit, setIsOverLimit] = useState(false)
  const [isRoastMode, setIsRoastMode] = useState(true) // Default on

  const createRoast = useCreateRoast()

  const handleCodeChange = (newCode: string) => {
    setCode(newCode)
  }

  const handleLimitExceeded = (exceeded: boolean) => {
    setIsOverLimit(exceeded)
  }

  const handleSubmit = () => {
    if (!code || !language) return
    createRoast.mutate({
      code,
      language,
      roastMode: isRoastMode ? 'roast' : 'honest',
    })
  }
```

- [ ] **Step 3: Update JSX to wire it all together**

Update the Toggle and Button:
```typescript
<Toggle 
  label="roast mode" 
  defaultPressed={isRoastMode}
  onPressedChange={setIsRoastMode} 
/>

<Button 
  disabled={!code || !language || isOverLimit || createRoast.isPending}
  onClick={handleSubmit}
>
  {createRoast.isPending ? '$ roasting...' : '$ roast_my_code'}
</Button>
```

- [ ] **Step 4: Run build to verify no errors**

Run: `pnpm --filter web build`
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/components/home-client.tsx
git commit -m "feat: connect home-client to useCreateRoast"
```

---

### Task 7: Atualizar página de detalhe para buscar dados da API

**Files:**
- Modify: `apps/web/src/app/roast/[id]/page.tsx`
- Create: `apps/web/src/app/hooks/use-roast.ts`

- [ ] **Step 1: Create fetch hook**

```typescript
// apps/web/src/app/hooks/use-roast.ts
export async function fetchRoast(id: string): Promise<Roast> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333'
  const response = await fetch(`${baseUrl}/roasts/${id}`)
  if (!response.ok) throw new Error('Failed to fetch roast')
  return response.json()
}
```

- [ ] **Step 2: Update roast page to fetch real data**

Replace hardcoded `roastData` with actual fetch. Note: This is a Server Component so it can fetch directly.

The current page has mock data hardcoded. We need to fetch real data:
```typescript
export default async function RoastPage({ params }: RoastPageProps) {
  const { id } = await params
  const roastData = await fetchRoast(id)
  // ... rest uses roastData instead of hardcoded
}
```

- [ ] **Step 3: Run build and verify**

Run: `pnpm --filter web build`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/app/hooks/use-roast.ts apps/web/src/app/roast/\[id\]/page.tsx
git commit -m "feat: fetch real roast data in detail page"
```

---

### Task 8: Teste de integração completo (E2E)

**Files:**
- Manual test

- [ ] **Step 1: Start Ollama**

```bash
ollama serve
```

- [ ] **Step 2: Start API**

```bash
pnpm --filter api dev
```

- [ ] **Step 3: Start Frontend**

```bash
pnpm --filter web dev
```

- [ ] **Step 4: Test flow**

1. Go to http://localhost:3000
2. Paste some code (e.g., `var x = 1`)
3. Toggle roast mode on
4. Click "roast_my_code"
5. Wait for analysis (~10-30s)
6. Should redirect to /roast/{id}
7. Should show quote, issues, and suggested fix

- [ ] **Step 5: Verify data in database**

```bash
psql -h localhost -U root -d devroast -c "SELECT * FROM roasts ORDER BY createdAt DESC LIMIT 1;"
```

---

## исполнение

**Plan complete and saved to `docs/superpowers/plans/2026-03-28-create-roast-ai-plan.md`. Two execution options:**

1. **Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

2. **Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**