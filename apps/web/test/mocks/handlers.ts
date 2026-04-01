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

export const handlers = [metricsHandler, worstLeaderboardHandler, leaderboardHandler, healthHandler]
