import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import {
  LeaderboardCode,
  LeaderboardCodeCollapsible,
  LeaderboardLanguage,
  LeaderboardRank,
  LeaderboardRow,
  LeaderboardScore,
} from './leaderboard-row'

vi.mock('./code-block/code-block-client', () => ({
  CodeBlockClient: ({ code, lang }: { code: string; lang: string }) => (
    <div data-testid="code-block">
      {code} ({lang})
    </div>
  ),
}))

describe('<LeaderboardRow />', () => {
  it('renders children', () => {
    render(
      <LeaderboardRow>
        <span>content</span>
      </LeaderboardRow>
    )

    expect(screen.getByText('content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<LeaderboardRow className="custom-class">child</LeaderboardRow>)

    expect(container.firstChild).toHaveClass('custom-class')
  })
})

describe('<LeaderboardRank />', () => {
  it('renders rank with # prefix', () => {
    render(<LeaderboardRank>1</LeaderboardRank>)

    expect(screen.getByText('#1')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<LeaderboardRank className="custom">5</LeaderboardRank>)

    expect(container.firstChild).toHaveClass('custom')
  })
})

describe('<LeaderboardScore />', () => {
  it('renders score value', () => {
    render(<LeaderboardScore>8.5</LeaderboardScore>)

    expect(screen.getByText('8.5')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<LeaderboardScore className="custom">3</LeaderboardScore>)

    expect(container.firstChild).toHaveClass('custom')
  })
})

describe('<LeaderboardCode />', () => {
  it('renders code content', () => {
    render(<LeaderboardCode>const x = 1;</LeaderboardCode>)

    expect(screen.getByText('const x = 1;')).toBeInTheDocument()
  })

  it('applies truncate class', () => {
    const { container } = render(<LeaderboardCode>code</LeaderboardCode>)

    expect(container.firstChild).toHaveClass('truncate')
  })
})

describe('<LeaderboardCodeCollapsible />', () => {
  const shortCode = 'line1\nline2\nline3'
  const longCode = 'line1\nline2\nline3\nline4\nline5'

  it('renders code preview with first 3 lines', () => {
    render(<LeaderboardCodeCollapsible fullCode={longCode} language="javascript" />)

    const codeBlock = screen.getByTestId('code-block')
    expect(codeBlock).toHaveTextContent('line1')
    expect(codeBlock).toHaveTextContent('line3')
    expect(codeBlock).not.toHaveTextContent('line4')
    expect(codeBlock).toHaveTextContent('(javascript)')
  })

  it('does not show expand button when code has 3 or fewer lines', () => {
    render(<LeaderboardCodeCollapsible fullCode={shortCode} language="typescript" />)

    expect(screen.queryByText('[+ expand code]')).not.toBeInTheDocument()
  })

  it('shows expand button when code has more than 3 lines', () => {
    render(<LeaderboardCodeCollapsible fullCode={longCode} language="javascript" />)

    expect(screen.getByText('[+ expand code]')).toBeInTheDocument()
  })

  it('expands to show full code when expand button is clicked', async () => {
    const user = userEvent.setup()
    render(<LeaderboardCodeCollapsible fullCode={longCode} language="python" />)

    await user.click(screen.getByText('[+ expand code]'))

    const codeBlock = screen.getByTestId('code-block')
    expect(codeBlock).toHaveTextContent('line1')
    expect(codeBlock).toHaveTextContent('line5')
    expect(codeBlock).toHaveTextContent('(python)')
    expect(screen.getByText('[- collapse code]')).toBeInTheDocument()
  })

  it('collapses back to preview when collapse button is clicked', async () => {
    const user = userEvent.setup()
    render(<LeaderboardCodeCollapsible fullCode={longCode} language="go" />)

    await user.click(screen.getByText('[+ expand code]'))
    await user.click(screen.getByText('[- collapse code]'))

    const codeBlock = screen.getByTestId('code-block')
    expect(codeBlock).toHaveTextContent('line1')
    expect(codeBlock).toHaveTextContent('line3')
    expect(codeBlock).toHaveTextContent('(go)')
    expect(screen.queryByText('[- collapse code]')).not.toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <LeaderboardCodeCollapsible fullCode="code" language="rust" className="custom" />
    )

    expect(container.firstChild).toHaveClass('custom')
  })
})

describe('<LeaderboardLanguage />', () => {
  it('renders language name', () => {
    render(<LeaderboardLanguage>javascript</LeaderboardLanguage>)

    expect(screen.getByText('javascript')).toBeInTheDocument()
  })

  it('applies hidden class for responsive behavior', () => {
    const { container } = render(<LeaderboardLanguage>typescript</LeaderboardLanguage>)

    expect(container.firstChild).toHaveClass('hidden')
  })
})
