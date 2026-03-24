import type { FastifyInstance } from 'fastify'
import { HealthResponseSchema } from './schemas.js'

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/health',
    {
      schema: {
        description: 'Health check endpoint',
        tags: ['Health'],
        response: {
          200: HealthResponseSchema,
        },
      },
    },
    async () => {
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
      }
    }
  )
}
