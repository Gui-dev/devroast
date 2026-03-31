import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('ai', async () => {
  const actual = await vi.importActual<typeof import('ai')>('ai')
  return {
    ...actual,
    generateObject: vi.fn(),
  }
})

vi.mock('ai-sdk-ollama', () => ({
  createOllama: vi.fn(() => vi.fn((name: string) => ({ modelId: name }))),
}))

describe('OllamaClient', () => {
  const baseUrl = 'http://localhost:11434'
  const model = 'qwen2.5-coder:1.5b'

  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should call generateObject with correct parameters and return parsed response', async () => {
    const { generateObject } = await import('ai')
    vi.mocked(generateObject).mockResolvedValue({
      object: {
        roastQuote: 'This code is a masterpiece of confusion',
        issues: [
          {
            title: 'Unused variable',
            description: "Variable 'x' is declared but never used",
            severity: 'warning',
            issueType: 'bad-practice',
          },
        ],
        suggestedFix: 'const x = 1;\n- console.log(x);\n+ // Removed unused variable',
        score: 3,
      },
    } as any)

    const { OllamaClient } = await import('../lib/ollama-client')
    const client = new OllamaClient(baseUrl, model)
    const result = await client.analyzeCode('const x = 1;', 'javascript', 'roast')

    expect(generateObject).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt: expect.stringContaining('Analyze this javascript code'),
        schema: expect.any(Object),
      })
    )

    expect(result).toEqual({
      roastQuote: 'This code is a masterpiece of confusion',
      issues: [
        {
          title: 'Unused variable',
          description: "Variable 'x' is declared but never used",
          severity: 'warning',
          issueType: 'bad-practice',
        },
      ],
      suggestedFix: 'const x = 1;\n- console.log(x);\n+ // Removed unused variable',
      score: 3,
    })
  })

  it('should throw error when generateObject fails', async () => {
    const { generateObject } = await import('ai')
    vi.mocked(generateObject).mockRejectedValue(new Error('Model not found'))

    const { OllamaClient } = await import('../lib/ollama-client')
    const client = new OllamaClient(baseUrl, model)

    await expect(client.analyzeCode('const x = 1;', 'javascript', 'roast')).rejects.toThrow(
      'Model not found'
    )
  })

  it('should use different prompts for roast vs honest mode', async () => {
    const { generateObject } = await import('ai')
    vi.mocked(generateObject).mockResolvedValue({
      object: {
        roastQuote: 'Test quote',
        issues: [],
        suggestedFix: '',
        score: 5,
      },
    } as any)

    const { OllamaClient } = await import('../lib/ollama-client')
    const client = new OllamaClient(baseUrl, model)

    await client.analyzeCode('const x = 1;', 'javascript', 'roast')
    expect(generateObject).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt: expect.stringContaining('brutally honest and sarcastic'),
      })
    )

    await client.analyzeCode('const x = 1;', 'javascript', 'honest')
    expect(generateObject).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt: expect.stringContaining('constructive feedback'),
      })
    )
  })
})
