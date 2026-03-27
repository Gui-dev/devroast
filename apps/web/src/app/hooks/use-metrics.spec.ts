import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchMetrics } from './use-metrics'

describe('fetchMetrics', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  it('should return metrics on successful fetch', async () => {
    const mockData = { totalRoasts: 150, avgScore: 7.2 }
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    } as Response)

    const result = await fetchMetrics()

    expect(result).toEqual(mockData)
    expect(fetch).toHaveBeenCalledWith('http://localhost:3333/metrics')
  })

  it('should use NEXT_PUBLIC_API_URL env var when set', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://api.example.com')

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ totalRoasts: 0, avgScore: 0 }),
    } as Response)

    await fetchMetrics()

    expect(fetch).toHaveBeenCalledWith('https://api.example.com/metrics')
  })

  it('should fallback to localhost when env var is not set', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', undefined as unknown as string)

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ totalRoasts: 0, avgScore: 0 }),
    } as Response)

    await fetchMetrics()

    expect(fetch).toHaveBeenCalledWith('http://localhost:3333/metrics')
  })

  it('should throw error when response is not ok', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response)

    await expect(fetchMetrics()).rejects.toThrow('Failed to fetch metrics')
  })
})
