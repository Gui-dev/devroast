import { http, HttpResponse, delay } from 'msw'

export const metricsHandler = http.get('http://localhost:3333/metrics', async () => {
  await delay(100)
  return HttpResponse.json({
    totalRoasts: 42,
    avgScore: 65.5,
  })
})

export const worstLeaderboardHandler = http.get(
  'http://localhost:3333/leaderboard/worst',
  async () => {
    await delay(100)
    return HttpResponse.json([
      {
        id: '1',
        roastId: 'roast-1',
        rank: 1,
        score: 15,
        language: 'javascript',
        codePreview: 'const x = 1',
        code: 'const x = 1',
        lineCount: 1,
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
      {
        id: '2',
        roastId: 'roast-2',
        rank: 2,
        score: 25,
        language: 'typescript',
        codePreview: 'let y: number = 2',
        code: 'let y: number = 2',
        lineCount: 1,
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
      {
        id: '3',
        roastId: 'roast-3',
        rank: 3,
        score: 35,
        language: 'python',
        codePreview: 'x = 1',
        code: 'x = 1',
        lineCount: 1,
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    ])
  }
)

export const leaderboardHandler = http.get('http://localhost:3333/leaderboard', async () => {
  await delay(100)
  return HttpResponse.json([
    {
      id: '1',
      roastId: 'roast-1',
      rank: 1,
      score: 15,
      language: 'javascript',
      codePreview: 'const x = 1',
      code: 'const x = 1',
      lineCount: 1,
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: '2',
      roastId: 'roast-2',
      rank: 2,
      score: 25,
      language: 'typescript',
      codePreview: 'let y: number = 2',
      code: 'let y: number = 2',
      lineCount: 1,
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
  ])
})

export const healthHandler = http.get('http://localhost:3333/health', async () => {
  await delay(100)
  return HttpResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })
})

export const createRoastHandler = http.post('http://localhost:3333/roasts', async () => {
  await delay(100)
  return HttpResponse.json(
    {
      id: 'test-roast-id-123',
      userId: null,
      code: 'const x = 1',
      language: 'javascript',
      lineCount: 1,
      score: 42,
      verdict: 'needs_serious_help',
      roastQuote: 'Your code is a disaster',
      roastMode: 'roast',
      suggestedFix: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    { status: 201 }
  )
})

export const getRoastHandler = http.get<{ id: string }>(
  'http://localhost:3333/roasts/:id',
  async ({ params }) => {
    await delay(100)
    return HttpResponse.json({
      id: params.id,
      userId: null,
      code: 'const x = 1',
      language: 'javascript',
      lineCount: 1,
      score: 42,
      verdict: 'needs_serious_help',
      roastQuote: 'Your code is a disaster. This is absolutely terrible code.',
      roastMode: 'roast',
      suggestedFix: '--- a\n+++ b\n@@ -1 +1 @@\n-const x = 1\n+const y = 2\n',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      issues: [
        {
          id: 'issue-1',
          title: 'Naming convention violation',
          description: 'Variable "x" should use camelCase',
          severity: 'warning',
          issueType: 'naming',
          lineNumber: 1,
        },
        {
          id: 'issue-2',
          title: 'Unused variable',
          description: 'Variable "x" is declared but never used',
          severity: 'critical',
          issueType: 'unused',
          lineNumber: 1,
        },
      ],
      diffs: [
        {
          id: 'diff-1',
          removedLine: 'const x = 1',
          addedLine: null,
          context: null,
          lineNumber: 1,
        },
        {
          id: 'diff-2',
          removedLine: null,
          addedLine: 'const y = 2',
          context: null,
          lineNumber: 2,
        },
      ],
    })
  }
)

export const handlers = [
  metricsHandler,
  worstLeaderboardHandler,
  leaderboardHandler,
  healthHandler,
  createRoastHandler,
  getRoastHandler,
]
