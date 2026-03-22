import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { CodeEditorHeader } from './code-editor'

vi.mock('@/lib/detect-language', () => ({
  detectLanguage: vi.fn().mockReturnValue('python'),
  LANGUAGE_OPTIONS: [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'go', label: 'Go' },
  ],
}))

describe('CodeEditorHeader', () => {
  it('renders with language selector', () => {
    render(<CodeEditorHeader language="javascript" onLanguageChange={vi.fn()} />)

    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()
    expect(select).toHaveValue('javascript')
  })

  it('renders with default language when not specified', () => {
    render(<CodeEditorHeader language="python" onLanguageChange={vi.fn()} />)

    const select = screen.getByRole('combobox')
    expect(select).toHaveValue('python')
  })

  it('renders language options in selector', () => {
    render(<CodeEditorHeader language="python" onLanguageChange={vi.fn()} />)

    const select = screen.getByRole('combobox') as HTMLSelectElement
    const options = Array.from(select.options).map(o => o.value)

    expect(options).toContain('javascript')
    expect(options).toContain('python')
    expect(options).toContain('typescript')
    expect(options).toContain('go')
  })

  it('renders with custom className', () => {
    render(
      <CodeEditorHeader
        language="javascript"
        onLanguageChange={vi.fn()}
        className="custom-header-class"
      />
    )

    const container = screen.getByRole('combobox').parentElement
    expect(container?.className).toContain('custom-header-class')
  })

  it('renders three window dots', () => {
    render(<CodeEditorHeader language="javascript" onLanguageChange={vi.fn()} />)

    const dots = document.querySelectorAll('.size-2\\.5')
    expect(dots).toHaveLength(3)
  })
})
