import { z } from 'zod'

export const AnalysisIssueSchema = z.object({
  title: z.string(),
  description: z.string(),
  severity: z.enum(['critical', 'warning', 'good']),
  issueType: z.string(),
})

export const AnalysisResultSchema = z.object({
  roastQuote: z.string(),
  issues: z.array(AnalysisIssueSchema),
  suggestedFix: z.string(),
  score: z.number().min(0).max(10),
})

export type AnalysisResult = z.infer<typeof AnalysisResultSchema>
export type AnalysisIssue = z.infer<typeof AnalysisIssueSchema>
