import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { HomeClient } from './home-client'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('@/app/hooks/use-create-roast', () => ({
  useCreateRoast: () => ({ mutate: vi.fn(), isPending: false }),
}))

vi.mock('@/components/ui/code-editor', () => ({
  CodeEditor: ({
    onChange,
    onLimitExceeded,
  }: {
    onChange: (v: string) => void
    onLimitExceeded: (exceeded: boolean) => void
    value: string
    language: string | null
    onLanguageChange: (lang: string | null) => void
  }) => (
    <div data-testid="code-editor">
      <button type="button" data-testid="trigger-change" onClick={() => onChange('test code')}>
        type
      </button>
      <button type="button" data-testid="trigger-limit" onClick={() => onLimitExceeded(true)}>
        exceed
      </button>
      <button type="button" data-testid="trigger-limit-ok" onClick={() => onLimitExceeded(false)}>
        ok
      </button>
    </div>
  ),
}))

vi.mock('@/components/ui/toggle', () => ({
  Toggle: ({ label }: { label?: string }) => <button type="button">{label ?? 'toggle'}</button>,
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    disabled,
  }: {
    children: React.ReactNode
    disabled?: boolean
  }) => (
    <button type="submit" disabled={disabled}>
      {children}
    </button>
  ),
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('<HomeClient />', () => {
  it('renders code editor and toggle', () => {
    render(<HomeClient />, { wrapper: createWrapper() })

    expect(screen.getByTestId('code-editor')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'roast mode' })).toBeInTheDocument()
  })

  it('renders submit button', () => {
    render(<HomeClient />, { wrapper: createWrapper() })

    expect(screen.getByRole('button', { name: '$ roast_my_code' })).toBeInTheDocument()
  })

  it('disables submit button when code is empty', () => {
    render(<HomeClient />, { wrapper: createWrapper() })

    const button = screen.getByRole('button', { name: '$ roast_my_code' }) as HTMLButtonElement
    expect(button.disabled).toBe(true)
  })

  it('shows limit exceeded warning when isOverLimit is true', async () => {
    const user = userEvent.setup()
    render(<HomeClient />, { wrapper: createWrapper() })

    expect(screen.queryByText('limite de 2.000 caracteres excedido')).not.toBeInTheDocument()

    await user.click(screen.getByTestId('trigger-limit'))

    expect(await screen.findByText('limite de 2.000 caracteres excedido')).toBeInTheDocument()
  })

  it('hides limit warning when isOverLimit becomes false', async () => {
    const user = userEvent.setup()
    render(<HomeClient />, { wrapper: createWrapper() })

    await user.click(screen.getByTestId('trigger-limit'))
    expect(await screen.findByText('limite de 2.000 caracteres excedido')).toBeInTheDocument()

    await user.click(screen.getByTestId('trigger-limit-ok'))
    expect(screen.queryByText('limite de 2.000 caracteres excedido')).not.toBeInTheDocument()
  })
})
