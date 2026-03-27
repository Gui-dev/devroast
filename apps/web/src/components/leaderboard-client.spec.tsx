import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { LeaderboardClient } from './leaderboard-client'

vi.mock('@/app/hooks/use-leaderboard', () => ({
  fetchLeaderboard: vi.fn(),
}))

vi.mock('@/components/ui/leaderboard-entry', () => ({
  LeaderboardEntry: ({
    rank,
    score,
    language,
  }: {
    rank: number
    score: number
    language: string
    code: string
    lineCount: number
  }) => (
    <div data-testid={`entry-${rank}`}>
      #{rank} {score}/10 {language}
    </div>
  ),
}))

import { fetchLeaderboard } from '@/app/hooks/use-leaderboard'

const mockedFetchLeaderboard = vi.mocked(fetchLeaderboard)

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('<LeaderboardClient />', () => {
  it('returns null when data is loading', () => {
    mockedFetchLeaderboard.mockReturnValue(new Promise(() => {}))

    const { container } = render(<LeaderboardClient />, { wrapper: createWrapper() })

    expect(container.innerHTML).toBe('')
  })

  it('returns null when entries is empty', async () => {
    mockedFetchLeaderboard.mockResolvedValue([])

    const { container } = render(<LeaderboardClient />, { wrapper: createWrapper() })

    await vi.waitFor(() => {
      expect(container.innerHTML).toBe('')
    })
  })

  it('renders leaderboard entries when data is available', async () => {
    mockedFetchLeaderboard.mockResolvedValue([
      {
        id: '1',
        roastId: 'r1',
        rank: 1,
        score: 9.5,
        language: 'typescript',
        codePreview: 'const x',
        code: 'const x = 1',
        lineCount: 1,
        updatedAt: '2026-01-01',
      },
      {
        id: '2',
        roastId: 'r2',
        rank: 2,
        score: 8.0,
        language: 'python',
        codePreview: 'print',
        code: 'print("hi")',
        lineCount: 1,
        updatedAt: '2026-01-01',
      },
    ])

    render(<LeaderboardClient />, { wrapper: createWrapper() })

    expect(await screen.findByTestId('entry-1')).toBeInTheDocument()
    expect(screen.getByTestId('entry-2')).toBeInTheDocument()
  })
})
