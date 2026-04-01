import { beforeEach, describe, expect, it, vi } from 'vitest'
import { OllamaClient } from './ollama-client.js'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

describe('OllamaClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  describe('analyze', () => {
    it('should return parsed analysis on success', async () => {
      const client = new OllamaClient()

      const ollamaResponse = {
        response: JSON.stringify({
          roastQuote: 'This code is a mess.',
          issues: [
            {
              title: 'No types',
              description: 'Missing type annotations.',
              severity: 'warning',
              issueType: 'bad-practice',
            },
          ],
          suggestedFix: '--- a/file.ts\n+++ b/file.ts',
          score: 3,
        }),
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(ollamaResponse),
      })

      const result = await client.analyze('const x = 1;', 'javascript', 'roast')

      expect(result.roastQuote).toBe('This code is a mess.')
      expect(result.issues).toHaveLength(1)
      expect(result.issues[0].severity).toBe('warning')
      expect(result.suggestedFix).toContain('--- a/file.ts')
      expect(result.score).toBe(3)
    })

    it('should build roast prompt for roast mode', async () => {
      const client = new OllamaClient()

      const ollamaResponse = {
        response: JSON.stringify({
          roastQuote: 'test',
          issues: [],
          suggestedFix: '',
          score: 5,
        }),
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(ollamaResponse),
      })

      await client.analyze('const x = 1;', 'javascript', 'roast')

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(callBody.prompt).toContain('brutally honest and sarcastic')
      expect(callBody.prompt).toContain('javascript')
      expect(callBody.prompt).toContain('const x = 1;')
    })

    it('should build honest prompt for honest mode', async () => {
      const client = new OllamaClient()

      const ollamaResponse = {
        response: JSON.stringify({
          roastQuote: 'test',
          issues: [],
          suggestedFix: '',
          score: 5,
        }),
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(ollamaResponse),
      })

      await client.analyze('const x = 1;', 'typescript', 'honest')

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(callBody.prompt).toContain('constructive feedback')
    })

    it('should throw error on non-ok response', async () => {
      const client = new OllamaClient()

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })

      await expect(client.analyze('code', 'js', 'roast')).rejects.toThrow(
        'Ollama unavailable: 500 Internal Server Error'
      )
    })

    it('should use default model from constructor', async () => {
      const ollamaResponse = {
        response: JSON.stringify({
          roastQuote: 'test',
          issues: [],
          suggestedFix: '',
          score: 5,
        }),
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(ollamaResponse),
      })

      const client = new OllamaClient()
      await client.analyze('code', 'js', 'roast')

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:11434/api/generate',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"model":"qwen2.5-coder:1.5b"'),
        })
      )
    })
  })
})
