import { act, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('shiki', () => ({
  codeToHtml: vi.fn(),
}))

import { codeToHtml } from 'shiki'
import { CodeBlock, CodeBlockHeader } from './code-block'

const mockedCodeToHtml = vi.mocked(codeToHtml)

async function renderCodeBlock(code: string, lang = 'javascript', className?: string) {
  const jsx = await CodeBlock({ code, lang: lang as any, className })
  return render(jsx)
}

describe('<CodeBlock />', () => {
  it('renders code with line numbers', async () => {
    mockedCodeToHtml.mockResolvedValue('<pre><code>const x = 1</code></pre>')

    await act(async () => {
      renderCodeBlock('const x = 1', 'javascript')
    })

    expect(screen.getByText('const x = 1')).toBeInTheDocument()
  })

  it('renders correct number of line numbers for multi-line code', async () => {
    mockedCodeToHtml.mockResolvedValue('<pre><code>code</code></pre>')

    let container: ReturnType<typeof render>['container']
    await act(async () => {
      const result = await renderCodeBlock('line1\nline2\nline3', 'javascript')
      container = result.container
    })

    const lineNumbers = container!.querySelector('.select-none')
    expect(lineNumbers).not.toBeNull()
    expect(lineNumbers!.textContent).toBe('123')
  })

  it('renders single line number for single-line code', async () => {
    mockedCodeToHtml.mockResolvedValue('<pre><code>code</code></pre>')

    let container: ReturnType<typeof render>['container']
    await act(async () => {
      const result = await renderCodeBlock('hello', 'javascript')
      container = result.container
    })

    const lineNumbers = container!.querySelector('.select-none')
    expect(lineNumbers).not.toBeNull()
    expect(lineNumbers!.textContent).toBe('1')
  })

  it('applies custom className', async () => {
    mockedCodeToHtml.mockResolvedValue('<pre><code>code</code></pre>')

    let container: ReturnType<typeof render>['container']
    await act(async () => {
      const result = await renderCodeBlock('test', 'javascript', 'custom-class')
      container = result.container
    })

    expect(container!.firstChild).toHaveClass('custom-class')
  })

  it('renders with specified language', async () => {
    mockedCodeToHtml.mockResolvedValue('<pre><code>code</code></pre>')

    await act(async () => {
      renderCodeBlock('print("hello")', 'python')
    })

    expect(mockedCodeToHtml).toHaveBeenCalledWith(
      'print("hello")',
      expect.objectContaining({ lang: 'python' })
    )
  })
})

describe('<CodeBlockHeader />', () => {
  it('renders three colored dots', () => {
    render(<CodeBlockHeader />)

    const dots = document.querySelectorAll('.rounded-full')
    expect(dots).toHaveLength(3)
  })

  it('renders filename when provided', () => {
    render(<CodeBlockHeader filename="app.tsx" />)

    expect(screen.getByText('app.tsx')).toBeInTheDocument()
  })

  it('does not render filename when not provided', () => {
    render(<CodeBlockHeader />)

    expect(screen.queryByText('app.tsx')).not.toBeInTheDocument()
  })
})
