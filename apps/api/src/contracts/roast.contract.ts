import type {
  AnalysisIssue,
  CodeDiff,
  CreateRoastInput,
  LeaderboardEntry,
  Roast,
  UpdateRoastInput,
} from '../entities/roast.entity.js'

export interface RoastContract {
  create(data: CreateRoastInput): Promise<Roast>
  findById(id: string): Promise<Roast | null>
  findByIdWithRelations(
    id: string
  ): Promise<{ roast: Roast | null; issues: AnalysisIssue[]; diffs: CodeDiff[] }>
  findAll(limit?: number): Promise<Roast[]>
  update(id: string, data: UpdateRoastInput): Promise<Roast | null>
  delete(id: string): Promise<boolean>
  getMetrics(): Promise<{ totalRoasts: number; avgScore: number }>
}

export interface CreateAnalysisIssueInput {
  title: string
  description: string
  severity: string
  issueType: string
  lineNumber?: number | null
}

export interface AnalysisIssueContract {
  create(roastId: string, issue: CreateAnalysisIssueInput): Promise<AnalysisIssue>
  findByRoastId(roastId: string): Promise<AnalysisIssue[]>
}

export interface CreateCodeDiffInput {
  removedLine?: string | null
  addedLine?: string | null
  context?: string | null
  lineNumber?: number | null
}

export interface CodeDiffContract {
  create(roastId: string, diff: CreateCodeDiffInput): Promise<CodeDiff>
  findByRoastId(roastId: string): Promise<CodeDiff[]>
}

export interface CreateLeaderboardEntryInput {
  roastId: string
  rank: number
  score: number
  language: string
  codePreview: string
  code: string
  lineCount: number
}

export interface LeaderboardContract {
  create(data: CreateLeaderboardEntryInput): Promise<LeaderboardEntry>
  getTopRoasts(limit?: number): Promise<LeaderboardEntry[]>
  getRankByRoastId(roastId: string): Promise<LeaderboardEntry | null>
  getWorstRoasts(limit?: number): Promise<LeaderboardEntry[]>
}
