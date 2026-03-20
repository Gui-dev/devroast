import { cn } from '@/lib/cn'
import { type HTMLAttributes, forwardRef } from 'react'

export type LeaderboardRowProps = HTMLAttributes<HTMLDivElement>

const LeaderboardRow = forwardRef<HTMLDivElement, LeaderboardRowProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-wrap items-center gap-2 border-b border-border-primary px-3 py-3 sm:gap-4 sm:px-4 sm:py-4 md:gap-6 md:px-5',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

LeaderboardRow.displayName = 'LeaderboardRow'

const LeaderboardRank = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'w-6 font-mono text-[11px] text-text-tertiary sm:w-10 sm:text-[13px]',
          className
        )}
        {...props}
      >
        #{children}
      </span>
    )
  }
)

LeaderboardRank.displayName = 'LeaderboardRank'

const LeaderboardScore = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'w-10 font-mono text-[11px] font-bold text-accent-red sm:w-[60px] sm:text-[13px]',
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)

LeaderboardScore.displayName = 'LeaderboardScore'

const LeaderboardCode = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'min-w-0 flex-1 truncate font-mono text-[11px] text-text-secondary sm:text-[12px]',
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)

LeaderboardCode.displayName = 'LeaderboardCode'

const LeaderboardLanguage = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'hidden w-[100px] font-mono text-[11px] text-text-tertiary sm:block sm:text-[12px] md:text-[13px]',
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)

LeaderboardLanguage.displayName = 'LeaderboardLanguage'

export { LeaderboardRow, LeaderboardRank, LeaderboardScore, LeaderboardCode, LeaderboardLanguage }
