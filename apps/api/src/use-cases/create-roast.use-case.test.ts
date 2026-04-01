import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { CreateRoastInput } from '../entities/roast.entity.js'
import type { OllamaClientInterface } from '../lib/ollama-client.js'
import { InMemoryRoastRepository } from '../repositories/in-memory/roast-in-memory.repository'
import { CreateRoastUseCase } from './create-roast.use-case'

const createMockOllamaClient = (): OllamaClientInterface => ({
  analyze: vi.fn(),
})

describe('CreateRoastUseCase', () => {
  let repository: InMemoryRoastRepository

  beforeEach(() => {
    repository = new InMemoryRoastRepository()
  })

  it('should create a roast with valid data', async () => {
    const mockOllamaClient = createMockOllamaClient()
    const useCase = new CreateRoastUseCase(repository, mockOllamaClient)

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
    expect(roast.verdict).toBe('needs_serious_help')
    expect(roast.roastQuote).toBe('This code is a masterpiece of confusion')
    expect(roast.suggestedFix).toBe('const x = 1;\n- console.log(x);\n+ // Removed unused variable')
  })

  it('should trim code before saving', async () => {
    const mockOllamaClient = createMockOllamaClient()
    const useCase = new CreateRoastUseCase(repository, mockOllamaClient)

    mockOllamaClient.analyze = vi.fn().mockResolvedValue({
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
    const mockOllamaClient = createMockOllamaClient()
    const useCase = new CreateRoastUseCase(repository, mockOllamaClient)

    const input: CreateRoastInput = {
      code: '',
      language: 'javascript',
    }

    await expect(useCase.execute(input)).rejects.toThrow('Code is required')
  })

  it('should throw error when code is only whitespace', async () => {
    const mockOllamaClient = createMockOllamaClient()
    const useCase = new CreateRoastUseCase(repository, mockOllamaClient)

    const input: CreateRoastInput = {
      code: '   ',
      language: 'javascript',
    }

    await expect(useCase.execute(input)).rejects.toThrow('Code is required')
  })

  it('should use default roast mode when not provided', async () => {
    const mockOllamaClient = createMockOllamaClient()
    const useCase = new CreateRoastUseCase(repository, mockOllamaClient)

    mockOllamaClient.analyze = vi.fn().mockResolvedValue({
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
  })

  it('should use provided roast mode when specified', async () => {
    const mockOllamaClient = createMockOllamaClient()
    const useCase = new CreateRoastUseCase(repository, mockOllamaClient)

    mockOllamaClient.analyze = vi.fn().mockResolvedValue({
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
  })

  it('should calculate line count correctly', async () => {
    const mockOllamaClient = createMockOllamaClient()
    const useCase = new CreateRoastUseCase(repository, mockOllamaClient)

    mockOllamaClient.analyze = vi.fn().mockResolvedValue({
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

  it('should work without ollama client', async () => {
    const useCase = new CreateRoastUseCase(repository)

    const input: CreateRoastInput = {
      code: 'const x = 1;',
      language: 'javascript',
    }

    const roast = await useCase.execute(input)

    expect(roast.id).toBeDefined()
    expect(roast.score).toBe(0)
  })

  it('should call ollama client analyze after creating roast', async () => {
    const mockOllamaClient = createMockOllamaClient()
    const useCase = new CreateRoastUseCase(repository, mockOllamaClient)

    mockOllamaClient.analyze = vi.fn().mockResolvedValue({
      roastQuote: 'Terrible code!',
      issues: [],
      suggestedFix: 'const x = 2;',
      score: 3,
    })

    const input: CreateRoastInput = {
      code: 'const x = 1;',
      language: 'javascript',
      roastMode: 'roast',
    }

    await useCase.execute(input)

    expect(mockOllamaClient.analyze).toHaveBeenCalledWith('const x = 1;', 'javascript', 'roast')
  })

  it('should update roast with AI analysis results', async () => {
    const mockOllamaClient = createMockOllamaClient()
    const useCase = new CreateRoastUseCase(repository, mockOllamaClient)

    mockOllamaClient.analyze = vi.fn().mockResolvedValue({
      roastQuote: 'This code is awful!',
      issues: [],
      suggestedFix: 'const x = 2;',
      score: 2,
    })

    const input: CreateRoastInput = {
      code: 'const x = 1;',
      language: 'javascript',
    }

    const roast = await useCase.execute(input)

    expect(roast.score).toBe(2)
    expect(roast.verdict).toBe('needs_serious_help')
    expect(roast.roastQuote).toBe('This code is awful!')
    expect(roast.suggestedFix).toBe('const x = 2;')
  })

  it('should return roast without analysis if ollama fails', async () => {
    const mockOllamaClient = createMockOllamaClient()
    const useCase = new CreateRoastUseCase(repository, mockOllamaClient)

    mockOllamaClient.analyze = vi.fn().mockRejectedValue(new Error('Ollama unavailable'))

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const input: CreateRoastInput = {
      code: 'const x = 1;',
      language: 'javascript',
    }

    const roast = await useCase.execute(input)

    expect(roast.id).toBeDefined()
    expect(roast.score).toBe(0)
    expect(roast.roastQuote).toBeNull()

    consoleSpy.mockRestore()
  })

  it('should not throw when ollama analysis fails', async () => {
    const mockOllamaClient = createMockOllamaClient()
    const useCase = new CreateRoastUseCase(repository, mockOllamaClient)

    mockOllamaClient.analyze = vi.fn().mockRejectedValue(new Error('Connection refused'))

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const input: CreateRoastInput = {
      code: 'const x = 1;',
      language: 'javascript',
    }

    await expect(useCase.execute(input)).resolves.toBeDefined()

    consoleSpy.mockRestore()
  })
})

describe('scoreToVerdict', () => {
  it('should return needs_serious_help for score <= 3', () => {
    const useCase = new CreateRoastUseCase(new InMemoryRoastRepository())

    expect(useCase.scoreToVerdict(0)).toBe('needs_serious_help')
    expect(useCase.scoreToVerdict(1)).toBe('needs_serious_help')
    expect(useCase.scoreToVerdict(2)).toBe('needs_serious_help')
    expect(useCase.scoreToVerdict(3)).toBe('needs_serious_help')
  })

  it('should return warning for score <= 5', () => {
    const useCase = new CreateRoastUseCase(new InMemoryRoastRepository())

    expect(useCase.scoreToVerdict(4)).toBe('warning')
    expect(useCase.scoreToVerdict(5)).toBe('warning')
  })

  it('should return good for score > 5', () => {
    const useCase = new CreateRoastUseCase(new InMemoryRoastRepository())

    expect(useCase.scoreToVerdict(6)).toBe('good')
    expect(useCase.scoreToVerdict(7)).toBe('good')
    expect(useCase.scoreToVerdict(10)).toBe('good')
  })
})
