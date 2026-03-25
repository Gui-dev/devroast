import type {
  AnalysisIssueContract,
  CodeDiffContract,
  CreateAnalysisIssueInput,
  CreateCodeDiffInput,
  CreateLeaderboardEntryInput,
  LeaderboardContract,
  RoastContract,
} from '../../contracts/roast.contract.js'
import type {
  AnalysisIssue,
  CodeDiff,
  CreateRoastInput,
  LeaderboardEntry,
  Roast,
  UpdateRoastInput,
} from '../../entities/roast.entity.js'

export class InMemoryRoastRepository implements RoastContract {
  private roasts: Roast[] = []

  async create(data: CreateRoastInput): Promise<Roast> {
    const now = new Date()
    const roast: Roast = {
      id: crypto.randomUUID(),
      userId: data.userId ?? null,
      code: data.code,
      language: data.language,
      lineCount: data.code.split('\n').length,
      score: 0,
      verdict: 'warning',
      roastQuote: null,
      roastMode: data.roastMode ?? 'roast',
      suggestedFix: null,
      createdAt: now,
      updatedAt: now,
    }
    this.roasts.push(roast)
    return roast
  }

  async findById(id: string): Promise<Roast | null> {
    return this.roasts.find(r => r.id === id) ?? null
  }

  async findAll(limit?: number): Promise<Roast[]> {
    const sorted = [...this.roasts].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    return limit ? sorted.slice(0, limit) : sorted
  }

  async update(id: string, data: UpdateRoastInput): Promise<Roast | null> {
    const roast = this.roasts.find(r => r.id === id)
    if (!roast) return null

    const updated = {
      ...roast,
      ...data,
      updatedAt: new Date(),
    }
    this.roasts = this.roasts.map(r => (r.id === id ? updated : r))
    return updated
  }

  async delete(id: string): Promise<boolean> {
    const index = this.roasts.findIndex(r => r.id === id)
    if (index === -1) return false
    this.roasts.splice(index, 1)
    return true
  }

  async getMetrics(): Promise<{ totalRoasts: number; avgScore: number }> {
    const totalRoasts = this.roasts.length
    const avgScore =
      totalRoasts > 0 ? this.roasts.reduce((sum, r) => sum + r.score, 0) / totalRoasts : 0
    return {
      totalRoasts,
      avgScore: Math.round(avgScore * 10) / 10,
    }
  }
}

export class InMemoryAnalysisIssueRepository implements AnalysisIssueContract {
  private issues: AnalysisIssue[] = []

  async create(roastId: string, issue: CreateAnalysisIssueInput): Promise<AnalysisIssue> {
    const newIssue: AnalysisIssue = {
      id: crypto.randomUUID(),
      roastId,
      title: issue.title,
      description: issue.description,
      severity: issue.severity,
      issueType: issue.issueType,
      lineNumber: issue.lineNumber ?? null,
      createdAt: new Date(),
    }
    this.issues.push(newIssue)
    return newIssue
  }

  async findByRoastId(roastId: string): Promise<AnalysisIssue[]> {
    return this.issues.filter(i => i.roastId === roastId)
  }
}

export class InMemoryCodeDiffRepository implements CodeDiffContract {
  private diffs: CodeDiff[] = []

  async create(roastId: string, diff: CreateCodeDiffInput): Promise<CodeDiff> {
    const newDiff: CodeDiff = {
      id: crypto.randomUUID(),
      roastId,
      removedLine: diff.removedLine ?? null,
      addedLine: diff.addedLine ?? null,
      context: diff.context ?? null,
      lineNumber: diff.lineNumber ?? null,
      createdAt: new Date(),
    }
    this.diffs.push(newDiff)
    return newDiff
  }

  async findByRoastId(roastId: string): Promise<CodeDiff[]> {
    return this.diffs.filter(d => d.roastId === roastId)
  }
}

export class InMemoryLeaderboardRepository implements LeaderboardContract {
  private entries: LeaderboardEntry[] = []

  async create(data: CreateLeaderboardEntryInput): Promise<LeaderboardEntry> {
    const entry: LeaderboardEntry = {
      id: crypto.randomUUID(),
      roastId: data.roastId,
      rank: data.rank,
      score: data.score,
      language: data.language,
      codePreview: data.codePreview,
      code: data.codePreview,
      updatedAt: new Date(),
    }
    this.entries.push(entry)
    return entry
  }

  async getTopRoasts(limit?: number): Promise<LeaderboardEntry[]> {
    const sorted = [...this.entries].sort((a, b) => a.rank - b.rank)
    return limit ? sorted.slice(0, limit) : sorted
  }

  async getRankByRoastId(roastId: string): Promise<LeaderboardEntry | null> {
    return this.entries.find(e => e.roastId === roastId) ?? null
  }

  async getWorstRoasts(limit = 3): Promise<LeaderboardEntry[]> {
    const sorted = [...this.entries].sort((a, b) => a.score - b.score)
    return sorted.slice(0, limit)
  }
}
