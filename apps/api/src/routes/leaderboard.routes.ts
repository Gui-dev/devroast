import type { FastifyInstance } from 'fastify'
import type { LeaderboardContract } from '../contracts/roast.contract.js'
import { GetWorstRoastsUseCase } from '../use-cases/get-worst-roasts.use-case.js'
import { WorstRoastResponseSchema } from './schemas.js'

export function leaderboardRoutes(
  fastify: FastifyInstance,
  { repository }: { repository: LeaderboardContract }
) {
  fastify.get(
    '/leaderboard/worst',
    {
      schema: {
        tags: ['Leaderboard'],
        description: 'Get worst 3 roasts (lowest scores)',
        response: {
          200: WorstRoastResponseSchema,
        },
      },
    },
    async () => {
      const useCase = new GetWorstRoastsUseCase(repository)
      const roasts = await useCase.execute()

      return roasts.map(roast => ({
        ...roast,
        updatedAt:
          roast.updatedAt instanceof Date ? roast.updatedAt.toISOString() : roast.updatedAt,
      }))
    }
  )
}
