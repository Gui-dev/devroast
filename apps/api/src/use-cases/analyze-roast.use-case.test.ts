import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Roast } from '../entities/roast.entity.js'
import type { OllamaClient } from '../lib/ollama-client.ts'
import { InMemoryAnalysisIssueRepository } from '../repositories/in-memory/analysis-issue-in-memory.repository'
import { InMemoryCodeDiffRepository } from '../repositories/in-memory/code-diff-in-memory.repository'
import { InMemoryRoastRepository } from '../repositories/in-memory/roast-in-memory.repository'
import { AnalyzeRoastUseCase } from './analyze-roast.use-case'

describe('AnalyzeRoastUseCase', () => {
  let mockOllamaClient: Partial<OllamaClient>
  let repository: InMemoryRoastRepository
  let analysisIssueRepository: InMemoryAnalysisIssueRepository
  let codeDiffRepository: InMemoryCodeDiffRepository
  let useCase: AnalyzeRoastUseCase
  let testRoastId: string

  beforeEach(async () => {
    mockOllamaClient = {
      analyzeCode: vi.fn(),
    }

    repository = new InMemoryRoastRepository()
    analysisIssueRepository = new InMemoryAnalysisIssueRepository()
    codeDiffRepository = new InMemoryCodeDiffRepository()
    useCase = new AnalyzeRoastUseCase(
      repository,
      analysisIssueRepository,
      codeDiffRepository,
      mockOllamaClient as OllamaClient
    )

    // Create a test roast
    const roast = await repository.create({
      code: 'const x = 1;',
      language: 'javascript',
      roastMode: 'roast',
    })

    testRoastId = roast.id
  })

  it('should analyze a roast and update it with results', async () => {
    mockOllamaClient.analyzeCode = vi.fn().mockResolvedValue({
      roastQuote: 'This code is a masterpiece of confusion',
      issues: [
        {
          title: 'Unused variable',
          description: "Variable 'x' is declared but never used",
          severity: 'warning' as const,
          issueType: 'bad-practice' as const,
        },
      ],
      suggestedFix: 'const x = 1;\n- console.log(x);\n+ // Removed unused variable',
      score: 3,
    })

    const updatedRoast = await useCase.execute(testRoastId)

    expect(updatedRoast.id).toBe(testRoastId)
    expect(updatedRoast.score).toBe(3)
    expect(updatedRoast.verdict).toBe('warning')
    expect(updatedRoast.roastQuote).toBe('This code is a masterpiece of confusion')
    expect(updatedRoast.suggestedFix).toBe(
      'const x = 1;\n- console.log(x);\n+ // Removed unused variable'
    )

    expect(mockOllamaClient.analyzeCode).toHaveBeenCalledWith('const x = 1;', 'javascript', 'roast')

    // Check that analysis issue was created
    const issues = await analysisIssueRepository.findByRoastId(testRoastId)
    expect(issues.length).toBeGreaterThan(0)

    // Check that code diffs were created
    const diffs = await codeDiffRepository.findByRoastId(testRoastId)
    expect(diffs.length).toBeGreaterThan(0)
  })

  it('should handle analysis errors gracefully', async () => {
    mockOllamaClient.analyzeCode = vi
      .fn()
      .mockRejectedValue(new Error('Ollama service unavailable'))

    await expect(useCase.execute(testRoastId)).rejects.toThrow('Ollama service unavailable')

    // Check that the roast was updated with error state
    const roast = await repository.findById(testRoastId)
    expect(roast?.verdict).toBe('error')
    expect(roast?.roastQuote).toBe('Analysis failed')

    // Check that error issue was created
    const issues = await analysisIssueRepository.findByRoastId(testRoastId)
    expect(issues.length).toBeGreaterThan(0)
    expect(issues[issues.length - 1].title).toBe('Analysis failed')
  })

  it('should throw error when roast is not found', async () => {
    await expect(useCase.execute('non-existent-id')).rejects.toThrow('Roast not found')
  })
})
