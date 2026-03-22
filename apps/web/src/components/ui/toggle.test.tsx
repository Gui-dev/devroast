import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Toggle } from './toggle'

describe('Toggle', () => {
  it('renders unchecked by default', () => {
    render(<Toggle />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders checked when defaultPressed=true', () => {
    render(<Toggle defaultPressed={true} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('toggles on click', async () => {
    const user = userEvent.setup()
    render(<Toggle />)

    const button = screen.getByRole('button')
    await user.click(button)
    await user.click(button)

    expect(button).toBeInTheDocument()
  })

  it('calls onPressedChange with new value', async () => {
    const user = userEvent.setup()
    const onPressedChange = vi.fn()
    render(<Toggle onPressedChange={onPressedChange} />)

    const button = screen.getByRole('button')
    await user.click(button)

    expect(onPressedChange).toHaveBeenCalledWith(true)
  })

  it('renders label when provided', () => {
    render(<Toggle label="Toggle me" />)
    expect(screen.getByText('Toggle me')).toBeInTheDocument()
  })

  it('does not render label when not provided', () => {
    render(<Toggle />)
    expect(screen.queryByText('Toggle me')).not.toBeInTheDocument()
  })
})
