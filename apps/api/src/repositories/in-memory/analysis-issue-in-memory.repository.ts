import type {
  AnalysisIssueContract,
  CreateAnalysisIssueInput,
} from '../../contracts/roast.contract.js'
import type { AnalysisIssue } from '../../entities/roast.entity.js'

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
