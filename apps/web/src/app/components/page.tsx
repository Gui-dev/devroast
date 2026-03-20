import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CodeBlock } from '@/components/ui/code-block'
import { DiffLine } from '@/components/ui/diff-line'
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

        <div className="flex flex-col gap-1 rounded-md border border-border-primary overflow-hidden w-fit">
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
    </main>
  )
}
