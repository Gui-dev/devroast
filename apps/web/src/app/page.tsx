import { Button } from '@/components/ui/button'
import { CodeBlock } from '@/components/ui/code-block'
import { LeaderboardRow } from '@/components/ui/leaderboard-row'
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
    <div className="flex flex-col gap-8 px-10 py-20">
      <div className="flex flex-col gap-3 text-center">
        <h1 className="font-mono text-4xl font-bold">
          <span className="text-accent-green">$ </span>
          <span className="text-text-primary">paste your code. get roasted.</span>
        </h1>
        <p className="font-sans text-sm text-text-secondary">
          {'//'} drop your code below and we&apos;ll rate it — brutally honest or full roast mode
        </p>
      </div>

      <div className="mx-auto w-[780px]">
        <CodeBlock code={codeExample} lang="javascript" />
      </div>

      <div className="mx-auto flex w-[780px] items-center justify-between">
        <div className="flex items-center gap-4">
          <Toggle label="roast mode" />
          <span className="font-sans text-xs text-text-tertiary">
            {'//'} maximum sarcasm enabled
          </span>
        </div>
        <Button>$ roast_my_code</Button>
      </div>

      <div className="flex items-center justify-center gap-6">
        <span className="font-sans text-xs text-text-tertiary">2,847 codes roasted</span>
        <span className="text-text-tertiary">·</span>
        <span className="font-sans text-xs text-text-tertiary">avg score: 4.2/10</span>
      </div>

      <div className="h-8" />

      <section className="mx-auto flex w-[960px] flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-lg font-bold text-text-primary">
            {'//'} the worst code on the internet, ranked by shame
          </h2>
          <Button variant="link">$ view_all &gt;&gt;</Button>
        </div>

        <div className="flex flex-col border border-border-primary">
          {leaderboardData.map(item => (
            <LeaderboardRow key={item.rank} {...item} />
          ))}
        </div>

        <p className="text-center font-sans text-xs text-text-tertiary">
          showing top 3 of 2,847 · view full leaderboard &gt;&gt;
        </p>
      </section>

      <div className="h-8" />
    </div>
  )
}
