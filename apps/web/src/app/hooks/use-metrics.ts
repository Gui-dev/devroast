import type { Metrics } from '@/components/metrics-types'

export async function fetchMetrics(): Promise<Metrics> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333'
  const response = await fetch(`${baseUrl}/metrics`)

  if (!response.ok) {
    throw new Error('Failed to fetch metrics')
  }

  return response.json()
}
