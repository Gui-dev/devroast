import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import type { RoastContract } from '../contracts/roast.contract.js'
import type { AnalysisIssueContract } from '../contracts/roast.contract.js'
import type { CodeDiffContract } from '../contracts/roast.contract.js'
import type { CreateRoastInput } from '../entities/roast.entity.js'
import type { OllamaClient } from '../lib/ollama-client.js'
import { CreateRoastUseCase } from '../use-cases/create-roast.use-case.js'
import { GetRoastFullUseCase } from '../use-cases/get-roast-full.use-case.js'
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
    ollamaClient,
  }: {
    repository: RoastContract
    analysisIssueRepository: AnalysisIssueContract
    codeDiffRepository: CodeDiffContract
    ollamaClient: OllamaClient
  }
) {
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
          analysisIssueRepository,
          codeDiffRepository,
          ollamaClient
        )
        const roast = await useCase.execute(request.body)

        const response = {
          ...roast,
          createdAt:
            typeof roast.createdAt === 'string' ? roast.createdAt : roast.createdAt.toISOString(),
          updatedAt:
            typeof roast.updatedAt === 'string' ? roast.updatedAt : roast.updatedAt.toISOString(),
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
        description: 'Get a roast by ID with issues and diffs',
      },
    },
    async (request, reply) => {
      const useCase = new GetRoastFullUseCase(
        repository,
        analysisIssueRepository,
        codeDiffRepository
      )
      const result = await useCase.execute(request.params.id)

      if (!result) {
        return reply.code(404).send({ error: 'Roast not found' })
      }

      const { roast, issues, diffs } = result

      return {
        ...roast,
        createdAt:
          typeof roast.createdAt === 'string' ? roast.createdAt : roast.createdAt.toISOString(),
        updatedAt:
          typeof roast.updatedAt === 'string' ? roast.updatedAt : roast.updatedAt.toISOString(),
        issues: issues.map(issue => ({
          id: issue.id,
          title: issue.title,
          description: issue.description,
          severity: issue.severity,
          issueType: issue.issueType,
          lineNumber: issue.lineNumber,
        })),
        diffs: diffs.map(diff => ({
          id: diff.id,
          removedLine: diff.removedLine,
          addedLine: diff.addedLine,
          context: diff.context,
          lineNumber: diff.lineNumber,
        })),
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
        createdAt:
          typeof roast.createdAt === 'string' ? roast.createdAt : roast.createdAt.toISOString(),
        updatedAt:
          typeof roast.updatedAt === 'string' ? roast.updatedAt : roast.updatedAt.toISOString(),
      }))
    }
  )
}
