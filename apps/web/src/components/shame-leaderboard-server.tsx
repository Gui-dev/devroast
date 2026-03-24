import { fetchWorstRoasts } from '@/app/hooks/use-worst-roasts'
import { ShameLeaderboard } from '@/components/shame-leaderboard'
import { ShameLeaderboardSkeleton } from '@/components/shame-leaderboard-skeleton'
import { getQueryClient } from '@/lib/get-query-client'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { Suspense } from 'react'

export async function ShameLeaderboardServer() {
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['worstRoasts'],
    queryFn: fetchWorstRoasts,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ShameLeaderboardSkeleton />}>
        <ShameLeaderboard />
      </Suspense>
    </HydrationBoundary>
  )
}
