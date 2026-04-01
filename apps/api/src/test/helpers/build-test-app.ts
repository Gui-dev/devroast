import type { FastifyInstance } from 'fastify'
import { buildApp } from '../../app.js'
import {
  InMemoryAnalysisIssueRepository,
  InMemoryCodeDiffRepository,
  InMemoryLeaderboardRepository,
  InMemoryRoastRepository,
} from '../../repositories/in-memory/roast-in-memory.repository.js'
import { InMemoryOllamaClient } from '../mocks/in-memory-ollama-client.js'

export async function buildTestApp(): Promise<FastifyInstance> {
  const roastRepository = new InMemoryRoastRepository()
  const leaderboardRepository = new InMemoryLeaderboardRepository()
  const analysisIssueRepository = new InMemoryAnalysisIssueRepository()
  const codeDiffRepository = new InMemoryCodeDiffRepository()
  const ollamaClient = new InMemoryOllamaClient()

  const app = await buildApp({
    repository: roastRepository,
    leaderboardRepository,
    analysisIssueRepository,
    codeDiffRepository,
    ollamaClient,
  })

  await app.listen({ port: 0 })

  return app
}
