'use cache'
import { fetchLeaderboard } from '@/app/hooks/use-leaderboard'
import { fetchMetrics } from '@/app/hooks/use-metrics'
import { LeaderboardClient } from '@/components/leaderboard-client'
import { getQueryClient } from '@/lib/get-query-client'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import type { Metadata } from 'next'
import { cacheLife } from 'next/cache'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Shame Leaderboard | devroast',
  description: 'The most roasted code on the internet, ranked by shame.',
}

export default async function LeaderboardPage() {
  cacheLife('hours')

  const queryClient = getQueryClient()

  const [metricsData] = await Promise.all([
    queryClient.fetchQuery({
      queryKey: ['metrics'],
      queryFn: fetchMetrics,
    }),
    queryClient.prefetchQuery({
      queryKey: ['leaderboard'],
      queryFn: fetchLeaderboard,
    }),
  ])

  const totalSubmissions = metricsData?.totalRoasts ?? 0
  const avgScore = metricsData?.avgScore ?? 0

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-col gap-6 px-4 sm:gap-8 sm:px-6 md:px-10 py-8 md:py-10 lg:py-16">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-2xl font-bold text-accent-green sm:text-3xl lg:text-4xl">
              &gt;
            </span>
            <h1 className="font-mono text-2xl font-bold text-text-primary sm:text-3xl lg:text-4xl">
              shame_leaderboard
            </h1>
          </div>
          <p className="font-mono text-xs text-text-secondary sm:text-sm">
            {'//'} the most roasted code on the internet
          </p>
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-text-tertiary sm:text-sm">
            <span>{totalSubmissions.toLocaleString()} submissions</span>
            <span>·</span>
            <span>avg score: {avgScore}/10</span>
          </div>
        </div>

        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense
            fallback={
              <div className="flex flex-col gap-5">
                {Array.from({ length: 5 }, (_, i) => (
                  <div
                    key={`skeleton-${i.toString()}`}
                    className="border border-border-primary overflow-hidden"
                  >
                    <div className="flex h-12 items-center gap-6 border-b border-border-primary px-5">
                      <span className="inline-block w-6 h-4 animate-pulse bg-text-tertiary/20 rounded" />
                      <span className="inline-block w-12 h-4 animate-pulse bg-text-tertiary/20 rounded" />
                      <span className="inline-block w-16 h-4 animate-pulse bg-text-tertiary/20 rounded" />
                    </div>
                    <div className="h-32 bg-bg-input animate-pulse" />
                  </div>
                ))}
              </div>
            }
          >
            <LeaderboardClient />
          </Suspense>
        </HydrationBoundary>
      </div>
    </div>
  )
}
