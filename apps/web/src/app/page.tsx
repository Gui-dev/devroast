import { Button } from '@/components/ui/button'
import { CodeBlock, CodeBlockContent, CodeBlockHeader } from '@/components/ui/code-block'
import {
  LeaderboardCode,
  LeaderboardLanguage,
  LeaderboardRank,
  LeaderboardRow,
  LeaderboardScore,
} from '@/components/ui/leaderboard-row'
import { Link } from '@/components/ui/link'
import { Toggle } from '@/components/ui/toggle'

const codeExample = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}`

const leaderboardData = [
  {
    rank: 1,
    score: 2.1,
    codePreview: 'function calculateTotal(items) { var total = 0; ...',
    language: 'javascript',
  },
  {
    rank: 2,
    score: 3.5,
    codePreview: 'const calculateTotal = (items) => items.reduce...',
    language: 'javascript',
  },
  {
    rank: 3,
    score: 4.8,
    codePreview: 'function calculateTotal(items: Item[]): number { ...',
    language: 'typescript',
  },
]

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

      <div className="mx-auto w-full max-w-195">
        <CodeBlock>
          <CodeBlockHeader>calculate.js</CodeBlockHeader>
          <CodeBlockContent code={codeExample} lang="javascript" />
        </CodeBlock>
      </div>

      <div className="mx-auto flex w-full max-w-195 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Toggle label="roast mode" />
          <span className="font-sans text-xs text-text-tertiary">
            {'//'} maximum sarcasm enabled
          </span>
        </div>
        <Button>$ roast_my_code</Button>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
        <span className="font-sans text-xs text-text-tertiary sm:text-sm">2,847 codes roasted</span>
        <span className="hidden text-text-tertiary sm:block">·</span>
        <span className="font-sans text-xs text-text-tertiary sm:text-sm">avg score: 4.2/10</span>
      </div>

      <div className="h-4 sm:h-8" />

      <section className="mx-auto flex w-full max-w-240 flex-col gap-4 sm:gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-mono text-base font-bold text-text-primary sm:text-lg">
            {'//'} the worst code on the internet, ranked by shame
          </h2>
          <Link href="/leaderboard">$ view_all &gt;&gt;</Link>
        </div>

        <div className="flex flex-col border border-border-primary">
          {leaderboardData.map(item => (
            <LeaderboardRow key={item.rank}>
              <LeaderboardRank>{item.rank}</LeaderboardRank>
              <LeaderboardScore>{item.score}</LeaderboardScore>
              <LeaderboardCode>{item.codePreview}</LeaderboardCode>
              <LeaderboardLanguage>{item.language}</LeaderboardLanguage>
            </LeaderboardRow>
          ))}
        </div>

        <p className="text-center font-sans text-xs text-text-tertiary sm:text-sm">
          showing top 3 of 2,847 ·{' '}
          <Link href="/leaderboard" className="text-text-secondary">
            view full leaderboard &gt;&gt;
          </Link>
        </p>
      </section>

      <div className="h-4 sm:h-8" />
    </div>
  )
}
