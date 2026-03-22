import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Badge } from './badge'

describe('Badge', () => {
  it('renders critical variant with red text', () => {
    render(<Badge variant="critical">Critical Error</Badge>)
    const badge = screen.getByText('Critical Error')
    expect(badge).toBeInTheDocument()
    expect(badge.className).toContain('text-accent-red')
  })

  it('renders warning variant with amber text', () => {
    render(<Badge variant="warning">Warning</Badge>)
    const badge = screen.getByText('Warning')
    expect(badge).toBeInTheDocument()
    expect(badge.className).toContain('text-accent-amber')
  })

  it('renders good variant with green text', () => {
    render(<Badge variant="good">Success</Badge>)
    const badge = screen.getByText('Success')
    expect(badge).toBeInTheDocument()
    expect(badge.className).toContain('text-accent-green')
  })

  it('renders needs_serious_help variant with red text and larger font', () => {
    render(<Badge variant="needs_serious_help">Needs Help</Badge>)
    const badge = screen.getByText('Needs Help')
    expect(badge).toBeInTheDocument()
    expect(badge.className).toContain('text-accent-red')
    expect(badge.className).toContain('text-[13px]')
  })

  it('renders children content', () => {
    render(<Badge>Custom Content</Badge>)
    expect(screen.getByText('Custom Content')).toBeInTheDocument()
  })
})
