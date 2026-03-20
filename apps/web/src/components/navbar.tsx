'use client'

import { Link } from '@/components/ui/link'

export function Navbar() {
  return (
    <nav className="flex h-14 items-center justify-between border-b border-border-primary px-10">
      <div className="flex items-center gap-2">
        <span className="font-mono text-xl font-bold text-accent-green">&gt;</span>
        <span className="font-mono text-lg font-medium text-text-primary">devroast</span>
      </div>
      <Link href="/leaderboard">leaderboard</Link>
    </nav>
  )
}
