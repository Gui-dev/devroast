import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AnimatedMetrics } from './animated-metrics'

vi.mock('@/app/hooks/use-metrics', () => ({
  fetchMetrics: vi.fn(),
}))

vi.mock('@number-flow/react', () => ({
  default: ({ value }: { value: number }) => <span>{value}</span>,
}))

import { fetchMetrics } from '@/app/hooks/use-metrics'

const mockedFetchMetrics = vi.mocked(fetchMetrics)

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('<AnimatedMetrics />', () => {
  it('renders placeholder data when loading', () => {
    mockedFetchMetrics.mockReturnValue(new Promise(() => {}))

    render(<AnimatedMetrics />, { wrapper: createWrapper() })

    const zeros = screen.getAllByText('0')
    expect(zeros).toHaveLength(2)
    expect(screen.getByText('codes roasted')).toBeInTheDocument()
    expect(screen.getByText(/\/10/)).toBeInTheDocument()
  })

  it('renders metrics data after fetch resolves', async () => {
    mockedFetchMetrics.mockResolvedValue({ totalRoasts: 150, avgScore: 7.3 })

    render(<AnimatedMetrics />, { wrapper: createWrapper() })

    expect(await screen.findByText('150')).toBeInTheDocument()
    expect(screen.getByText('7.3')).toBeInTheDocument()
  })

  it('renders "codes roasted" and "avg score" labels', () => {
    mockedFetchMetrics.mockReturnValue(new Promise(() => {}))

    render(<AnimatedMetrics />, { wrapper: createWrapper() })

    expect(screen.getByText('codes roasted')).toBeInTheDocument()
    expect(screen.getByText(/avg score/)).toBeInTheDocument()
  })
})
