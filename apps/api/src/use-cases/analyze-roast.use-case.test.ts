import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { OllamaResponse } from '../lib/ollama-client.js'
import {
  InMemoryAnalysisIssueRepository,
  InMemoryCodeDiffRepository,
  InMemoryRoastRepository,
} from '../repositories/in-memory/roast-in-memory.repository.js'
import { AnalyzeRoastUseCase } from './analyze-roast.use-case.js'

function createMockOllamaClient(response: OllamaResponse) {
  return {
    analyze: vi.fn().mockResolvedValue(response),
  }
}

describe('AnalyzeRoastUseCase', () => {
  let roastRepository: InMemoryRoastRepository
  let analysisIssueRepository: InMemoryAnalysisIssueRepository
  let codeDiffRepository: InMemoryCodeDiffRepository

  beforeEach(() => {
    roastRepository = new InMemoryRoastRepository()
    analysisIssueRepository = new InMemoryAnalysisIssueRepository()
    codeDiffRepository = new InMemoryCodeDiffRepository()
  })

  it('should analyze roast and update with score and verdict', async () => {
    const roast = await roastRepository.create({
      code: 'const x = 1;',
      language: 'javascript',
    })

    const ollamaResponse: OllamaResponse = {
      roastQuote: 'This code is basic.',
      issues: [],
      suggestedFix: '',
      score: 7,
    }

    const ollamaClient = createMockOllamaClient(ollamaResponse)
    const useCase = new AnalyzeRoastUseCase(
      ollamaClient as never,
      roastRepository,
      analysisIssueRepository,
      codeDiffRepository
    )

    const result = await useCase.execute(roast.id, 'const x = 1;', 'javascript', 'roast')

    expect(ollamaClient.analyze).toHaveBeenCalledWith('const x = 1;', 'javascript', 'roast')
    expect(result.score).toBe(7)
    expect(result.verdict).toBe('warning')
    expect(result.roastQuote).toBe('This code is basic.')
  })

  it('should throw error when roast not found', async () => {
    const ollamaClient = createMockOllamaClient({
      roastQuote: 'test',
      issues: [],
      suggestedFix: '',
      score: 5,
    })

    const useCase = new AnalyzeRoastUseCase(
      ollamaClient as never,
      roastRepository,
      analysisIssueRepository,
      codeDiffRepository
    )

    await expect(useCase.execute('non-existent-id', 'code', 'javascript', 'roast')).rejects.toThrow(
      'Roast not found: non-existent-id'
    )
  })

  describe('verdict mapping from score', () => {
    it('should return "good" for score >= 8', async () => {
      const roast = await roastRepository.create({ code: 'x', language: 'javascript' })
      const ollamaClient = createMockOllamaClient({
        roastQuote: 'Great code!',
        issues: [],
        suggestedFix: '',
        score: 9,
      })

      const useCase = new AnalyzeRoastUseCase(
        ollamaClient as never,
        roastRepository,
        analysisIssueRepository,
        codeDiffRepository
      )

      const result = await useCase.execute(roast.id, 'x', 'javascript', 'roast')
      expect(result.verdict).toBe('good')
    })

    it('should return "warning" for score >= 5', async () => {
      const roast = await roastRepository.create({ code: 'x', language: 'javascript' })
      const ollamaClient = createMockOllamaClient({
        roastQuote: 'Meh.',
        issues: [],
        suggestedFix: '',
        score: 5,
      })

      const useCase = new AnalyzeRoastUseCase(
        ollamaClient as never,
        roastRepository,
        analysisIssueRepository,
        codeDiffRepository
      )

      const result = await useCase.execute(roast.id, 'x', 'javascript', 'roast')
      expect(result.verdict).toBe('warning')
    })

    it('should return "critical" for score >= 3', async () => {
      const roast = await roastRepository.create({ code: 'x', language: 'javascript' })
      const ollamaClient = createMockOllamaClient({
        roastQuote: 'Yikes.',
        issues: [],
        suggestedFix: '',
        score: 3,
      })

      const useCase = new AnalyzeRoastUseCase(
        ollamaClient as never,
        roastRepository,
        analysisIssueRepository,
        codeDiffRepository
      )

      const result = await useCase.execute(roast.id, 'x', 'javascript', 'roast')
      expect(result.verdict).toBe('critical')
    })

    it('should return "needs_serious_help" for score < 3', async () => {
      const roast = await roastRepository.create({ code: 'x', language: 'javascript' })
      const ollamaClient = createMockOllamaClient({
        roastQuote: 'Oh no.',
        issues: [],
        suggestedFix: '',
        score: 1,
      })

      const useCase = new AnalyzeRoastUseCase(
        ollamaClient as never,
        roastRepository,
        analysisIssueRepository,
        codeDiffRepository
      )

      const result = await useCase.execute(roast.id, 'x', 'javascript', 'roast')
      expect(result.verdict).toBe('needs_serious_help')
    })
  })

  it('should create analysis issues from AI response', async () => {
    const roast = await roastRepository.create({ code: 'x', language: 'javascript' })
    const ollamaClient = createMockOllamaClient({
      roastQuote: 'Multiple issues found.',
      issues: [
        {
          title: 'Bad variable name',
          description: 'Use descriptive names',
          severity: 'warning',
          issueType: 'bad-practice',
        },
        {
          title: 'Security issue',
          description: 'Never use eval',
          severity: 'critical',
          issueType: 'security',
        },
      ],
      suggestedFix: '',
      score: 3,
    })

    const useCase = new AnalyzeRoastUseCase(
      ollamaClient as never,
      roastRepository,
      analysisIssueRepository,
      codeDiffRepository
    )

    await useCase.execute(roast.id, 'x', 'javascript', 'roast')

    const issues = await analysisIssueRepository.findByRoastId(roast.id)
    expect(issues).toHaveLength(2)
    expect(issues[0].title).toBe('Bad variable name')
    expect(issues[0].severity).toBe('warning')
    expect(issues[1].title).toBe('Security issue')
    expect(issues[1].severity).toBe('critical')
  })

  it('should create code diff when suggestedFix exists', async () => {
    const roast = await roastRepository.create({ code: 'x', language: 'javascript' })
    const ollamaClient = createMockOllamaClient({
      roastQuote: 'Here is a fix.',
      issues: [],
      suggestedFix: '--- a/file.js\n+++ b/file.js\n@@ -1 +1 @@\n-const x = 1;\n+const myValue = 1;',
      score: 6,
    })

    const useCase = new AnalyzeRoastUseCase(
      ollamaClient as never,
      roastRepository,
      analysisIssueRepository,
      codeDiffRepository
    )

    await useCase.execute(roast.id, 'x', 'javascript', 'roast')

    const diffs = await codeDiffRepository.findByRoastId(roast.id)
    expect(diffs).toHaveLength(1)
    expect(diffs[0].context).toContain('myValue')
  })

  it('should not create code diff when suggestedFix is empty', async () => {
    const roast = await roastRepository.create({ code: 'x', language: 'javascript' })
    const ollamaClient = createMockOllamaClient({
      roastQuote: 'No fix needed.',
      issues: [],
      suggestedFix: '',
      score: 9,
    })

    const useCase = new AnalyzeRoastUseCase(
      ollamaClient as never,
      roastRepository,
      analysisIssueRepository,
      codeDiffRepository
    )

    await useCase.execute(roast.id, 'x', 'javascript', 'roast')

    const diffs = await codeDiffRepository.findByRoastId(roast.id)
    expect(diffs).toHaveLength(0)
  })
})
