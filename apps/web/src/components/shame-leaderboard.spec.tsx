import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ShameLeaderboard, ShameLeaderboardWithFooter } from './shame-leaderboard'

vi.mock('@/app/hooks/use-worst-roasts', () => ({
  fetchWorstRoasts: vi.fn(),
}))

vi.mock('@/components/ui/leaderboard-entry', () => ({
  LeaderboardEntry: ({
    rank,
    score,
  }: {
    rank: number
    score: number
    language: string
    code: string
    lineCount: number
  }) => (
    <div data-testid={`worst-entry-${rank}`}>
      #{rank} {score}/10
    </div>
  ),
}))

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

import { fetchWorstRoasts } from '@/app/hooks/use-worst-roasts'

const mockedFetchWorstRoasts = vi.mocked(fetchWorstRoasts)

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('<ShameLeaderboard />', () => {
  it('returns null when data is loading', () => {
    mockedFetchWorstRoasts.mockReturnValue(new Promise(() => {}))

    const { container } = render(<ShameLeaderboard />, { wrapper: createWrapper() })

    expect(container.innerHTML).toBe('')
  })

  it('returns null when roasts is empty', async () => {
    mockedFetchWorstRoasts.mockResolvedValue([])

    const { container } = render(<ShameLeaderboard />, { wrapper: createWrapper() })

    await vi.waitFor(() => {
      expect(container.innerHTML).toBe('')
    })
  })

  it('renders worst roasts when data is available', async () => {
    mockedFetchWorstRoasts.mockResolvedValue([
      {
        id: '1',
        roastId: 'r1',
        rank: 1,
        score: 1.2,
        language: 'python',
        codePreview: 'x',
        code: 'x = 1',
        lineCount: 1,
        updatedAt: '2026-01-01',
      },
    ])

    render(<ShameLeaderboard />, { wrapper: createWrapper() })

    expect(await screen.findByTestId('worst-entry-1')).toBeInTheDocument()
  })
})

describe('<ShameLeaderboardWithFooter />', () => {
  it('returns null when data is loading', () => {
    mockedFetchWorstRoasts.mockReturnValue(new Promise(() => {}))

    const { container } = render(<ShameLeaderboardWithFooter total={42} />, {
      wrapper: createWrapper(),
    })

    expect(container.innerHTML).toBe('')
  })

  it('renders entries and footer with total count', async () => {
    mockedFetchWorstRoasts.mockResolvedValue([
      {
        id: '1',
        roastId: 'r1',
        rank: 1,
        score: 2.0,
        language: 'javascript',
        codePreview: 'a',
        code: 'a = 1',
        lineCount: 1,
        updatedAt: '2026-01-01',
      },
    ])

    const { container } = render(<ShameLeaderboardWithFooter total={42} />, {
      wrapper: createWrapper(),
    })

    expect(await screen.findByTestId('worst-entry-1')).toBeInTheDocument()
    expect(container).toHaveTextContent('showing top 3 of')
    expect(container).toHaveTextContent('42')
  })

  it('renders link to leaderboard', async () => {
    mockedFetchWorstRoasts.mockResolvedValue([
      {
        id: '1',
        roastId: 'r1',
        rank: 1,
        score: 2.0,
        language: 'javascript',
        codePreview: 'a',
        code: 'a = 1',
        lineCount: 1,
        updatedAt: '2026-01-01',
      },
    ])

    render(<ShameLeaderboardWithFooter total={100} />, { wrapper: createWrapper() })

    await screen.findByTestId('worst-entry-1')

    const link = screen.getByRole('link', { name: /view full leaderboard/i })
    expect(link).toHaveAttribute('href', '/leaderboard')
  })
})
