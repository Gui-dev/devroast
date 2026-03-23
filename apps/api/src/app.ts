import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import Fastify from 'fastify'
import { RoastRepository } from './repositories/roast.repository.js'
import { healthRoutes } from './routes/health.routes.js'
import { metricsRoutes } from './routes/metrics.routes.js'
import { roastRoutes } from './routes/roast.routes.js'

export async function buildApp() {
  const fastify = Fastify({
    logger: true,
  })

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
      ],
    },
  })

  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
    },
  })

  const repository = new RoastRepository()

  await fastify.register(healthRoutes)
  await fastify.register(roastRoutes, { repository })
  await fastify.register(metricsRoutes, { repository })

  return fastify
}
