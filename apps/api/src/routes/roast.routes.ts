import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import type { RoastContract } from '../contracts/roast.contract.js'
import type {
  CreateRoastInput,
  ProgrammingLanguage,
  Roast,
  RoastMode,
  Verdict,
} from '../entities/roast.entity.js'
import { CreateRoastUseCase } from '../use-cases/create-roast.use-case.js'
import { GetRoastUseCase } from '../use-cases/get-roast.use-case.js'
import { ListRoastsUseCase } from '../use-cases/list-roasts.use-case.js'

const createRoastSchema = {
  body: {
    type: 'object',
    required: ['code', 'language'],
    properties: {
      userId: { type: 'string' },
      code: { type: 'string', minLength: 1 },
      language: {
        type: 'string',
        enum: [
          'javascript',
          'typescript',
          'python',
          'go',
          'rust',
          'java',
          'cpp',
          'css',
          'html',
          'json',
        ],
      },
      roastMode: {
        type: 'string',
        enum: ['honest', 'roast'],
        default: 'roast',
      },
    },
  },
  response: {
    201: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        userId: { type: ['string', 'null'] },
        code: { type: 'string' },
        language: { type: 'string' },
        lineCount: { type: 'number' },
        score: { type: 'number' },
        verdict: { type: 'string' },
        roastQuote: { type: ['string', 'null'] },
        roastMode: { type: 'string' },
        suggestedFix: { type: ['string', 'null'] },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
      },
    },
  },
}

const getRoastSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        userId: { type: ['string', 'null'] },
        code: { type: 'string' },
        language: { type: 'string' },
        lineCount: { type: 'number' },
        score: { type: 'number' },
        verdict: { type: 'string' },
        roastQuote: { type: ['string', 'null'] },
        roastMode: { type: 'string' },
        suggestedFix: { type: ['string', 'null'] },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
      },
    },
    404: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
}

const listRoastsSchema = {
  querystring: {
    type: 'object',
    properties: {
      limit: { type: 'number', minimum: 1, maximum: 100, default: 10 },
    },
  },
  response: {
    200: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          userId: { type: ['string', 'null'] },
          code: { type: 'string' },
          language: { type: 'string' },
          lineCount: { type: 'number' },
          score: { type: 'number' },
          verdict: { type: 'string' },
          roastQuote: { type: ['string', 'null'] },
          roastMode: { type: 'string' },
          suggestedFix: { type: ['string', 'null'] },
          createdAt: { type: 'string' },
          updatedAt: { type: 'string' },
        },
      },
    },
  },
}

export function roastRoutes(
  fastify: FastifyInstance,
  { repository }: { repository: RoastContract }
) {
  fastify.post<{ Body: CreateRoastInput }>(
    '/roasts',
    {
      schema: {
        ...createRoastSchema,
        tags: ['Roasts'],
        description: 'Create a new roast',
      },
    },
    async (request, reply) => {
      try {
        const useCase = new CreateRoastUseCase(repository)
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
        ...getRoastSchema,
        tags: ['Roasts'],
        description: 'Get a roast by ID',
      },
    },
    async (request, reply) => {
      const useCase = new GetRoastUseCase(repository)
      const roast = await useCase.execute(request.params.id)

      if (!roast) {
        return reply.code(404).send({ error: 'Roast not found' })
      }

      return {
        ...roast,
        createdAt: roast.createdAt.toISOString(),
        updatedAt: roast.updatedAt.toISOString(),
      }
    }
  )

  fastify.get<{ Querystring: { limit?: number } }>(
    '/roasts',
    {
      schema: {
        ...listRoastsSchema,
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
