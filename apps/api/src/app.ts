import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import Fastify from 'fastify'
import {
  type ZodTypeProvider,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { OllamaClient } from './lib/ollama-client.js'
import { AnalysisIssueRepository } from './repositories/analysis-issue.repository.js'
import { CodeDiffRepository } from './repositories/code-diff.repository.js'
import { LeaderboardRepository } from './repositories/leaderboard.repository.js'
import { RoastRepository } from './repositories/roast.repository.js'
import { healthRoutes } from './routes/health.routes.js'
import { leaderboardRoutes } from './routes/leaderboard.routes.js'
import { metricsRoutes } from './routes/metrics.routes.js'
import { roastRoutes } from './routes/roast.routes.js'

export async function buildApp() {
  const fastify = Fastify({
    logger: true,
    requestTimeout: 300000,
  }).withTypeProvider<ZodTypeProvider>()

  fastify.setValidatorCompiler(validatorCompiler)
  fastify.setSerializerCompiler(serializerCompiler)

  await fastify.register(cors, {
    origin: true,
  })

  await fastify.register(swagger, {
    openapi: {
      info: {
        title: 'Devroast API',
        description: 'API for code roasting and analysis',
        version: '0.1.0',
      },
      servers: [
        {
          url: 'http://localhost:3333',
          description: 'Development server',
        },
      ],
      tags: [
        { name: 'Health', description: 'Health check endpoints' },
        { name: 'Roasts', description: 'Roast management endpoints' },
        { name: 'Leaderboard', description: 'Leaderboard endpoints' },
      ],
    },
    transform: jsonSchemaTransform,
  })

  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
    },
  })

  const roastRepository = new RoastRepository()
  const analysisIssueRepository = new AnalysisIssueRepository()
  const codeDiffRepository = new CodeDiffRepository()
  const ollamaClient = new OllamaClient(
    process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434',
    process.env.OLLAMA_MODEL ?? 'qwen2.5-coder:1.5b'
  )
  const leaderboardRepository = new LeaderboardRepository()

  await fastify.register(healthRoutes)
  await fastify.register(roastRoutes, {
    repository: roastRepository,
    analysisIssueRepository: analysisIssueRepository,
    codeDiffRepository: codeDiffRepository,
    ollamaClient: ollamaClient,
  })
  await fastify.register(metricsRoutes, { repository: roastRepository })
  await fastify.register(leaderboardRoutes, { repository: leaderboardRepository })

  return fastify
}
