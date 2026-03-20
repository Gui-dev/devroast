import { Navbar } from '@/components/navbar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CodeBlock } from '@/components/ui/code-block'
import { DiffLine } from '@/components/ui/diff-line'
import { LeaderboardRow } from '@/components/ui/leaderboard-row'
import { Link } from '@/components/ui/link'
import { ScoreRing } from '@/components/ui/score-ring'
import { Toggle } from '@/components/ui/toggle'

const codeExample = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}`

export default function ComponentsPage() {
  return (
    <main className="flex min-h-screen flex-col gap-16 bg-bg-page p-8">
      <section className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-text-primary">{'//'} component_library</h1>

        <div className="h-px w-full bg-border-primary" />
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-sm font-bold text-text-primary">
          <span className="text-accent-green">{'//'}</span> navbar
        </h2>

        <div className="border border-border-primary">
          <Navbar />
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-sm font-bold text-text-primary">
          <span className="text-accent-green">{'//'}</span> link
        </h2>

        <div className="flex flex-wrap items-center gap-4">
          <Link href="/leaderboard">leaderboard</Link>
          <Link href="/" className="text-accent-green">
            active link
          </Link>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-sm font-bold text-text-primary">
          <span className="text-accent-green">{'//'}</span> buttons
        </h2>

        <div className="flex flex-wrap items-center gap-4">
          <Button variant="default">$ roast_my_code</Button>
          <Button variant="secondary">$ share_roast</Button>
          <Button variant="link">$ view_all &gt;&gt;</Button>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">sm</Button>
          <Button size="default">default</Button>
          <Button size="lg">lg</Button>
          <Button disabled>disabled</Button>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-sm font-bold text-text-primary">
          <span className="text-accent-green">{'//'}</span> toggle
        </h2>

        <div className="flex flex-wrap items-center gap-8">
          <Toggle label="roast mode" defaultPressed />
          <Toggle label="roast mode" />
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-sm font-bold text-text-primary">
          <span className="text-accent-green">{'//'}</span> badge_status
        </h2>

        <div className="flex flex-wrap items-center gap-4">
          <Badge variant="critical">critical</Badge>
          <Badge variant="warning">warning</Badge>
          <Badge variant="good">good</Badge>
          <Badge variant="needs_serious_help">needs_serious_help</Badge>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-sm font-bold text-text-primary">
          <span className="text-accent-green">{'//'}</span> diff_line
        </h2>

        <div className="flex w-fit flex-col gap-1 overflow-hidden rounded-md border border-border-primary">
          <DiffLine variant="removed">var total = 0;</DiffLine>
          <DiffLine variant="added">const total = 0;</DiffLine>
          <DiffLine variant="context">for (let i = 0; i &lt; items.length; i++) {'{'}</DiffLine>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-sm font-bold text-text-primary">
          <span className="text-accent-green">{'//'}</span> code_block
        </h2>

        <CodeBlock code={codeExample} lang="javascript" filename="calculate.js" />
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-sm font-bold text-text-primary">
          <span className="text-accent-green">{'//'}</span> card
        </h2>

        <div className="flex flex-col gap-4">
          <Card
            variant="critical"
            title="using var instead of const/let"
            description="the var keyword is function-scoped rather than block-scoped, which can lead to unexpected behavior and bugs. modern javascript uses const for immutable bindings and let for mutable ones."
          />
          <Card
            variant="warning"
            title="missing error handling"
            description="the function does not handle errors or edge cases, which can lead to unexpected behavior when the input is invalid or the operation fails."
          />
          <Card
            variant="good"
            title="using const for immutable bindings"
            description="the code correctly uses const for values that should not be reassigned, making the code more predictable and easier to reason about."
          />
          <Card
            variant="needs_serious_help"
            title="eval usage detected"
            description="using eval() is extremely dangerous as it allows execution of arbitrary code and can lead to code injection attacks."
          />
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-sm font-bold text-text-primary">
          <span className="text-accent-green">{'//'}</span> leaderboard_row
        </h2>

        <div className="flex w-full max-w-2xl flex-col">
          <LeaderboardRow
            rank={1}
            score={2.1}
            codePreview="function calculateTotal(items) { var total = 0; ..."
            language="javascript"
          />
          <LeaderboardRow
            rank={2}
            score={4.5}
            codePreview="const calculateTotal = (items) => items.reduce..."
            language="javascript"
          />
          <LeaderboardRow
            rank={3}
            score={7.8}
            codePreview="function calculateTotal(items: Item[]): number { ..."
            language="typescript"
          />
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-sm font-bold text-text-primary">
          <span className="text-accent-green">{'//'}</span> score_ring
        </h2>

        <div className="flex flex-wrap items-center gap-8">
          <ScoreRing score={3.5} />
          <ScoreRing score={6.2} />
          <ScoreRing score={8.9} />
        </div>
      </section>
    </main>
  )
}
