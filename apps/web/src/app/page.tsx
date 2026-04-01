'use cache'
import { HomeClient } from '@/components/home-client'
import { MetricsServer } from '@/components/metrics-server'
import { ShameLeaderboardSection } from '@/components/shame-leaderboard-section'
import { Link } from '@/components/ui/link'
import { cacheLife } from 'next/cache'

export default async function HomePage() {
  cacheLife('hours')
  return (
    <div className="flex flex-col gap-6 px-4 sm:gap-8 sm:px-6 md:px-10 py-12 sm:py-16 md:py-20">
      <div className="flex flex-col gap-3 text-center">
        <h1 className="font-mono text-2xl font-bold text-text-primary sm:text-3xl lg:text-4xl">
          <span className="text-accent-yellow">$ </span>
          <span>paste your code. get roasted.</span>
        </h1>
        <p className="font-sans text-sm text-text-secondary">
          {'//'} drop your code below and we&apos;ll rate it — brutally honest or full roast mode
        </p>
      </div>

      <HomeClient />

      <MetricsServer />

      <div className="h-4 sm:h-8" />

      <section className="mx-auto flex w-full max-w-240 flex-col gap-4 sm:gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-accent-yellow">{'//'}</span>
            <h2 className="font-mono text-sm font-bold text-text-primary">shame_leaderboard</h2>
          </div>
          <Link
            href="/leaderboard"
            className="rounded border border-border-primary px-3 py-1.5 font-mono text-xs text-text-secondary no-underline transition-colors hover:text-text-primary"
          >
            $ view_all &gt;&gt;
          </Link>
        </div>

        <p className="font-mono text-[13px] text-text-tertiary">
          {'//'} the worst code on the internet, ranked by shame
        </p>

        <ShameLeaderboardSection />
      </section>

      <div className="h-4 sm:h-8" />
    </div>
  )
}
