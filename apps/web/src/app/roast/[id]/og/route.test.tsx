import type { Verdict } from '@/app/hooks/use-roast'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/app/hooks/use-roast', () => ({
  fetchRoast: vi.fn(),
}))

vi.mock('takumi-js/response', () => ({
  ImageResponse: vi.fn().mockImplementation((component: unknown) => ({
    type: 'ImageResponse',
    component,
  })),
}))

describe('OG Route Handler', () => {
  let fetchRoast: ReturnType<typeof vi.fn>
  let GET: (request: Request, context: { params: Promise<{ id: string }> }) => Promise<unknown>

  beforeEach(async () => {
    vi.resetModules()
    const useRoast = await import('@/app/hooks/use-roast')
    fetchRoast = vi.mocked(useRoast.fetchRoast)

    const route = await import('./route')
    GET = route.GET
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns ImageResponse with roast data when fetch succeeds', async () => {
    const mockRoast = {
      id: 'test-id',
      score: 3.5,
      verdict: 'needs_serious_help' as Verdict,
      language: 'javascript',
      lineCount: 7,
      roastQuote: 'test quote',
    }
    fetchRoast.mockResolvedValue(mockRoast)

    const request = new Request('http://localhost/roast/test-id/og')
    const response = await GET(request, { params: Promise.resolve({ id: 'test-id' }) })

    expect(response).toHaveProperty('type', 'ImageResponse')
    expect(fetchRoast).toHaveBeenCalledWith('test-id')
  })

  it('returns ImageResponse with error message when roast not found', async () => {
    fetchRoast.mockRejectedValue(new Error('Roast not found'))

    const request = new Request('http://localhost/roast/invalid-id/og')
    const response = await GET(request, { params: Promise.resolve({ id: 'invalid-id' }) })

    expect(response).toBeDefined()
  })

  it('returns ImageResponse with error message on generic fetch error', async () => {
    fetchRoast.mockRejectedValue(new Error('Network error'))

    const request = new Request('http://localhost/roast/error-id/og')
    const response = await GET(request, { params: Promise.resolve({ id: 'error-id' }) })

    expect(response).toBeDefined()
  })
})
