import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { LeaderboardEntryCode } from './leaderboard-entry-code'

describe('<LeaderboardEntryCode />', () => {
  it('renders children directly when lineCount is below threshold', () => {
    render(
      <LeaderboardEntryCode lineCount={3}>
        <div>short code</div>
      </LeaderboardEntryCode>
    )

    expect(screen.getByText('short code')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders children directly when lineCount equals threshold (5)', () => {
    render(
      <LeaderboardEntryCode lineCount={5}>
        <div>exactly five lines</div>
      </LeaderboardEntryCode>
    )

    expect(screen.getByText('exactly five lines')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders collapsible wrapper when lineCount exceeds threshold', () => {
    render(
      <LeaderboardEntryCode lineCount={10}>
        <div>long code</div>
      </LeaderboardEntryCode>
    )

    expect(screen.getByText('long code')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /show more/i })).toBeInTheDocument()
  })

  it('toggles between show more and show less on click', async () => {
    const user = userEvent.setup()

    render(
      <LeaderboardEntryCode lineCount={10}>
        <div>long code</div>
      </LeaderboardEntryCode>
    )

    const button = screen.getByRole('button', { name: /show more/i })
    await user.click(button)

    expect(screen.getByRole('button', { name: /show less/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /show less/i }))
    expect(screen.getByRole('button', { name: /show more/i })).toBeInTheDocument()
  })

  it('renders gradient overlay when collapsed', () => {
    const { container } = render(
      <LeaderboardEntryCode lineCount={10}>
        <div>long code</div>
      </LeaderboardEntryCode>
    )

    const gradient = container.querySelector('.bg-gradient-to-t')
    expect(gradient).toBeInTheDocument()
  })

  it('removes gradient overlay when expanded', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <LeaderboardEntryCode lineCount={10}>
        <div>long code</div>
      </LeaderboardEntryCode>
    )

    await user.click(screen.getByRole('button', { name: /show more/i }))

    const gradient = container.querySelector('.bg-gradient-to-t')
    expect(gradient).not.toBeInTheDocument()
  })
})
