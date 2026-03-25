import { fetchMetrics } from '@/app/hooks/use-metrics'
import { fetchWorstRoasts } from '@/app/hooks/use-worst-roasts'
import { ShameLeaderboard } from '@/components/shame-leaderboard'
import { ShameLeaderboardFooter } from '@/components/shame-leaderboard-footer'
import { ShameLeaderboardSkeleton } from '@/components/shame-leaderboard-skeleton'
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

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ShameLeaderboardSkeleton />}>
        <ShameLeaderboard />
        <ShameLeaderboardFooter />
      </Suspense>
    </HydrationBoundary>
  )
}
