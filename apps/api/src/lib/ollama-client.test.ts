import { beforeEach, describe, expect, it, vi } from 'vitest'
import { OllamaClient } from './ollama-client.js'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

describe('OllamaClient', () => {
  let client: OllamaClient

  beforeEach(() => {
    vi.clearAllMocks()
    vi.unstubAllEnvs()
    client = new OllamaClient()
  })

  describe('analyze', () => {
    it('should return parsed analysis on success', async () => {
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
      expect(callBody.prompt).toContain('friendly and helpful')
    })

    it('should throw "Ollama timeout" on timeout', async () => {
      const abortError = new DOMException('The operation was aborted.', 'AbortError')
      mockFetch.mockRejectedValueOnce(abortError)

      await expect(client.analyze('code', 'js', 'roast')).rejects.toThrow('Ollama timeout')
    })

    it('should throw "Ollama unavailable" when response is not ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })

      await expect(client.analyze('code', 'js', 'roast')).rejects.toThrow('Ollama unavailable')
    })

    it('should throw "Ollama unavailable" on network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('ECONNREFUSED'))

      await expect(client.analyze('code', 'js', 'roast')).rejects.toThrow('Ollama unavailable')
    })

    it('should use custom env vars for base URL and model', async () => {
      vi.stubEnv('OLLAMA_BASE_URL', 'http://custom:9999')
      vi.stubEnv('OLLAMA_MODEL', 'custom-model')

      const customClient = new OllamaClient()

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

      await customClient.analyze('code', 'js', 'roast')

      expect(mockFetch).toHaveBeenCalledWith(
        'http://custom:9999/api/generate',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"model":"custom-model"'),
        })
      )
    })

    it('should use default base URL and model', async () => {
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
