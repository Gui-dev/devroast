import type { RoastContract } from '../contracts/roast.contract.js'
import type { AnalysisIssueContract } from '../contracts/roast.contract.js'
import type { CodeDiffContract } from '../contracts/roast.contract.js'
import type { CreateRoastInput, Roast, UpdateRoastInput } from '../entities/roast.entity.js'
import type { OllamaClient } from '../lib/ollama-client.ts'

export class CreateRoastUseCase {
  constructor(
    private readonly repository: RoastContract,
    private readonly analysisIssueRepository: AnalysisIssueContract,
    private readonly codeDiffRepository: CodeDiffContract,
    private readonly ollamaClient: OllamaClient
  ) {}

  async execute(input: CreateRoastInput): Promise<Roast> {
    if (!input.code || input.code.trim().length === 0) {
      throw new Error('Code is required')
    }

    if (!input.language) {
      throw new Error('Language is required')
    }

    // Create initial roast with trimmed code
    const roast = await this.repository.create({
      ...input,
      code: input.code.trim(),
    })

    // Execute analysis synchronously
    try {
      const analysis = await this.ollamaClient.analyzeCode(
        roast.code,
        roast.language,
        (input.roastMode || 'roast') as 'roast' | 'honest'
      )

      // Update roast with analysis results
      const updateData: UpdateRoastInput = {
        score: analysis.score,
        verdict: analysis.score >= 7 ? 'good' : analysis.score >= 5 ? 'warning' : 'critical',
        roastQuote: analysis.roastQuote,
        suggestedFix: analysis.suggestedFix,
      }

      const updatedRoast = await this.repository.update(roast.id, updateData)

      if (!updatedRoast) {
        throw new Error('Failed to update roast with analysis')
      }

      // Clear existing issues and diffs (in a real app, you might want to keep history)
      // For simplicity, we'll just add the new ones
      await this.analysisIssueRepository.create(roast.id, {
        title: 'Analysis completed',
        description: `Code analyzed with ${analysis.issues.length} issues found`,
        severity: 'good',
        issueType: 'info',
      })

      // Add each issue from analysis
      for (const issue of analysis.issues) {
        await this.analysisIssueRepository.create(roast.id, {
          title: issue.title,
          description: issue.description,
          severity: issue.severity,
          issueType: issue.issueType,
        })
      }

      // Parse the suggested fix and add to code diffs
      // This is a simplified parser - in production you'd want a more robust diff parser
      const lines = analysis.suggestedFix.split('\n')
      let currentLineNumber = 1

      for (const line of lines) {
        if (line.startsWith('-')) {
          // Removed line
          await this.codeDiffRepository.create(roast.id, {
            removedLine: line.substring(1),
            addedLine: null,
            context: null,
            lineNumber: currentLineNumber,
          })
        } else if (line.startsWith('+')) {
          // Added line
          await this.codeDiffRepository.create(roast.id, {
            removedLine: null,
            addedLine: line.substring(1),
            context: null,
            lineNumber: currentLineNumber,
          })
        } else if (line.startsWith(' ')) {
          // Context line
          await this.codeDiffRepository.create(roast.id, {
            removedLine: null,
            addedLine: null,
            context: line.substring(1),
            lineNumber: currentLineNumber,
          })
        } else if (!line.startsWith('@@') && line.trim() !== '') {
          // Regular line
          await this.codeDiffRepository.create(roast.id, {
            removedLine: line,
            addedLine: line,
            context: null,
            lineNumber: currentLineNumber,
          })
        }

        if (!line.startsWith('@@')) {
          currentLineNumber++
        }
      }

      return updatedRoast
    } catch (error) {
      // If analysis fails, still return the roast but with error state
      await this.repository.update(roast.id, {
        verdict: 'error',
        roastQuote: 'Analysis failed' as string,
        suggestedFix: undefined,
      })

      // Add error issue
      await this.analysisIssueRepository.create(roast.id, {
        title: 'Analysis failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        severity: 'critical',
        issueType: 'error',
      })

      throw error
    }
  }
}
