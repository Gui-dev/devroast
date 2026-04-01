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
    'java',
    'csharp',
    'cpp',
    'php',
    'ruby',
    'go',
    'rust',
    'swift',
    'kotlin',
    'html',
    'css',
    'sql',
    'bash',
    'json',
    'yaml',
    'c',
    'markdown',
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

export const IssueResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  severity: z.enum(['critical', 'warning', 'good']),
  issueType: z.string(),
  lineNumber: z.number().nullable(),
})

export const DiffResponseSchema = z.object({
  id: z.string(),
  removedLine: z.string().nullable(),
  addedLine: z.string().nullable(),
  context: z.string().nullable(),
  lineNumber: z.number().nullable(),
})

export const RoastFullResponseSchema = RoastResponseSchema.extend({
  issues: z.array(IssueResponseSchema),
  diffs: z.array(DiffResponseSchema),
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
    code: z.string(),
    lineCount: z.number(),
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
export type IssueResponse = z.infer<typeof IssueResponseSchema>
export type DiffResponse = z.infer<typeof DiffResponseSchema>
export type RoastFullResponse = z.infer<typeof RoastFullResponseSchema>
