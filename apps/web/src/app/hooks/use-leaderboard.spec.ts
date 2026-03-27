import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchLeaderboard } from './use-leaderboard'

describe('fetchLeaderboard', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return leaderboard entries on successful fetch', async () => {
    const mockData = [
      {
        id: '1',
        roastId: 'r1',
        rank: 1,
        score: 9.5,
        language: 'typescript',
        codePreview: 'const x',
        code: 'const x = 1',
        lineCount: 3,
        updatedAt: '2026-01-01',
      },
    ]
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    } as Response)

    const result = await fetchLeaderboard()

    expect(result).toEqual(mockData)
    expect(fetch).toHaveBeenCalledWith('http://localhost:3333/leaderboard')
  })

  it('should use NEXT_PUBLIC_API_URL env var when set', async () => {
    const originalEnv = process.env.NEXT_PUBLIC_API_URL
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com'

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    } as Response)

    await fetchLeaderboard()

    expect(fetch).toHaveBeenCalledWith('https://api.example.com/leaderboard')

    process.env.NEXT_PUBLIC_API_URL = originalEnv
  })

  it('should return empty array when response is empty', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    } as Response)

    const result = await fetchLeaderboard()

    expect(result).toEqual([])
  })

  it('should throw error when response is not ok', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response)

    await expect(fetchLeaderboard()).rejects.toThrow('Failed to fetch leaderboard')
  })

  it('should throw error on 404', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as Response)

    await expect(fetchLeaderboard()).rejects.toThrow('Failed to fetch leaderboard')
  })
})
