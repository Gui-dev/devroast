import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchRoast } from './use-roast'

describe('fetchRoast', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
    vi.restoreAllMocks()
  })

  it('fetches roast data successfully', async () => {
    const mockRoast = {
      id: 'test-id',
      userId: null,
      code: 'const x = 1',
      language: 'javascript',
      lineCount: 1,
      score: 5,
      verdict: 'warning',
      roastQuote: 'test quote',
      roastMode: 'roast',
      suggestedFix: null,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      issues: [],
      diffs: [],
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockRoast,
    })

    const result = await fetchRoast('test-id')

    expect(result).toEqual(mockRoast)
    expect(fetch).toHaveBeenCalledWith('http://localhost:3333/roasts/test-id')
  })

  it('throws "Roast not found" on 404', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    })

    await expect(fetchRoast('nonexistent')).rejects.toThrow('Roast not found')
  })

  it('throws "Failed to fetch roast" on other errors', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    })

    await expect(fetchRoast('test-id')).rejects.toThrow('Failed to fetch roast')
  })

  it('uses NEXT_PUBLIC_API_URL when set', async () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com'

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'test-id' }),
    })

    await fetchRoast('test-id')

    expect(fetch).toHaveBeenCalledWith('https://api.example.com/roasts/test-id')
  })

  it('uses default localhost URL when env var is not set', async () => {
    process.env.NEXT_PUBLIC_API_URL = undefined

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'test-id' }),
    })

    await fetchRoast('test-id')

    expect(fetch).toHaveBeenCalledWith('http://localhost:3333/roasts/test-id')
  })
})
