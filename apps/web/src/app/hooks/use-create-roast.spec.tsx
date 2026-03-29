import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import { NextRouter } from 'next/router'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useCreateRoast } from './use-create-roast'

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useCreateRoast', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  it('should call API with correct payload', async () => {
    const mockRoast = {
      id: '123',
      code: 'const x = 1',
      language: 'typescript',
      roastMode: 'roast',
      lineCount: 1,
      score: 5,
      verdict: 'test',
      roastQuote: null,
      suggestedFix: null,
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
      userId: null,
    }
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockRoast),
    } as Response)

    const { result } = renderHook(() => useCreateRoast(), { wrapper: createWrapper() })
    await result.current.mutateAsync({
      code: 'const x = 1',
      language: 'typescript',
      roastMode: 'roast',
    })

    expect(fetch).toHaveBeenCalledWith('http://localhost:3333/roasts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'const x = 1', language: 'typescript', roastMode: 'roast' }),
    })
  })

  it('should redirect to /roast/{id} on success', async () => {
    const mockPush = vi.fn()
    const { useRouter } = await import('next/navigation')
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as any)

    const mockRoast = {
      id: 'abc-123',
      code: 'const x = 1',
      language: 'typescript',
      roastMode: 'roast',
      lineCount: 1,
      score: 5,
      verdict: 'test',
      roastQuote: null,
      suggestedFix: null,
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
      userId: null,
    }
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockRoast),
    } as Response)

    const { result } = renderHook(() => useCreateRoast(), { wrapper: createWrapper() })
    await result.current.mutateAsync({
      code: 'const x = 1',
      language: 'typescript',
      roastMode: 'roast',
    })

    expect(mockPush).toHaveBeenCalledWith('/roast/abc-123')
  })

  it('should throw on API error', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response)

    const { result } = renderHook(() => useCreateRoast(), { wrapper: createWrapper() })

    await expect(
      result.current.mutateAsync({
        code: 'const x = 1',
        language: 'typescript',
        roastMode: 'roast',
      })
    ).rejects.toThrow('Failed to create roast')
  })

  it('should use NEXT_PUBLIC_API_URL env var when set', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://api.example.com')

    const mockRoast = {
      id: '123',
      code: 'test',
      language: 'typescript',
      roastMode: 'roast',
      lineCount: 1,
      score: 5,
      verdict: 'test',
      roastQuote: null,
      suggestedFix: null,
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
      userId: null,
    }
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockRoast),
    } as Response)

    const { result } = renderHook(() => useCreateRoast(), { wrapper: createWrapper() })
    await result.current.mutateAsync({ code: 'test', language: 'typescript', roastMode: 'honest' })

    expect(fetch).toHaveBeenCalledWith('https://api.example.com/roasts', expect.any(Object))
  })
})
