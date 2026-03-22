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
  findAll(limit?: number): Promise<Roast[]>
  update(id: string, data: UpdateRoastInput): Promise<Roast | null>
  delete(id: string): Promise<boolean>
}

export interface AnalysisIssueContract {
  create(
    roastId: string,
    issue: Omit<AnalysisIssue, 'id' | 'roastId' | 'createdAt'>
  ): Promise<AnalysisIssue>
  findByRoastId(roastId: string): Promise<AnalysisIssue[]>
}

export interface CodeDiffContract {
  create(roastId: string, diff: Omit<CodeDiff, 'id' | 'roastId' | 'createdAt'>): Promise<CodeDiff>
  findByRoastId(roastId: string): Promise<CodeDiff[]>
}

export interface LeaderboardContract {
  getTopRoasts(limit?: number): Promise<LeaderboardEntry[]>
  getRankByRoastId(roastId: string): Promise<LeaderboardEntry | null>
}
