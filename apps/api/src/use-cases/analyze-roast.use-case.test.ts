import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { OllamaClientInterface } from '../lib/ollama-client.js'
import { InMemoryAnalysisIssueRepository } from '../repositories/in-memory/analysis-issue-in-memory.repository'
import { InMemoryCodeDiffRepository } from '../repositories/in-memory/code-diff-in-memory.repository'
import { InMemoryRoastRepository } from '../repositories/in-memory/roast-in-memory.repository'
import { AnalyzeRoastUseCase } from './analyze-roast.use-case'

const createMockOllamaClient = (): OllamaClientInterface => ({
  analyze: vi.fn(),
})

describe('AnalyzeRoastUseCase', () => {
  let repository: InMemoryRoastRepository
  let analysisIssueRepository: InMemoryAnalysisIssueRepository
  let codeDiffRepository: InMemoryCodeDiffRepository
  let testRoastId: string

  beforeEach(async () => {
    repository = new InMemoryRoastRepository()
    analysisIssueRepository = new InMemoryAnalysisIssueRepository()
    codeDiffRepository = new InMemoryCodeDiffRepository()

    const roast = await repository.create({
      code: 'const x = 1;',
      language: 'javascript',
      roastMode: 'roast',
    })

    testRoastId = roast.id
  })

  it('should analyze a roast and update it with results', async () => {
    const mockOllamaClient = createMockOllamaClient()
    const useCase = new AnalyzeRoastUseCase(
      repository,
      analysisIssueRepository,
      codeDiffRepository,
      mockOllamaClient
    )

    mockOllamaClient.analyze = vi.fn().mockResolvedValue({
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

    expect(mockOllamaClient.analyze).toHaveBeenCalledWith('const x = 1;', 'javascript', 'roast')
  })

  it('should handle analysis errors gracefully', async () => {
    const mockOllamaClient = createMockOllamaClient()
    const useCase = new AnalyzeRoastUseCase(
      repository,
      analysisIssueRepository,
      codeDiffRepository,
      mockOllamaClient
    )

    mockOllamaClient.analyze = vi.fn().mockRejectedValue(new Error('Ollama service unavailable'))

    await expect(useCase.execute(testRoastId)).rejects.toThrow('Ollama service unavailable')
  })

  it('should throw error when roast is not found', async () => {
    const mockOllamaClient = createMockOllamaClient()
    const useCase = new AnalyzeRoastUseCase(
      repository,
      analysisIssueRepository,
      codeDiffRepository,
      mockOllamaClient
    )

    await expect(useCase.execute('non-existent-id')).rejects.toThrow('Roast not found')
  })
})
