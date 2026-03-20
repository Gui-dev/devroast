import { cn } from '@/lib/cn'
import { type HTMLAttributes, forwardRef } from 'react'

export type LeaderboardRowProps = HTMLAttributes<HTMLDivElement> & {
  rank: number | string
  score: number | string
  codePreview: string
  language: string
}

const LeaderboardRow = forwardRef<HTMLDivElement, LeaderboardRowProps>(
  ({ className, rank, score, codePreview, language, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-6 border-b border-border-primary px-5 py-4',
          className
        )}
        {...props}
      >
        <span className="w-10 font-mono text-[13px] text-text-tertiary">#{rank}</span>
        <span className="w-[60px] font-mono text-[13px] font-bold text-accent-red">{score}</span>
        <span className="flex-1 truncate font-mono text-[12px] text-text-secondary">
          {codePreview}
        </span>
        <span className="w-[100px] font-mono text-[12px] text-text-tertiary">{language}</span>
      </div>
    )
  }
)

LeaderboardRow.displayName = 'LeaderboardRow'

export { LeaderboardRow }
