import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchWorstRoasts } from './use-worst-roasts'

describe('fetchWorstRoasts', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return worst roasts on successful fetch', async () => {
    const mockData = [
      {
        id: '1',
        roastId: 'r1',
        rank: 1,
        score: 1.2,
        language: 'python',
        codePreview: 'print',
        code: 'print("hello")',
        lineCount: 1,
        updatedAt: '2026-01-01',
      },
    ]
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    } as Response)

    const result = await fetchWorstRoasts()

    expect(result).toEqual(mockData)
    expect(fetch).toHaveBeenCalledWith('http://localhost:3333/leaderboard/worst')
  })

  it('should use NEXT_PUBLIC_API_URL env var when set', async () => {
    const originalEnv = process.env.NEXT_PUBLIC_API_URL
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com'

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    } as Response)

    await fetchWorstRoasts()

    expect(fetch).toHaveBeenCalledWith('https://api.example.com/leaderboard/worst')

    process.env.NEXT_PUBLIC_API_URL = originalEnv
  })

  it('should return empty array when response is empty', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    } as Response)

    const result = await fetchWorstRoasts()

    expect(result).toEqual([])
  })

  it('should throw error when response is not ok', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response)

    await expect(fetchWorstRoasts()).rejects.toThrow('Failed to fetch worst roasts')
  })

  it('should throw error on 503', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 503,
    } as Response)

    await expect(fetchWorstRoasts()).rejects.toThrow('Failed to fetch worst roasts')
  })
})
