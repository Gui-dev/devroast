import { act, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('shiki', () => ({
  codeToHtml: vi.fn(),
}))

import { codeToHtml } from 'shiki'
import { DiffBlock } from './diff-block'

const mockedCodeToHtml = vi.mocked(codeToHtml)

async function renderDiffBlock(
  lines: Parameters<typeof DiffBlock>[0]['lines'],
  lang?: string,
  className?: string
) {
  const jsx = await DiffBlock({ lines, lang: lang as any, className })
  return render(jsx)
}

describe('<DiffBlock />', () => {
  it('renders "your code" section for removed lines', async () => {
    mockedCodeToHtml.mockResolvedValue('<pre><code>var x = 1</code></pre>')

    await act(async () => {
      renderDiffBlock([{ id: 'rm-0', type: 'removed', content: 'var x = 1' }])
    })

    expect(screen.getByText('your code')).toBeInTheDocument()
    expect(screen.getByText('var x = 1')).toBeInTheDocument()
  })

  it('renders "suggested fix" section for added lines', async () => {
    mockedCodeToHtml.mockResolvedValue('<pre><code>const x = 1</code></pre>')

    await act(async () => {
      renderDiffBlock([{ id: 'add-0', type: 'added', content: 'const x = 1' }])
    })

    expect(screen.getByText('suggested fix')).toBeInTheDocument()
    expect(screen.getByText('const x = 1')).toBeInTheDocument()
  })

  it('renders both removed and added sections together', async () => {
    mockedCodeToHtml.mockResolvedValue('<pre><code>code</code></pre>')

    await act(async () => {
      renderDiffBlock([
        { id: 'rm-0', type: 'removed', content: 'var x' },
        { id: 'add-0', type: 'added', content: 'const x' },
      ])
    })

    expect(screen.getByText('your code')).toBeInTheDocument()
    expect(screen.getByText('suggested fix')).toBeInTheDocument()
  })

  it('renders only suggested_fix header when no removed or added lines', async () => {
    mockedCodeToHtml.mockResolvedValue('<pre><code>code</code></pre>')

    await act(async () => {
      renderDiffBlock([{ id: 'ctx-0', type: 'context', content: 'function test() {}' }])
    })

    expect(screen.getByText('suggested_fix')).toBeInTheDocument()
    expect(screen.queryByText('your code')).not.toBeInTheDocument()
    expect(screen.queryByText('suggested fix')).not.toBeInTheDocument()
  })

  it('renders content in context-only mode', async () => {
    mockedCodeToHtml.mockResolvedValue('<pre><code>code</code></pre>')

    await act(async () => {
      renderDiffBlock([{ id: 'ctx-0', type: 'context', content: 'function test() {}' }])
    })

    expect(screen.getByText('function test() {}')).toBeInTheDocument()
  })

  it('shows diff indicators (- and +) for removed and added lines', async () => {
    mockedCodeToHtml.mockResolvedValue('<pre><code>code</code></pre>')

    await act(async () => {
      renderDiffBlock([
        { id: 'rm-0', type: 'removed', content: 'old code' },
        { id: 'add-0', type: 'added', content: 'new code' },
      ])
    })

    expect(screen.getByText('-')).toBeInTheDocument()
    expect(screen.getByText('+')).toBeInTheDocument()
  })

  it('applies custom className', async () => {
    mockedCodeToHtml.mockResolvedValue('<pre><code>code</code></pre>')

    let container: ReturnType<typeof render>['container']
    await act(async () => {
      const result = await renderDiffBlock(
        [{ id: 'add-0', type: 'added', content: 'x' }],
        undefined,
        'custom-class'
      )
      container = result.container
    })

    expect(screen.getByText('suggested fix')).toBeInTheDocument()
    expect(container!.firstChild).toHaveClass('custom-class')
  })

  it('renders red dot indicator for your code section', async () => {
    mockedCodeToHtml.mockResolvedValue('<pre><code>code</code></pre>')

    await act(async () => {
      renderDiffBlock([{ id: 'rm-0', type: 'removed', content: 'old code' }])
    })

    const redDot = document.querySelector('.rounded-full.bg-accent-red')
    expect(redDot).not.toBeNull()
  })

  it('renders green dot indicator for suggested fix section', async () => {
    mockedCodeToHtml.mockResolvedValue('<pre><code>code</code></pre>')

    await act(async () => {
      renderDiffBlock([{ id: 'add-0', type: 'added', content: 'new code' }])
    })

    const greenDot = document.querySelector('.rounded-full.bg-accent-green')
    expect(greenDot).not.toBeNull()
  })
})
