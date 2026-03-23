import type { FastifyInstance } from 'fastify'
import type { RoastContract } from '../contracts/roast.contract.js'
import { GetMetricsUseCase } from '../use-cases/get-metrics.use-case.js'

const metricsSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        totalRoasts: { type: 'number' },
        avgScore: { type: 'number' },
      },
    },
  },
}

export function metricsRoutes(
  fastify: FastifyInstance,
  { repository }: { repository: RoastContract }
) {
  fastify.get(
    '/metrics',
    {
      schema: {
        ...metricsSchema,
        tags: ['Metrics'],
        description: 'Get global metrics',
      },
    },
    async () => {
      try {
        const useCase = new GetMetricsUseCase(repository)
        const metrics = await useCase.execute()
        return metrics
      } catch (error) {
        fastify.log.error(error)
        throw error
      }
    }
  )
}
