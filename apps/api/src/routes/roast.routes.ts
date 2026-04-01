import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import type {
  AnalysisIssueContract,
  CodeDiffContract,
  RoastContract,
} from '../contracts/roast.contract.js'
import type { CreateRoastInput } from '../entities/roast.entity.js'
import { CreateRoastUseCase } from '../use-cases/create-roast.use-case.js'
import { GetRoastUseCase } from '../use-cases/get-roast.use-case.js'
import { ListRoastsUseCase } from '../use-cases/list-roasts.use-case.js'
import {
  CreateRoastBodySchema,
  GetRoastParamsSchema,
  ListRoastsQuerySchema,
  RoastFullResponseSchema,
  RoastResponseSchema,
} from './schemas.js'

export function roastRoutes(
  fastify: FastifyInstance,
  {
    repository,
    analysisIssueRepository,
    codeDiffRepository,
  }: {
    repository: RoastContract
    analysisIssueRepository: AnalysisIssueContract
    codeDiffRepository: CodeDiffContract
  }
) {
  const ollamaClient = fastify.ollamaClient
  fastify.post<{ Body: CreateRoastInput }>(
    '/roasts',
    {
      schema: {
        body: CreateRoastBodySchema,
        response: {
          201: RoastResponseSchema,
        },
        tags: ['Roasts'],
        description: 'Create a new roast',
      },
    },
    async (request, reply) => {
      try {
        const useCase = new CreateRoastUseCase(
          repository,
          ollamaClient,
          analysisIssueRepository,
          codeDiffRepository
        )
        const roast = await useCase.execute(request.body)

        const response = {
          ...roast,
          createdAt: roast.createdAt.toISOString(),
          updatedAt: roast.updatedAt.toISOString(),
        }

        return reply.code(201).send(response)
      } catch (error) {
        if (error instanceof Error && error.message === 'Code is required') {
          return reply.code(400).send({ error: error.message })
        }
        throw error
      }
    }
  )

  fastify.get<{ Params: { id: string } }>(
    '/roasts/:id',
    {
      schema: {
        params: GetRoastParamsSchema,
        response: {
          200: RoastFullResponseSchema,
          404: z.object({ error: z.string() }),
        },
        tags: ['Roasts'],
        description: 'Get a roast by ID',
      },
    },
    async (request, reply) => {
      const { roast, issues, diffs } = await repository.findByIdWithRelations(request.params.id)

      if (!roast) {
        return reply.code(404).send({ error: 'Roast not found' })
      }

      return {
        ...roast,
        createdAt: roast.createdAt.toISOString(),
        updatedAt: roast.updatedAt.toISOString(),
        issues,
        diffs,
      }
    }
  )

  fastify.get<{ Querystring: { limit?: number } }>(
    '/roasts',
    {
      schema: {
        querystring: ListRoastsQuerySchema,
        response: {
          200: z.array(RoastResponseSchema),
        },
        tags: ['Roasts'],
        description: 'List all roasts',
      },
    },
    async request => {
      const useCase = new ListRoastsUseCase(repository)
      const roasts = await useCase.execute(request.query.limit)

      return roasts.map(roast => ({
        ...roast,
        createdAt: roast.createdAt.toISOString(),
        updatedAt: roast.updatedAt.toISOString(),
      }))
    }
  )
}
