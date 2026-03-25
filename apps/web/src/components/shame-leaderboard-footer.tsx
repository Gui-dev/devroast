import { Link } from '@/components/ui/link'

export function ShameLeaderboardFooter({ total }: { total: number | string }) {
  return (
    <p className="py-3 text-center font-sans text-xs text-text-tertiary sm:text-sm">
      {'showing top 3 of '}
      {total}
      {' · '}
      <Link href="/leaderboard" className="text-text-secondary">
        view full leaderboard &gt;&gt;
      </Link>
    </p>
  )
}
