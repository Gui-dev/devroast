import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Card, CardDescription, CardHeader, CardTitle } from './card'

describe('<Card />', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>)

    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('renders critical variant', () => {
    const { container } = render(<Card variant="critical">Critical</Card>)
    const card = container.firstChild as HTMLElement

    expect(card.className).toContain('border-l-accent-red')
  })

  it('renders warning variant', () => {
    const { container } = render(<Card variant="warning">Warning</Card>)
    const card = container.firstChild as HTMLElement

    expect(card.className).toContain('border-l-accent-amber')
  })

  it('renders good variant', () => {
    const { container } = render(<Card variant="good">Good</Card>)
    const card = container.firstChild as HTMLElement

    expect(card.className).toContain('border-l-accent-yellow')
  })

  it('renders needs_serious_help variant', () => {
    const { container } = render(<Card variant="needs_serious_help">Help</Card>)
    const card = container.firstChild as HTMLElement

    expect(card.className).toContain('border-l-accent-red')
  })

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-class">Test</Card>)
    const card = container.firstChild as HTMLElement

    expect(card.className).toContain('custom-class')
  })
})

describe('<CardHeader />', () => {
  it('renders children', () => {
    render(<CardHeader>Header content</CardHeader>)

    expect(screen.getByText('Header content')).toBeInTheDocument()
  })
})

describe('<CardTitle />', () => {
  it('renders children', () => {
    render(<CardTitle>Title text</CardTitle>)

    expect(screen.getByText('Title text')).toBeInTheDocument()
  })
})

describe('<CardDescription />', () => {
  it('renders children', () => {
    render(<CardDescription>Description text</CardDescription>)

    expect(screen.getByText('Description text')).toBeInTheDocument()
  })
})
