import type { FastifyInstance } from 'fastify'
import type { LeaderboardContract } from '../contracts/roast.contract.js'
import { GetWorstRoastsUseCase } from '../use-cases/get-worst-roasts.use-case.js'

const worstRoastsSchema = {
  response: {
    200: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          roastId: { type: 'string' },
          rank: { type: 'number' },
          score: { type: 'number' },
          language: { type: 'string' },
          codePreview: { type: 'string' },
          updatedAt: { type: 'string' },
        },
      },
    },
  },
}

export function leaderboardRoutes(
  fastify: FastifyInstance,
  { repository }: { repository: LeaderboardContract }
) {
  fastify.get(
    '/leaderboard/worst',
    {
      schema: {
        ...worstRoastsSchema,
        tags: ['Leaderboard'],
        description: 'Get worst 3 roasts (lowest scores)',
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
