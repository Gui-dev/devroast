import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DiffLine } from './diff-line'

describe('<DiffLine />', () => {
  it('renders children content', () => {
    render(<DiffLine>some code line</DiffLine>)

    expect(screen.getByText('some code line')).toBeInTheDocument()
  })

  it('renders minus icon for removed variant', () => {
    render(<DiffLine variant="removed">deleted line</DiffLine>)

    const icon = document.querySelector('span.text-center')
    expect(icon?.textContent).toBe('-')
  })

  it('renders plus icon for added variant', () => {
    render(<DiffLine variant="added">added line</DiffLine>)

    const icon = document.querySelector('span.text-center')
    expect(icon?.textContent).toBe('+')
  })

  it('renders space icon for context variant', () => {
    render(<DiffLine variant="context">unchanged line</DiffLine>)

    const icon = document.querySelector('span.text-center')
    expect(icon?.textContent).toBe(' ')
  })

  it('renders context variant by default', () => {
    render(<DiffLine>default line</DiffLine>)

    const icon = document.querySelector('span.text-center')
    expect(icon?.textContent).toBe(' ')
  })

  it('applies removed background class', () => {
    const { container } = render(<DiffLine variant="removed">removed</DiffLine>)

    expect(container.firstChild).toHaveClass('bg-diff-removed')
  })

  it('applies added background class', () => {
    const { container } = render(<DiffLine variant="added">added</DiffLine>)

    expect(container.firstChild).toHaveClass('bg-diff-added')
  })

  it('applies custom className', () => {
    const { container } = render(<DiffLine className="custom">content</DiffLine>)

    expect(container.firstChild).toHaveClass('custom')
  })
})
