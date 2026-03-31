import { describe, expect, it, vi } from 'vitest'
import { OllamaClient } from '../lib/ollama-client'

describe('OllamaClient', () => {
  const baseUrl = 'http://localhost:11434'
  const model = 'qwen2.5-coder:1.5b'

  it('should call Ollama with correct prompt and return parsed response', async () => {
    // Mock fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        response: JSON.stringify({
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
        }),
      }),
    }) as any

    const client = new OllamaClient(baseUrl, model)
    const result = await client.analyzeCode('const x = 1;', 'javascript', 'roast')

    expect(fetch).toHaveBeenCalledWith(
      `${baseUrl}/api/generate`,
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('suggestedFix'),
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

  it('should throw error when Ollama returns non-ok response', async () => {
    // Mock fetch to return error
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    }) as any

    const client = new OllamaClient(baseUrl, model)

    await expect(client.analyzeCode('const x = 1;', 'javascript', 'roast')).rejects.toThrow(
      'Ollama request failed with status 500'
    )
  })

  it('should throw error when Ollama returns invalid JSON', async () => {
    // Mock fetch to return invalid JSON
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        response: 'Invalid JSON response',
      }),
    }) as any

    const client = new OllamaClient(baseUrl, model)

    await expect(client.analyzeCode('const x = 1;', 'javascript', 'roast')).rejects.toThrow(
      'Failed to parse AI response'
    )
  })

  it('should use different prompts for roast vs honest mode', async () => {
    // Mock fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        response: JSON.stringify({
          roastQuote: 'Test quote',
          issues: [],
          suggestedFix: '',
          score: 5,
        }),
      }),
    }) as any

    const client = new OllamaClient(baseUrl, model)

    // Test roast mode
    await client.analyzeCode('const x = 1;', 'javascript', 'roast')
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: expect.stringContaining('Be brutally honest and sarcastic'),
      })
    )

    // Test honest mode
    await client.analyzeCode('const x = 1;', 'javascript', 'honest')
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: expect.stringContaining('constructive feedback'),
      })
    )
  })
})
