import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { CreateRoastInput } from '../entities/roast.entity.js'
import type { OllamaClient } from '../lib/ollama-client.ts'
import { InMemoryAnalysisIssueRepository } from '../repositories/in-memory/analysis-issue-in-memory.repository'
import { InMemoryCodeDiffRepository } from '../repositories/in-memory/code-diff-in-memory.repository'
import { InMemoryRoastRepository } from '../repositories/in-memory/roast-in-memory.repository'
import { CreateRoastUseCase } from './create-roast.use-case'

describe('CreateRoastUseCase', () => {
  let mockOllamaClient: Partial<OllamaClient>

  beforeEach(() => {
    mockOllamaClient = {
      analyzeCode: vi.fn(),
    }
  })

  it('should create a roast with valid data', async () => {
    const repository = new InMemoryRoastRepository()
    const analysisIssueRepository = new InMemoryAnalysisIssueRepository()
    const codeDiffRepository = new InMemoryCodeDiffRepository()
    const useCase = new CreateRoastUseCase(
      repository,
      analysisIssueRepository,
      codeDiffRepository,
      mockOllamaClient as OllamaClient
    )

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

    const input: CreateRoastInput = {
      code: 'const x = 1;',
      language: 'javascript',
    }

    const roast = await useCase.execute(input)

    expect(roast.id).toBeDefined()
    expect(roast.code).toBe('const x = 1;')
    expect(roast.language).toBe('javascript')
    expect(roast.lineCount).toBe(1)
    expect(roast.roastMode).toBe('roast')
    expect(roast.score).toBe(3)
    expect(roast.verdict).toBe('critical')
    expect(roast.roastQuote).toBe('This code is a masterpiece of confusion')
    expect(roast.suggestedFix).toBe('const x = 1;\n- console.log(x);\n+ // Removed unused variable')

    expect(mockOllamaClient.analyzeCode).toHaveBeenCalledWith('const x = 1;', 'javascript', 'roast')
  })

  it('should trim code before saving', async () => {
    const repository = new InMemoryRoastRepository()
    const analysisIssueRepository = new InMemoryAnalysisIssueRepository()
    const codeDiffRepository = new InMemoryCodeDiffRepository()
    const useCase = new CreateRoastUseCase(
      repository,
      analysisIssueRepository,
      codeDiffRepository,
      mockOllamaClient as OllamaClient
    )

    mockOllamaClient.analyzeCode = vi.fn().mockResolvedValue({
      roastQuote: 'Test quote',
      issues: [],
      suggestedFix: '',
      score: 5,
    })

    const input: CreateRoastInput = {
      code: '  const x = 1;  ',
      language: 'javascript',
    }

    const roast = await useCase.execute(input)

    expect(roast.code).toBe('const x = 1;')
  })

  it('should throw error when code is empty', async () => {
    const repository = new InMemoryRoastRepository()
    const analysisIssueRepository = new InMemoryAnalysisIssueRepository()
    const codeDiffRepository = new InMemoryCodeDiffRepository()
    const useCase = new CreateRoastUseCase(
      repository,
      analysisIssueRepository,
      codeDiffRepository,
      mockOllamaClient as OllamaClient
    )

    const input: CreateRoastInput = {
      code: '',
      language: 'javascript',
    }

    await expect(useCase.execute(input)).rejects.toThrow('Code is required')
  })

  it('should throw error when code is only whitespace', async () => {
    const repository = new InMemoryRoastRepository()
    const analysisIssueRepository = new InMemoryAnalysisIssueRepository()
    const codeDiffRepository = new InMemoryCodeDiffRepository()
    const useCase = new CreateRoastUseCase(
      repository,
      analysisIssueRepository,
      codeDiffRepository,
      mockOllamaClient as OllamaClient
    )

    const input: CreateRoastInput = {
      code: '   ',
      language: 'javascript',
    }

    await expect(useCase.execute(input)).rejects.toThrow('Code is required')
  })

  it('should use default roast mode when not provided', async () => {
    const repository = new InMemoryRoastRepository()
    const analysisIssueRepository = new InMemoryAnalysisIssueRepository()
    const codeDiffRepository = new InMemoryCodeDiffRepository()
    const useCase = new CreateRoastUseCase(
      repository,
      analysisIssueRepository,
      codeDiffRepository,
      mockOllamaClient as OllamaClient
    )

    mockOllamaClient.analyzeCode = vi.fn().mockResolvedValue({
      roastQuote: 'Test quote',
      issues: [],
      suggestedFix: '',
      score: 5,
    })

    const input: CreateRoastInput = {
      code: 'const x = 1;',
      language: 'javascript',
    }

    const roast = await useCase.execute(input)

    expect(roast.roastMode).toBe('roast')
    expect(mockOllamaClient.analyzeCode).toHaveBeenCalledWith('const x = 1;', 'javascript', 'roast')
  })

  it('should use provided roast mode when specified', async () => {
    const repository = new InMemoryRoastRepository()
    const analysisIssueRepository = new InMemoryAnalysisIssueRepository()
    const codeDiffRepository = new InMemoryCodeDiffRepository()
    const useCase = new CreateRoastUseCase(
      repository,
      analysisIssueRepository,
      codeDiffRepository,
      mockOllamaClient as OllamaClient
    )

    mockOllamaClient.analyzeCode = vi.fn().mockResolvedValue({
      roastQuote: 'Test quote',
      issues: [],
      suggestedFix: '',
      score: 5,
    })

    const input: CreateRoastInput = {
      code: 'const x = 1;',
      language: 'javascript',
      roastMode: 'honest',
    }

    const roast = await useCase.execute(input)

    expect(roast.roastMode).toBe('honest')
    expect(mockOllamaClient.analyzeCode).toHaveBeenCalledWith(
      'const x = 1;',
      'javascript',
      'honest'
    )
  })

  it('should calculate line count correctly', async () => {
    const repository = new InMemoryRoastRepository()
    const analysisIssueRepository = new InMemoryAnalysisIssueRepository()
    const codeDiffRepository = new InMemoryCodeDiffRepository()
    const useCase = new CreateRoastUseCase(
      repository,
      analysisIssueRepository,
      codeDiffRepository,
      mockOllamaClient as OllamaClient
    )

    mockOllamaClient.analyzeCode = vi.fn().mockResolvedValue({
      roastQuote: 'Test quote',
      issues: [],
      suggestedFix: '',
      score: 5,
    })

    const input: CreateRoastInput = {
      code: 'const a = 1;\nconst b = 2;\nconst c = 3;',
      language: 'javascript',
    }

    const roast = await useCase.execute(input)

    expect(roast.lineCount).toBe(3)
  })

  it('should handle analysis errors gracefully', async () => {
    const repository = new InMemoryRoastRepository()
    const analysisIssueRepository = new InMemoryAnalysisIssueRepository()
    const codeDiffRepository = new InMemoryCodeDiffRepository()
    const useCase = new CreateRoastUseCase(
      repository,
      analysisIssueRepository,
      codeDiffRepository,
      mockOllamaClient as OllamaClient
    )

    mockOllamaClient.analyzeCode = vi
      .fn()
      .mockRejectedValue(new Error('Ollama service unavailable'))

    const input: CreateRoastInput = {
      code: 'const x = 1;',
      language: 'javascript',
    }

    await expect(useCase.execute(input)).rejects.toThrow('Ollama service unavailable')

    // Check that the roast was still created with error state
    const roasts = await repository.findAll()
    expect(roasts.length).toBe(1)
    expect(roasts[0].verdict).toBe('error')
    expect(roasts[0].roastQuote).toBe('Analysis failed')
  })
})
