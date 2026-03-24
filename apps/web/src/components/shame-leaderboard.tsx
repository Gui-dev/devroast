'use client'

import { fetchWorstRoasts } from '@/app/hooks/use-worst-roasts'
import {
  LeaderboardCode,
  LeaderboardLanguage,
  LeaderboardRank,
  LeaderboardRow,
  LeaderboardScore,
} from '@/components/ui/leaderboard-row'
import { useQuery } from '@tanstack/react-query'

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
      {roasts.map(item => (
        <LeaderboardRow key={item.id}>
          <LeaderboardRank>{item.rank}</LeaderboardRank>
          <LeaderboardScore>{item.score}</LeaderboardScore>
          <LeaderboardCode>{item.codePreview}</LeaderboardCode>
          <LeaderboardLanguage>{item.language}</LeaderboardLanguage>
        </LeaderboardRow>
      ))}
    </div>
  )
}
