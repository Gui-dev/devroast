import { fetchMetrics } from '@/app/hooks/use-metrics'
import { fetchWorstRoasts } from '@/app/hooks/use-worst-roasts'
import type { Metrics } from '@/components/metrics-types'
import { ShameLeaderboard } from '@/components/shame-leaderboard'
import { ShameLeaderboardSkeleton } from '@/components/shame-leaderboard-skeleton'
import { Link } from '@/components/ui/link'
import { getQueryClient } from '@/lib/get-query-client'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { Suspense } from 'react'

export async function ShameLeaderboardSection() {
  const queryClient = getQueryClient()

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['metrics'],
      queryFn: fetchMetrics,
    }),
    queryClient.prefetchQuery({
      queryKey: ['worstRoasts'],
      queryFn: fetchWorstRoasts,
    }),
  ])

  const metrics = queryClient.getQueryData<Metrics>(['metrics'])

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ShameLeaderboardSkeleton />}>
        <ShameLeaderboard />
      </Suspense>

      <p className="text-center font-sans text-xs text-text-tertiary sm:text-sm">
        {'showing top 3 of '}
        {metrics?.totalRoasts ?? '...'}
        {' · '}
        <Link href="/leaderboard" className="text-text-secondary">
          view full leaderboard &gt;&gt;
        </Link>
      </p>
    </HydrationBoundary>
  )
}
