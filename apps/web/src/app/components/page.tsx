import { Navbar } from '@/components/navbar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CodeBlock, CodeBlockHeader } from '@/components/ui/code-block'
import { DiffLine } from '@/components/ui/diff-line'
import {
  LeaderboardCode,
  LeaderboardLanguage,
  LeaderboardRank,
  LeaderboardRow,
  LeaderboardScore,
} from '@/components/ui/leaderboard-row'
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
    <main className="flex min-h-screen flex-col gap-12 bg-bg-page px-4 py-8 sm:gap-16 sm:px-6 md:px-8">
      <section className="flex flex-col gap-6">
        <h1 className="text-xl font-bold text-text-primary sm:text-2xl">
          {'//'} component_library
        </h1>

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

        <div className="overflow-hidden rounded-md border border-border-primary">
          <CodeBlockHeader filename="calculate.js" />
          <CodeBlock code={codeExample} lang="javascript" />
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-sm font-bold text-text-primary">
          <span className="text-accent-green">{'//'}</span> card
        </h2>

        <div className="flex flex-col gap-4">
          <Card variant="critical">
            <CardHeader>
              <Badge variant="critical" />
            </CardHeader>
            <CardTitle>using var instead of const/let</CardTitle>
            <CardDescription>
              the var keyword is function-scoped rather than block-scoped, which can lead to
              unexpected behavior and bugs. modern javascript uses const for immutable bindings and
              let for mutable ones.
            </CardDescription>
          </Card>

          <Card variant="warning">
            <CardHeader>
              <Badge variant="warning" />
            </CardHeader>
            <CardTitle>missing error handling</CardTitle>
            <CardDescription>
              the function does not handle errors or edge cases, which can lead to unexpected
              behavior when the input is invalid or the operation fails.
            </CardDescription>
          </Card>

          <Card variant="good">
            <CardHeader>
              <Badge variant="good" />
            </CardHeader>
            <CardTitle>using const for immutable bindings</CardTitle>
            <CardDescription>
              the code correctly uses const for values that should not be reassigned, making the
              code more predictable and easier to reason about.
            </CardDescription>
          </Card>

          <Card variant="needs_serious_help">
            <CardHeader>
              <Badge variant="needs_serious_help" />
            </CardHeader>
            <CardTitle>eval usage detected</CardTitle>
            <CardDescription>
              using eval() is extremely dangerous as it allows execution of arbitrary code and can
              lead to code injection attacks.
            </CardDescription>
          </Card>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-sm font-bold text-text-primary">
          <span className="text-accent-green">{'//'}</span> leaderboard_row
        </h2>

        <div className="flex w-full max-w-2xl flex-col">
          <LeaderboardRow>
            <LeaderboardRank>1</LeaderboardRank>
            <LeaderboardScore>2.1</LeaderboardScore>
            <LeaderboardCode>
              function calculateTotal(items) {'{'} var total = 0; ...
            </LeaderboardCode>
            <LeaderboardLanguage>javascript</LeaderboardLanguage>
          </LeaderboardRow>
          <LeaderboardRow>
            <LeaderboardRank>2</LeaderboardRank>
            <LeaderboardScore>4.5</LeaderboardScore>
            <LeaderboardCode>const calculateTotal = (items) =&gt; items.reduce...</LeaderboardCode>
            <LeaderboardLanguage>javascript</LeaderboardLanguage>
          </LeaderboardRow>
          <LeaderboardRow>
            <LeaderboardRank>3</LeaderboardRank>
            <LeaderboardScore>7.8</LeaderboardScore>
            <LeaderboardCode>
              function calculateTotal(items: Item[]): number {'{'} ...
            </LeaderboardCode>
            <LeaderboardLanguage>typescript</LeaderboardLanguage>
          </LeaderboardRow>
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
