import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useShikiHighlighter } from './use-shiki-highlighter'

const { mockCodeToHtml, mockGetLoadedLanguages } = vi.hoisted(() => {
  return {
    mockCodeToHtml: vi.fn().mockResolvedValue('<pre><code>highlighted</code></pre>'),
    mockGetLoadedLanguages: vi.fn().mockReturnValue(['javascript', 'typescript', 'python']),
  }
})

vi.mock('shiki/bundle/web', () => ({
  createHighlighter: vi.fn().mockResolvedValue({
    codeToHtml: mockCodeToHtml,
    getLoadedLanguages: mockGetLoadedLanguages,
  }),
}))

describe('useShikiHighlighter', () => {
  beforeEach(() => {
    mockCodeToHtml.mockReset()
    mockCodeToHtml.mockResolvedValue('<pre><code>highlighted</code></pre>')
    mockGetLoadedLanguages.mockReset()
    mockGetLoadedLanguages.mockReturnValue(['javascript', 'typescript', 'python'])
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return isReady as false initially', () => {
    const { result } = renderHook(() => useShikiHighlighter())

    expect(result.current.isReady).toBe(false)
  })

  it('should return isReady as true after highlighter initializes', async () => {
    const { result } = renderHook(() => useShikiHighlighter())

    await waitFor(() => {
      expect(result.current.isReady).toBe(true)
    })
  })

  it('should provide a highlight function', () => {
    const { result } = renderHook(() => useShikiHighlighter())

    expect(typeof result.current.highlight).toBe('function')
  })

  it('should call codeToHtml with valid language', async () => {
    const { result } = renderHook(() => useShikiHighlighter())

    await waitFor(() => {
      expect(result.current.isReady).toBe(true)
    })

    await act(async () => {
      await result.current.highlight('const x = 1', 'typescript')
    })

    expect(mockCodeToHtml).toHaveBeenCalledWith('const x = 1', {
      lang: 'typescript',
      theme: 'vesper',
    })
  })

  it('should fallback to javascript for invalid language', async () => {
    const { result } = renderHook(() => useShikiHighlighter())

    await waitFor(() => {
      expect(result.current.isReady).toBe(true)
    })

    await act(async () => {
      await result.current.highlight('some code', 'invalid-lang')
    })

    expect(mockCodeToHtml).toHaveBeenCalledWith('some code', {
      lang: 'javascript',
      theme: 'vesper',
    })
  })

  it('should return escaped HTML when highlight fails', async () => {
    const { result } = renderHook(() => useShikiHighlighter())

    await waitFor(() => {
      expect(result.current.isReady).toBe(true)
    })

    mockGetLoadedLanguages.mockImplementationOnce(() => {
      throw new Error('fail')
    })

    let output: string | undefined
    await act(async () => {
      output = await result.current.highlight('<script>alert("xss")</script>', 'javascript')
    })

    expect(output).toBe('<pre><code>&lt;script&gt;alert("xss")&lt;/script&gt;</code></pre>')
  })
})
