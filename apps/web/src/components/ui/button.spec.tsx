import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Button } from './button'

describe('<Button />', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)

    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('renders default variant by default', () => {
    render(<Button>Default</Button>)
    const button = screen.getByRole('button')

    expect(button.className).toContain('bg-accent-yellow')
  })

  it('renders secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>)
    const button = screen.getByRole('button')

    expect(button.className).toContain('border-border-primary')
  })

  it('renders link variant', () => {
    render(<Button variant="link">Link</Button>)
    const button = screen.getByRole('button')

    expect(button.className).toContain('border-border-primary')
    expect(button.className).toContain('text-text-secondary')
  })

  it('renders default size', () => {
    render(<Button>Size</Button>)
    const button = screen.getByRole('button')

    expect(button.className).toContain('px-6')
  })

  it('renders sm size', () => {
    render(<Button size="sm">Small</Button>)
    const button = screen.getByRole('button')

    expect(button.className).toContain('px-4')
  })

  it('renders lg size', () => {
    render(<Button size="lg">Large</Button>)
    const button = screen.getByRole('button')

    expect(button.className).toContain('px-8')
  })

  it('renders icon size', () => {
    render(<Button size="icon">I</Button>)
    const button = screen.getByRole('button')

    expect(button.className).toContain('size-9')
  })

  it('applies disabled state', () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByRole('button')

    expect(button).toBeDisabled()
    expect(button.className).toContain('disabled:opacity-50')
  })

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>)
    const button = screen.getByRole('button')

    expect(button.className).toContain('custom-class')
  })
})
