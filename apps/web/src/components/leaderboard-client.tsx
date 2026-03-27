'use client'

import { fetchLeaderboard } from '@/app/hooks/use-leaderboard'
import { LeaderboardEntry } from '@/components/ui/leaderboard-entry'
import { useQuery } from '@tanstack/react-query'
import type { BundledLanguage } from 'shiki'

export function LeaderboardClient() {
  const { data: entries } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: fetchLeaderboard,
  })

  if (!entries || entries.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-5">
      {entries.map(entry => (
        <LeaderboardEntry
          key={entry.id}
          rank={entry.rank}
          score={entry.score}
          language={entry.language as BundledLanguage}
          code={entry.code}
          lineCount={entry.lineCount}
        />
      ))}
    </div>
  )
}
