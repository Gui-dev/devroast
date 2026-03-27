'use client'

import { fetchWorstRoasts } from '@/app/hooks/use-worst-roasts'
import { LeaderboardEntry } from '@/components/ui/leaderboard-entry'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import type { BundledLanguage } from 'shiki'

export function ShameLeaderboard() {
  const { data: roasts } = useQuery({
    queryKey: ['worstRoasts'],
    queryFn: fetchWorstRoasts,
  })

  if (!roasts || roasts.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-5">
      {roasts.map(item => (
        <LeaderboardEntry
          key={item.id}
          rank={item.rank}
          score={item.score}
          language={item.language as BundledLanguage}
          code={item.code}
          lineCount={item.lineCount}
        />
      ))}
    </div>
  )
}

export function ShameLeaderboardWithFooter({ total }: { total: number | string }) {
  const { data: roasts } = useQuery({
    queryKey: ['worstRoasts'],
    queryFn: fetchWorstRoasts,
  })

  if (!roasts || roasts.length === 0) {
    return null
  }

  return (
    <>
      <div className="flex flex-col gap-5">
        {roasts.map(item => (
          <LeaderboardEntry
            key={item.id}
            rank={item.rank}
            score={item.score}
            language={item.language as BundledLanguage}
            code={item.code}
            lineCount={item.lineCount}
          />
        ))}
      </div>
      <p className="font-mono text-xs text-text-tertiary text-center">
        showing top 3 of {total.toLocaleString()} ·{' '}
        <Link
          href="/leaderboard"
          className="text-text-secondary hover:text-text-primary transition-colors"
        >
          view full leaderboard &gt;&gt;
        </Link>
      </p>
    </>
  )
}
