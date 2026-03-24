import type { FastifyInstance } from 'fastify'
import type { RoastContract } from '../contracts/roast.contract.js'
import { GetMetricsUseCase } from '../use-cases/get-metrics.use-case.js'
import { MetricsResponseSchema } from './schemas.js'

export function metricsRoutes(
  fastify: FastifyInstance,
  { repository }: { repository: RoastContract }
) {
  fastify.get(
    '/metrics',
    {
      schema: {
        tags: ['Metrics'],
        description: 'Get global metrics',
        response: {
          200: MetricsResponseSchema,
        },
      },
    },
    async () => {
      const useCase = new GetMetricsUseCase(repository)
      const metrics = await useCase.execute()
      return metrics
    }
  )
}
