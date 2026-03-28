import type {
  AnalysisIssueContract,
  CodeDiffContract,
  RoastContract,
} from '../contracts/roast.contract.js'
import type { Roast } from '../entities/roast.entity.js'
import type { OllamaClient } from '../lib/ollama-client.js'

export class AnalyzeRoastUseCase {
  constructor(
    private readonly ollamaClient: OllamaClient,
    private readonly roastRepository: RoastContract,
    private readonly analysisIssueRepository: AnalysisIssueContract,
    private readonly codeDiffRepository: CodeDiffContract
  ) {}

  async execute(
    roastId: string,
    code: string,
    language: string,
    roastMode: string
  ): Promise<Roast> {
    const response = await this.ollamaClient.analyze(
      code,
      language,
      roastMode as 'honest' | 'roast'
    )

    const verdict = this.getVerdict(response.score)

    const updatedRoast = await this.roastRepository.update(roastId, {
      score: response.score,
      verdict,
      roastQuote: response.roastQuote,
      suggestedFix: response.suggestedFix,
    })

    if (!updatedRoast) {
      throw new Error(`Roast not found: ${roastId}`)
    }

    await Promise.all([
      ...response.issues.map(issue =>
        this.analysisIssueRepository.create(roastId, {
          title: issue.title,
          description: issue.description,
          severity: issue.severity,
          issueType: issue.issueType,
        })
      ),
      ...(response.suggestedFix
        ? [
            this.codeDiffRepository.create(roastId, {
              context: response.suggestedFix,
            }),
          ]
        : []),
    ])

    return updatedRoast
  }

  private getVerdict(score: number): string {
    if (score >= 8) return 'good'
    if (score >= 5) return 'warning'
    if (score >= 3) return 'critical'
    return 'needs_serious_help'
  }
}
