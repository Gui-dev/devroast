'use client'

import { fetchWorstRoasts } from '@/app/hooks/use-worst-roasts'
import { LeaderboardEntryCode } from '@/components/leaderboard-entry-code'
import { CodeBlockClient } from '@/components/ui/code-block/code-block-client'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import type { BundledLanguage } from 'shiki'

function scoreColor(score: number): string {
  if (score <= 3) return 'text-accent-red'
  if (score <= 6) return 'text-accent-amber'
  return 'text-accent-green'
}

function ShameLeaderboardHeader() {
  return (
    <div className="flex h-10 items-center gap-4 border-b border-border-primary bg-bg-surface px-5 sm:gap-6">
      <span className="w-10 font-mono text-[12px] font-medium text-text-tertiary">#</span>
      <span className="w-[60px] font-mono text-[12px] font-medium text-text-tertiary">score</span>
      <span className="flex-1 font-mono text-[12px] font-medium text-text-tertiary">code</span>
      <span className="hidden w-[100px] font-mono text-[12px] font-medium text-text-tertiary sm:block">
        lang
      </span>
    </div>
  )
}

function ShameLeaderboardItem({
  item,
}: {
  item: {
    id: string
    rank: number
    score: number
    language: string
    code: string
    lineCount: number
  }
}) {
  return (
    <article key={item.id} className="flex flex-col border border-border-primary overflow-hidden">
      <div className="flex h-12 items-center justify-between border-b border-border-primary px-5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[13px] text-text-tertiary">#</span>
            <span className="font-mono text-[13px] font-bold text-accent-amber">{item.rank}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs text-text-tertiary">score:</span>
            <span className={`font-mono text-[13px] font-bold ${scoreColor(item.score)}`}>
              {item.score.toFixed(1)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-text-secondary">{item.language}</span>
          <span className="font-mono text-xs text-text-tertiary">{item.lineCount} lines</span>
        </div>
      </div>
      <LeaderboardEntryCode lineCount={item.lineCount}>
        <CodeBlockClient
          code={item.code}
          lang={item.language as BundledLanguage}
          className="border-0"
        />
      </LeaderboardEntryCode>
    </article>
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
      <ShameLeaderboardHeader />
      {roasts.map(item => (
        <ShameLeaderboardItem key={item.id} item={item} />
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
      <div className="flex flex-col border border-border-primary">
        <ShameLeaderboardHeader />
        {roasts.map(item => (
          <ShameLeaderboardItem key={item.id} item={item} />
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
