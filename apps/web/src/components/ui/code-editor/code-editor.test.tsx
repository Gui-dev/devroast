import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CodeEditor } from './code-editor'

vi.mock('@/hooks/use-shiki-highlighter', () => ({
  useShikiHighlighter: () => ({
    highlight: vi.fn().mockResolvedValue('<pre><code>test</code></pre>'),
    isReady: true,
  }),
}))

describe('CodeEditor', () => {
  it('renders with textarea', () => {
    render(<CodeEditor value="" onChange={vi.fn()} language="javascript" />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toBeInTheDocument()
  })

  it('renders with value', () => {
    render(<CodeEditor value="const x = 1" onChange={vi.fn()} language="javascript" />)
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
    expect(textarea.value).toBe('const x = 1')
  })

  it('calls onChange when typing', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<CodeEditor value="" onChange={onChange} language="javascript" />)

    const textarea = screen.getByRole('textbox')
    await user.click(textarea)
    await user.type(textarea, 'test')

    expect(onChange).toHaveBeenCalled()
  })

  it('renders language selector', () => {
    render(<CodeEditor value="" onChange={vi.fn()} language="javascript" />)
    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()
  })

  it('renders with Mac window dots', () => {
    render(<CodeEditor value="" onChange={vi.fn()} language="javascript" />)
    const dots = document.querySelectorAll('.size-3')
    expect(dots).toHaveLength(3)
  })

  it('shows character count', () => {
    render(<CodeEditor value="const x = 1" onChange={vi.fn()} language="javascript" />)
    const charCount = screen.getByText(/1\/2,000/)
    expect(charCount).toBeInTheDocument()
  })

  it('calls onLimitExceeded when over limit', () => {
    const onLimitExceeded = vi.fn()
    render(
      <CodeEditor
        value="const x = 1"
        onChange={vi.fn()}
        language="javascript"
        onLimitExceeded={onLimitExceeded}
      />
    )
    expect(onLimitExceeded).toHaveBeenCalledWith(false)
  })

  it('shows over limit warning when exceeded', () => {
    const longValue = 'a'.repeat(2001)
    render(<CodeEditor value={longValue} onChange={vi.fn()} language="javascript" />)
    const charCount = screen.getByText(/2,001\/2,000/)
    expect(charCount).toBeInTheDocument()
  })
})
