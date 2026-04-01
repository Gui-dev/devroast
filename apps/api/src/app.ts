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
import type { OllamaClientInterface } from './lib/ollama-client.js'
import { OllamaClient } from './lib/ollama-client.js'
import { AnalysisIssueRepository } from './repositories/analysis-issue.repository.js'
import { CodeDiffRepository } from './repositories/code-diff.repository.js'
import { LeaderboardRepository } from './repositories/leaderboard.repository.js'
import { RoastRepository } from './repositories/roast.repository.js'
import { healthRoutes } from './routes/health.routes.js'
import { leaderboardRoutes } from './routes/leaderboard.routes.js'
import { metricsRoutes } from './routes/metrics.routes.js'
import { roastRoutes } from './routes/roast.routes.js'

declare module 'fastify' {
  interface FastifyInstance {
    ollamaClient: OllamaClientInterface
  }
}

interface BuildAppOptions {
  repository?: RoastRepository
  analysisIssueRepository?: AnalysisIssueRepository
  codeDiffRepository?: CodeDiffRepository
  leaderboardRepository?: LeaderboardRepository
  ollamaClient?: OllamaClientInterface
}

export async function buildApp(options: BuildAppOptions = {}) {
  const fastify = Fastify({
    logger: true,
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

  const roastRepository = options.repository ?? new RoastRepository()
  const leaderboardRepository = options.leaderboardRepository ?? new LeaderboardRepository()
  const analysisIssueRepository = options.analysisIssueRepository ?? new AnalysisIssueRepository()
  const codeDiffRepository = options.codeDiffRepository ?? new CodeDiffRepository()
  const ollamaClient = options.ollamaClient ?? new OllamaClient()

  fastify.decorate('ollamaClient', ollamaClient)

  await fastify.register(healthRoutes)
  await fastify.register(roastRoutes, {
    repository: roastRepository,
    analysisIssueRepository,
    codeDiffRepository,
  })
  await fastify.register(metricsRoutes, { repository: roastRepository })
  await fastify.register(leaderboardRoutes, { repository: leaderboardRepository })

  return fastify
}
