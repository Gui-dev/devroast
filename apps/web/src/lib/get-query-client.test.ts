import { afterEach, describe, expect, it, vi } from 'vitest'
import { getQueryClient } from './get-query-client'

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query')
  return {
    ...actual,
  }
})

describe('getQueryClient', () => {
  const originalWindow = globalThis.window

  afterEach(() => {
    vi.restoreAllMocks()
    Object.defineProperty(globalThis, 'window', {
      value: originalWindow,
      writable: true,
      configurable: true,
    })
  })

  it('should return a QueryClient instance', () => {
    vi.stubGlobal('window', undefined)
    const queryClient = getQueryClient()
    expect(queryClient).toBeDefined()
    expect(queryClient).toHaveProperty('getQueryData')
    expect(queryClient).toHaveProperty('setQueryData')
    expect(queryClient).toHaveProperty('prefetchQuery')
  })

  it('should create new instance on server (window is undefined)', () => {
    vi.stubGlobal('window', undefined)
    const queryClient1 = getQueryClient()
    const queryClient2 = getQueryClient()
    expect(queryClient1).not.toBe(queryClient2)
  })

  it('should return same instance on client (window is defined)', () => {
    vi.stubGlobal('window', { document: {} })
    const queryClient1 = getQueryClient()
    const queryClient2 = getQueryClient()
    expect(queryClient1).toBe(queryClient2)
  })

  it('should have correct staleTime configuration', () => {
    vi.stubGlobal('window', undefined)
    const queryClient = getQueryClient()
    const defaultOptions = queryClient.getDefaultOptions()
    expect(defaultOptions.queries?.staleTime).toBe(60 * 1000)
  })
})
