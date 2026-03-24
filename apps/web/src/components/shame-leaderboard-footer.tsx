'use client'

import { fetchMetrics } from '@/app/hooks/use-metrics'
import type { Metrics } from '@/components/metrics-types'
import { Link } from '@/components/ui/link'
import { useQuery } from '@tanstack/react-query'

export function ShameLeaderboardFooter() {
  const { data } = useQuery<Metrics>({
    queryKey: ['metrics'],
    queryFn: fetchMetrics,
    placeholderData: { totalRoasts: 0, avgScore: 0 },
  })

  const total = data?.totalRoasts ?? '...'

  return (
    <p className="text-center font-sans text-xs text-text-tertiary sm:text-sm">
      {'showing top 3 of '}
      {total}
      {' · '}
      <Link href="/leaderboard" className="text-text-secondary">
        view full leaderboard &gt;&gt;
      </Link>
    </p>
  )
}
