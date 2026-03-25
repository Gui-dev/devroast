export const programmingLanguages = [
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
] as const

export type ProgrammingLanguage = (typeof programmingLanguages)[number]

export const verdicts = ['critical', 'warning', 'good', 'needs_serious_help'] as const

export type Verdict = (typeof verdicts)[number]

export const roastModes = ['honest', 'roast'] as const

export type RoastMode = (typeof roastModes)[number]

export interface Roast {
  id: string
  userId: string | null
  code: string
  language: string
  lineCount: number
  score: number
  verdict: string
  roastQuote: string | null
  roastMode: string
  suggestedFix: string | null
  createdAt: Date
  updatedAt: Date
}

export interface AnalysisIssue {
  id: string
  roastId: string
  title: string
  description: string
  severity: string
  issueType: string
  lineNumber: number | null
  createdAt: Date
}

export interface CodeDiff {
  id: string
  roastId: string
  removedLine: string | null
  addedLine: string | null
  context: string | null
  lineNumber: number | null
  createdAt: Date
}

export interface LeaderboardEntry {
  id: string
  roastId: string
  rank: number
  score: number
  language: string
  codePreview: string
  code: string
  lineCount: number
  updatedAt: Date
}

export interface CreateRoastInput {
  userId?: string
  code: string
  language: string
  roastMode?: string
}

export interface UpdateRoastInput {
  score?: number
  verdict?: string
  roastQuote?: string
  suggestedFix?: string
}
