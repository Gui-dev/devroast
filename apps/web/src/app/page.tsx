import { HomeClient } from '@/components/home-client'
import { MetricsServer } from '@/components/metrics-server'
import { ShameLeaderboardSection } from '@/components/shame-leaderboard-section'
import { Link } from '@/components/ui/link'

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6 px-4 sm:gap-8 sm:px-6 md:px-10 py-12 sm:py-16 md:py-20">
      <div className="flex flex-col gap-3 text-center">
        <h1 className="font-mono text-2xl font-bold text-text-primary sm:text-3xl lg:text-4xl">
          <span className="text-accent-green">$ </span>
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
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-mono text-base font-bold text-text-primary sm:text-lg">
            {'//'} the worst code on the internet, ranked by shame
          </h2>
          <Link href="/leaderboard">$ view_all &gt;&gt;</Link>
        </div>

        <ShameLeaderboardSection />
      </section>

      <div className="h-4 sm:h-8" />
    </div>
  )
}
