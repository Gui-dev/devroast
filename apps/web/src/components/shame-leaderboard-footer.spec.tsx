import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ShameLeaderboardFooter } from './shame-leaderboard-footer'

vi.mock('@/components/ui/link', () => ({
  Link: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

describe('<ShameLeaderboardFooter />', () => {
  it('renders total count with number', () => {
    const { container } = render(<ShameLeaderboardFooter total={42} />)

    expect(container).toHaveTextContent('showing top 3 of')
    expect(container).toHaveTextContent('42')
  })

  it('renders total count with string', () => {
    const { container } = render(<ShameLeaderboardFooter total="1,234" />)

    expect(container).toHaveTextContent('1,234')
  })

  it('renders link to leaderboard', () => {
    render(<ShameLeaderboardFooter total={100} />)

    const link = screen.getByRole('link', { name: /view full leaderboard/i })
    expect(link).toHaveAttribute('href', '/leaderboard')
  })
})
