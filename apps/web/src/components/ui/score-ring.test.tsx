import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ScoreRing } from './score-ring'

describe('ScoreRing', () => {
  it('renders with score value', () => {
    render(<ScoreRing score={7} />)
    expect(screen.getByText('7')).toBeInTheDocument()
  })

  it('renders with custom maxScore', () => {
    render(<ScoreRing score={75} maxScore={100} />)
    expect(screen.getByText('/100')).toBeInTheDocument()
  })

  it('renders correct color based on score', () => {
    const { rerender } = render(<ScoreRing score={8} />)
    const highScore = screen.getByText('8')
    expect(highScore.style.color).toBe('rgb(16, 185, 129)')

    rerender(<ScoreRing score={5} />)
    const mediumScore = screen.getByText('5')
    expect(mediumScore.style.color).toBe('rgb(245, 158, 11)')

    rerender(<ScoreRing score={2} />)
    const lowScore = screen.getByText('2')
    expect(lowScore.style.color).toBe('rgb(239, 68, 68)')
  })

  it('applies custom className', () => {
    render(<ScoreRing score={5} className="custom-class" />)
    const container = screen.getByRole('img').parentElement
    expect(container?.className).toContain('custom-class')
  })
})
