import { fetchMetrics } from '@/app/hooks/use-metrics'
import { AnimatedMetrics } from '@/components/animated-metrics'
import { MetricsSkeleton } from '@/components/metrics-skeleton'
import { getQueryClient } from '@/lib/get-query-client'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { Suspense } from 'react'

export interface Metrics {
  totalRoasts: number
  avgScore: number
}

export async function MetricsServer() {
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['metrics'],
    queryFn: fetchMetrics,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<MetricsSkeleton />}>
        <AnimatedMetrics />
      </Suspense>
    </HydrationBoundary>
  )
}
