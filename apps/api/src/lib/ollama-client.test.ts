import { beforeEach, describe, expect, it, vi } from 'vitest'
import { OllamaClient } from './ollama-client.js'

const mockResponse = {
  roastQuote: 'This code is a mess!',
  issues: [
    {
      title: 'Bad variable name',
      description: 'Variable x is not descriptive',
      severity: 'warning',
      issueType: 'bad-practice',
    },
  ],
  suggestedFix: '-const x = 1;\n+const counter = 1;',
  score: 3,
}

describe('OllamaClient', () => {
  let client: OllamaClient

  beforeEach(() => {
    client = new OllamaClient('http://localhost:11434', 'qwen2.5-coder:1.5b')
  })

  it('should parse successful response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        message: { content: JSON.stringify(mockResponse) },
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const result = await client.analyze('const x = 1;', 'javascript', 'roast')

    expect(result.roastQuote).toBe('This code is a mess!')
    expect(result.issues).toHaveLength(1)
    expect(result.issues[0].severity).toBe('warning')
    expect(result.score).toBe(3)
    expect(result.suggestedFix).toBeDefined()
  })

  it('should throw Ollama timeout error on timeout', async () => {
    const abortError = new DOMException('The operation was aborted.', 'AbortError')
    const fetchMock = vi.fn().mockRejectedValue(abortError)
    vi.stubGlobal('fetch', fetchMock)

    await expect(client.analyze('const x = 1;', 'javascript', 'roast')).rejects.toThrow(
      'Ollama timeout'
    )
  })

  it('should throw Ollama unavailable error when fetch fails', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('ECONNREFUSED'))
    vi.stubGlobal('fetch', fetchMock)

    await expect(client.analyze('const x = 1;', 'javascript', 'roast')).rejects.toThrow(
      'Ollama unavailable'
    )
  })

  it('should throw parse error on invalid JSON response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        message: { content: 'not valid json' },
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(client.analyze('const x = 1;', 'javascript', 'roast')).rejects.toThrow(
      'Failed to parse AI response'
    )
  })

  it('should build roast prompt with sarcastic tone', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        message: { content: JSON.stringify(mockResponse) },
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await client.analyze('const x = 1;', 'javascript', 'roast')

    const callBody = JSON.parse(fetchMock.mock.calls[0][1].body)
    const systemPrompt = callBody.messages[0].content

    expect(systemPrompt).toContain('brutally honest and sarcastic')
    expect(systemPrompt).toContain('developer humor')
  })

  it('should build honest prompt with constructive tone', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        message: { content: JSON.stringify(mockResponse) },
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await client.analyze('const x = 1;', 'javascript', 'honest')

    const callBody = JSON.parse(fetchMock.mock.calls[0][1].body)
    const systemPrompt = callBody.messages[0].content

    expect(systemPrompt).toContain('constructive feedback')
    expect(systemPrompt).toContain('friendly but honest')
  })

  it('should include code and language in prompt', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        message: { content: JSON.stringify(mockResponse) },
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await client.analyze('print("hello")', 'python', 'roast')

    const callBody = JSON.parse(fetchMock.mock.calls[0][1].body)
    const systemMessage = callBody.messages[0].content
    const userMessage = callBody.messages[1].content

    expect(systemMessage).toContain('python')
    expect(userMessage).toContain('print("hello")')
  })

  it('should throw parse error on non-JSON content in response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        message: { content: 'Here is my analysis: the code is fine.' },
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(client.analyze('const x = 1;', 'javascript', 'roast')).rejects.toThrow(
      'Failed to parse AI response'
    )
  })
})
