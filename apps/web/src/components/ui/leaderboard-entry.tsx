import { cn } from '@/lib/cn'
import { type HTMLAttributes, forwardRef } from 'react'
import type { BundledLanguage } from 'shiki'
import { type VariantProps, tv } from 'tailwind-variants'
import { LeaderboardEntryCode } from '../leaderboard-entry-code'
import { CodeBlockClient } from './code-block/code-block-client'

const leaderboardEntryStyles = tv({
  base: ['border border-border-primary overflow-hidden'],
  variants: {
    variant: {
      critical: 'border-accent-red/30',
      warning: 'border-accent-amber/30',
      good: 'border-accent-green/30',
    },
  },
  defaultVariants: {
    variant: 'critical',
  },
})

export type LeaderboardEntryProps = VariantProps<typeof leaderboardEntryStyles> &
  HTMLAttributes<HTMLDivElement> & {
    rank: number
    score: number
    language: BundledLanguage
    code: string
    lineCount?: number
    filename?: string
  }

const LeaderboardEntry = forwardRef<HTMLDivElement, LeaderboardEntryProps>(
  ({ className, variant, rank, score, language, code, lineCount, filename, ...props }, ref) => {
    const getScoreVariant = (s: number) => {
      if (s >= 7) return 'critical'
      if (s >= 4) return 'warning'
      return 'good'
    }

    const scoreVariant = getScoreVariant(score)
    const safeCode = code ?? ''
    const effectiveLineCount = lineCount ?? (safeCode ? safeCode.split('\n').length : 0)

    return (
      <div
        ref={ref}
        className={cn(leaderboardEntryStyles({ variant: scoreVariant }), className)}
        {...props}
      >
        <div className="flex h-12 items-center justify-between border-b border-border-primary px-5">
          <div className="flex items-center gap-6">
            <span
              className={cn(
                'font-mono text-sm font-bold',
                rank === 1 && 'text-accent-amber',
                rank === 2 && 'text-text-secondary',
                rank === 3 && 'text-accent-red',
                rank > 3 && 'text-text-tertiary'
              )}
            >
              #{rank}
            </span>
            <span
              className={cn(
                'font-mono text-sm font-bold',
                scoreVariant === 'critical' && 'text-accent-red',
                scoreVariant === 'warning' && 'text-accent-amber',
                scoreVariant === 'good' && 'text-accent-green'
              )}
            >
              {score.toFixed(1)}/10
            </span>
            <span className="font-mono text-xs text-text-tertiary">{language}</span>
          </div>
          <span className="font-mono text-xs text-text-tertiary">anonymous</span>
        </div>
        <LeaderboardEntryCode lineCount={effectiveLineCount}>
          <CodeBlockClient code={safeCode} lang={language} className="border-0" />
        </LeaderboardEntryCode>
      </div>
    )
  }
)

LeaderboardEntry.displayName = 'LeaderboardEntry'

export { LeaderboardEntry, leaderboardEntryStyles }
