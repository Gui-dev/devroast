import type { RoastContract } from '../contracts/roast.contract.js'
import type { AnalysisIssueContract } from '../contracts/roast.contract.js'
import type { CodeDiffContract } from '../contracts/roast.contract.js'
import type { AnalysisIssue, CodeDiff, Roast } from '../entities/roast.entity.js'

export interface RoastFull {
  roast: Roast
  issues: AnalysisIssue[]
  diffs: CodeDiff[]
}

export class GetRoastFullUseCase {
  constructor(
    private readonly repository: RoastContract,
    private readonly analysisIssueRepository: AnalysisIssueContract,
    private readonly codeDiffRepository: CodeDiffContract
  ) {}

  async execute(id: string): Promise<RoastFull | null> {
    const roast = await this.repository.findById(id)

    if (!roast) {
      return null
    }

    const [issues, diffs] = await Promise.all([
      this.analysisIssueRepository.findByRoastId(id),
      this.codeDiffRepository.findByRoastId(id),
    ])

    return { roast, issues, diffs }
  }
}
