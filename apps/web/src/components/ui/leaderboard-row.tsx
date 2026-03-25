'use client'

import { CodeBlockClient } from '@/components/ui/code-block/code-block-client'
import { cn } from '@/lib/cn'
import { type HTMLAttributes, forwardRef, useState } from 'react'
import type { BundledLanguage } from 'shiki'

export type LeaderboardRowProps = HTMLAttributes<HTMLDivElement>

const LeaderboardRow = forwardRef<HTMLDivElement, LeaderboardRowProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-wrap items-center gap-4 border-b border-border-primary px-5 py-4 sm:gap-6 md:gap-6',
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

type LeaderboardCodeCollapsibleProps = HTMLAttributes<HTMLDivElement> & {
  fullCode: string
  language: BundledLanguage
}

const LeaderboardCodeCollapsible = forwardRef<HTMLDivElement, LeaderboardCodeCollapsibleProps>(
  ({ className, fullCode = '', language, ...props }, ref) => {
    const [isExpanded, setIsExpanded] = useState(false)

    const lines = fullCode.split('\n')
    const previewCode = lines.slice(0, 3).join('\n')
    const hasMoreLines = lines.length > 3

    return (
      <div ref={ref} className={cn('min-w-0 flex-1', className)} {...props}>
        {isExpanded ? (
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="self-start font-mono text-[11px] text-text-tertiary hover:text-text-secondary sm:text-[12px]"
            >
              [- collapse code]
            </button>
            <CodeBlockClient code={fullCode} lang={language} />
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <CodeBlockClient code={previewCode} lang={language} />
            {hasMoreLines && (
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="self-start font-mono text-[11px] text-text-tertiary hover:text-text-secondary sm:text-[12px]"
              >
                [+ expand code]
              </button>
            )}
          </div>
        )}
      </div>
    )
  }
)

LeaderboardCodeCollapsible.displayName = 'LeaderboardCodeCollapsible'

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

export {
  LeaderboardRow,
  LeaderboardRank,
  LeaderboardScore,
  LeaderboardCode,
  LeaderboardCodeCollapsible,
  LeaderboardLanguage,
}
