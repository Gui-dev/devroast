'use client'

import { fetchWorstRoasts } from '@/app/hooks/use-worst-roasts'
import {
  LeaderboardCodeCollapsible,
  LeaderboardLanguage,
  LeaderboardRank,
  LeaderboardRow,
  LeaderboardScore,
} from '@/components/ui/leaderboard-row'
import { useQuery } from '@tanstack/react-query'
import type { BundledLanguage } from 'shiki'

function TableHeader() {
  return (
    <div className="flex h-10 items-center gap-4 bg-bg-surface px-5 py-0 sm:gap-6 md:gap-6">
      <span className="w-6 font-mono text-[12px] font-medium text-text-tertiary sm:w-10">#</span>
      <span className="w-[60px] font-mono text-[12px] font-medium text-text-tertiary">score</span>
      <span className="flex-1 font-mono text-[12px] font-medium text-text-tertiary">code</span>
      <span className="hidden w-[100px] font-mono text-[12px] font-medium text-text-tertiary sm:block">
        lang
      </span>
    </div>
  )
}

export function ShameLeaderboard() {
  const { data: roasts } = useQuery({
    queryKey: ['worstRoasts'],
    queryFn: fetchWorstRoasts,
  })

  if (!roasts || roasts.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col border border-border-primary">
      <TableHeader />
      {roasts.map(item => (
        <LeaderboardRow key={item.id}>
          <LeaderboardRank>{item.rank}</LeaderboardRank>
          <LeaderboardScore>{item.score}</LeaderboardScore>
          <LeaderboardCodeCollapsible
            codePreview={item.codePreview}
            fullCode={item.code}
            language={item.language as BundledLanguage}
          />
          <LeaderboardLanguage>{item.language}</LeaderboardLanguage>
        </LeaderboardRow>
      ))}
    </div>
  )
}
