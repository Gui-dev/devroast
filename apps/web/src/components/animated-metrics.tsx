'use client'

import { fetchMetrics } from '@/app/hooks/use-metrics'
import type { Metrics } from '@/components/metrics-types'
import NumberFlow from '@number-flow/react'
import { useQuery } from '@tanstack/react-query'

export function AnimatedMetrics() {
  const { data } = useQuery<Metrics>({
    queryKey: ['metrics'],
    queryFn: fetchMetrics,
  })

  if (!data) return null

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
      <span className="font-sans text-xs text-text-tertiary sm:text-sm">
        <NumberFlow value={data.totalRoasts} />
        {' codes roasted'}
      </span>
      <span className="hidden text-text-tertiary sm:block">·</span>
      <span className="font-sans text-xs text-text-tertiary sm:text-sm">
        {'avg score: '}
        <NumberFlow value={data.avgScore} />
        /10
      </span>
    </div>
  )
}
