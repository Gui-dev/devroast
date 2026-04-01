import type { RoastContract } from '../contracts/roast.contract.js'
import type { AnalysisIssueContract, CodeDiffContract } from '../contracts/roast.contract.js'
import type { CreateRoastInput, Roast } from '../entities/roast.entity.js'
import type { OllamaClientInterface } from '../lib/ollama-client.js'

export class CreateRoastUseCase {
  constructor(
    private readonly repository: RoastContract,
    private readonly ollamaClient?: OllamaClientInterface,
    private readonly analysisIssueRepository?: AnalysisIssueContract,
    private readonly codeDiffRepository?: CodeDiffContract
  ) {}

  async execute(input: CreateRoastInput): Promise<Roast> {
    if (!input.code || input.code.trim().length === 0) {
      throw new Error('Code is required')
    }

    if (!input.language) {
      throw new Error('Language is required')
    }

    const roast = await this.repository.create({
      ...input,
      code: input.code.trim(),
    })

    if (this.ollamaClient) {
      try {
        const analysis = await this.ollamaClient.analyze(
          roast.code,
          roast.language,
          (input.roastMode ?? 'roast') as 'honest' | 'roast'
        )

        if (this.analysisIssueRepository) {
          for (const issue of analysis.issues) {
            await this.analysisIssueRepository.create(roast.id, {
              title: issue.title,
              description: issue.description,
              severity: issue.severity,
              issueType: issue.issueType,
            })
          }
        }

        const updated = await this.repository.update(roast.id, {
          score: analysis.score,
          verdict: this.scoreToVerdict(analysis.score),
          roastQuote: analysis.roastQuote,
          suggestedFix: analysis.suggestedFix,
        })

        if (updated) return updated
      } catch (error) {
        console.error('AI analysis failed:', error)
      }
    }

    return roast
  }

  scoreToVerdict(score: number): string {
    if (score <= 3) return 'needs_serious_help'
    if (score <= 5) return 'warning'
    return 'good'
  }
}
