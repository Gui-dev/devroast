import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { LeaderboardEntry } from './leaderboard-entry'

vi.mock('../leaderboard-entry-code', () => ({
  LeaderboardEntryCode: ({ children }: { children: React.ReactNode; lineCount: number }) => (
    <div data-testid="entry-code">{children}</div>
  ),
}))

vi.mock('./code-block/code-block-client', () => ({
  CodeBlockClient: ({ code, lang }: { code: string; lang: string }) => (
    <div data-testid="code-block">
      {code} ({lang})
    </div>
  ),
}))

describe('<LeaderboardEntry />', () => {
  it('renders rank', () => {
    render(<LeaderboardEntry rank={1} score={8.5} language="typescript" code="const x = 1" />)

    expect(screen.getByText('#1')).toBeInTheDocument()
  })

  it('renders score with format', () => {
    render(<LeaderboardEntry rank={1} score={8.5} language="typescript" code="const x = 1" />)

    expect(screen.getByText('8.5/10')).toBeInTheDocument()
  })

  it('renders language', () => {
    render(<LeaderboardEntry rank={1} score={8.5} language="typescript" code="const x = 1" />)

    expect(screen.getByText('typescript')).toBeInTheDocument()
  })

  it('renders anonymous label', () => {
    render(<LeaderboardEntry rank={1} score={8.5} language="typescript" code="const x = 1" />)

    expect(screen.getByText('anonymous')).toBeInTheDocument()
  })

  it('applies critical variant for score >= 7', () => {
    const { container } = render(
      <LeaderboardEntry rank={1} score={9.0} language="javascript" code="x" />
    )

    expect(container.firstChild).toHaveClass('border-accent-red/30')
  })

  it('applies warning variant for score >= 4 and < 7', () => {
    const { container } = render(
      <LeaderboardEntry rank={2} score={5.0} language="javascript" code="x" />
    )

    expect(container.firstChild).toHaveClass('border-accent-amber/30')
  })

  it('applies good variant for score < 4', () => {
    const { container } = render(
      <LeaderboardEntry rank={10} score={2.0} language="javascript" code="x" />
    )

    expect(container.firstChild).toHaveClass('border-accent-green/30')
  })

  it('renders amber color for rank 1', () => {
    render(<LeaderboardEntry rank={1} score={9.0} language="javascript" code="x" />)

    const rank = screen.getByText('#1')
    expect(rank.className).toContain('text-accent-amber')
  })

  it('renders secondary color for rank 2', () => {
    render(<LeaderboardEntry rank={2} score={8.0} language="javascript" code="x" />)

    const rank = screen.getByText('#2')
    expect(rank.className).toContain('text-text-secondary')
  })

  it('renders red color for rank 3', () => {
    render(<LeaderboardEntry rank={3} score={7.5} language="javascript" code="x" />)

    const rank = screen.getByText('#3')
    expect(rank.className).toContain('text-accent-red')
  })

  it('renders tertiary color for rank > 3', () => {
    render(<LeaderboardEntry rank={5} score={6.0} language="javascript" code="x" />)

    const rank = screen.getByText('#5')
    expect(rank.className).toContain('text-text-tertiary')
  })

  it('calculates effectiveLineCount from code when lineCount is not provided', () => {
    render(
      <LeaderboardEntry rank={1} score={8.0} language="javascript" code="line1\nline2\nline3" />
    )

    expect(screen.getByTestId('entry-code')).toBeInTheDocument()
  })

  it('handles null code gracefully', () => {
    render(
      <LeaderboardEntry
        rank={1}
        score={5.0}
        language="javascript"
        code={null as unknown as string}
      />
    )

    expect(screen.getByTestId('code-block')).toBeInTheDocument()
  })
})
