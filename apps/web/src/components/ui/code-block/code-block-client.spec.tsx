import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { CodeBlockClient } from './code-block-client'

vi.mock('shiki', () => ({
  codeToHtml: vi.fn(),
}))

import { codeToHtml } from 'shiki'

const mockedCodeToHtml = vi.mocked(codeToHtml)

describe('<CodeBlockClient />', () => {
  it('returns null when code is empty', () => {
    const { container } = render(<CodeBlockClient code="" />)

    expect(container.innerHTML).toBe('')
  })

  it('returns null when code is not provided', () => {
    const { container } = render(<CodeBlockClient />)

    expect(container.innerHTML).toBe('')
  })

  it('renders loading state (plain code) before highlight resolves', () => {
    mockedCodeToHtml.mockReturnValue(new Promise(() => {}))

    render(<CodeBlockClient code="const x = 1" lang="typescript" />)

    expect(screen.getByText('const x = 1')).toBeInTheDocument()
  })

  it('renders highlighted HTML after codeToHtml resolves', async () => {
    mockedCodeToHtml.mockResolvedValue('<pre><code><span>const x = 1</span></code></pre>')

    render(<CodeBlockClient code="const x = 1" lang="typescript" />)

    expect(await screen.findByText('const x = 1')).toBeInTheDocument()
  })

  it('renders line numbers for multi-line code', () => {
    mockedCodeToHtml.mockReturnValue(new Promise(() => {}))

    const { container } = render(<CodeBlockClient code={'a\nb\nc'} />)

    const lineNumbersArea = container.querySelector('.border-r.border-border-primary')
    expect(lineNumbersArea).not.toBeNull()
    expect(lineNumbersArea!.textContent).toBe('123')
  })

  it('renders single line number for single-line code', () => {
    mockedCodeToHtml.mockReturnValue(new Promise(() => {}))

    const { container } = render(<CodeBlockClient code="hello" />)

    const lineNumbersArea = container.querySelector('.border-r.border-border-primary')
    expect(lineNumbersArea).not.toBeNull()
    expect(lineNumbersArea!.textContent).toBe('1')
  })

  it('applies custom className', () => {
    mockedCodeToHtml.mockReturnValue(new Promise(() => {}))

    const { container } = render(<CodeBlockClient code="test" className="custom-class" />)

    expect(container.firstChild).toHaveClass('custom-class')
  })
})
