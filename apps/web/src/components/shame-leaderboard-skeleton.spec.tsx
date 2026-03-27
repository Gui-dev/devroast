import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ShameLeaderboardSkeleton } from './shame-leaderboard-skeleton'

describe('<ShameLeaderboardSkeleton />', () => {
  it('renders skeleton container', () => {
    const { container } = render(<ShameLeaderboardSkeleton />)

    expect(container.querySelector('.border-border-primary')).toBeInTheDocument()
  })

  it('renders 3 skeleton articles', () => {
    const { container } = render(<ShameLeaderboardSkeleton />)

    const articles = container.querySelectorAll('article')
    expect(articles).toHaveLength(3)
  })

  it('renders header columns', () => {
    render(<ShameLeaderboardSkeleton />)

    expect(screen.getByText('#')).toBeInTheDocument()
    expect(screen.getByText('score')).toBeInTheDocument()
    expect(screen.getByText('code')).toBeInTheDocument()
    expect(screen.getByText('lang')).toBeInTheDocument()
  })

  it('renders pulse animation elements', () => {
    const { container } = render(<ShameLeaderboardSkeleton />)

    const pulses = container.querySelectorAll('.animate-pulse')
    expect(pulses.length).toBeGreaterThan(0)
  })
})
