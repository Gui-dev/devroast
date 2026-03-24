import { z } from 'zod'

export const HealthResponseSchema = z.object({
  status: z.string(),
  timestamp: z.string(),
})

export const MetricsResponseSchema = z.object({
  totalRoasts: z.number(),
  avgScore: z.number(),
})

export const CreateRoastBodySchema = z.object({
  userId: z.string().optional(),
  code: z.string().min(1),
  language: z.enum([
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
  ]),
  roastMode: z.enum(['honest', 'roast']).default('roast'),
})

export const RoastResponseSchema = z.object({
  id: z.string(),
  userId: z.string().nullable(),
  code: z.string(),
  language: z.string(),
  lineCount: z.number(),
  score: z.number(),
  verdict: z.string(),
  roastQuote: z.string().nullable(),
  roastMode: z.string(),
  suggestedFix: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const GetRoastParamsSchema = z.object({
  id: z.string(),
})

export const ListRoastsQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(10).optional(),
})

export const WorstRoastResponseSchema = z.array(
  z.object({
    id: z.string(),
    roastId: z.string(),
    rank: z.number(),
    score: z.number(),
    language: z.string(),
    codePreview: z.string(),
    updatedAt: z.string(),
  })
)

export type HealthResponse = z.infer<typeof HealthResponseSchema>
export type MetricsResponse = z.infer<typeof MetricsResponseSchema>
export type CreateRoastBody = z.infer<typeof CreateRoastBodySchema>
export type RoastResponse = z.infer<typeof RoastResponseSchema>
export type GetRoastParams = z.infer<typeof GetRoastParamsSchema>
export type ListRoastsQuery = z.infer<typeof ListRoastsQuerySchema>
export type WorstRoast = z.infer<typeof WorstRoastResponseSchema>
