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
          'flex flex-wrap items-center gap-2 border-b border-border-primary px-3 py-3 sm:gap-4 sm:px-4 sm:py-4 md:gap-6 md:px-5',
          className
        )}
        {...props}
      >
        <span className="w-6 font-mono text-[11px] text-text-tertiary sm:w-10 sm:text-[13px]">
          #{rank}
        </span>
        <span className="w-10 font-mono text-[11px] font-bold text-accent-red sm:w-[60px] sm:text-[13px]">
          {score}
        </span>
        <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-text-secondary sm:text-[12px]">
          {codePreview}
        </span>
        <span className="hidden w-[100px] font-mono text-[11px] text-text-tertiary sm:block sm:text-[12px] md:text-[13px]">
          {language}
        </span>
      </div>
    )
  }
)

LeaderboardRow.displayName = 'LeaderboardRow'

export { LeaderboardRow }
