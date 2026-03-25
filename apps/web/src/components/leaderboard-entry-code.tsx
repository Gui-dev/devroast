'use client'

import { type ReactNode, useState } from 'react'

const COLLAPSED_HEIGHT = 120
const COLLAPSIBLE_THRESHOLD = 5

type LeaderboardEntryCodeProps = {
  children: ReactNode
  lineCount: number
}

export function LeaderboardEntryCode({ children, lineCount }: LeaderboardEntryCodeProps) {
  const [open, setOpen] = useState(false)

  if (lineCount <= COLLAPSIBLE_THRESHOLD) {
    return <>{children}</>
  }

  return (
    <div className="flex flex-col">
      <div
        className="relative overflow-hidden transition-[max-height] duration-300 ease-in-out"
        style={open ? { maxHeight: 'none' } : { maxHeight: COLLAPSED_HEIGHT }}
      >
        {children}
        {!open && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-bg-input to-transparent" />
        )}
      </div>
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="flex w-full items-center justify-center gap-1.5 border-t border-border-primary py-2 font-mono text-xs text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary"
      >
        {open ? 'show less' : 'show more'}
      </button>
    </div>
  )
}
