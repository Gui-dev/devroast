import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { CodeBlock } from '@/components/ui/code-block/code-block'
import { DiffLine } from '@/components/ui/diff-line'
import { Link } from '@/components/ui/link'
import { ScoreRing } from '@/components/ui/score-ring'
import type { Metadata } from 'next'

interface RoastPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: RoastPageProps): Promise<Metadata> {
  const { id } = await params
  return {
    title: `Roast #${id.slice(0, 8)}... | devroast`,
    description: 'Your code has been thoroughly roasted.',
  }
}

const roastData = {
  score: 3.5,
  verdict: 'needs_serious_help' as const,
  quote: '"this code looks like it was written during a power outage... in 2005."',
  language: 'javascript' as const,
  lines: 7,
  code: `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}`,
  issues: [
    {
      id: 'var-horror',
      title: 'Variable scope disaster',
      description:
        'Using var in 2024? This is a crime against humanity. var is deprecated, hoisted, and causes bugs that will haunt your dreams.',
      severity: 'critical' as const,
    },
    {
      id: 'any-lurking',
      title: 'Implicit any lurking',
      description:
        "No TypeScript types detected. The 'any' keyword is literally Voldemort - it should never be named.",
      severity: 'critical' as const,
    },
    {
      id: 'loop-horror',
      title: 'Loop without braces',
      description:
        "One-liner loops are a sign of a developer who thinks they're clever. Spoiler: they're not.",
      severity: 'warning' as const,
    },
    {
      id: 'magic-numbers',
      title: 'Magic number detected',
      description:
        'What does 0 mean? What does 1 mean? Without context, these numbers are hieroglyphics.',
      severity: 'warning' as const,
    },
  ],
  diffLines: [
    { id: 'ctx-1', type: 'context' as const, content: 'function calculateTotal(items) {' },
    {
      id: 'rm-1',
      type: 'removed' as const,
      content: '  var total = 0;',
    },
    {
      id: 'rm-2',
      type: 'removed' as const,
      content: '  for (var i = 0; i < items.length; i++) {',
    },
    {
      id: 'rm-3',
      type: 'removed' as const,
      content: '    total = total + items[i].price;',
    },
    {
      id: 'add-1',
      type: 'added' as const,
      content: '  return items.reduce((sum, item) => sum + item.price, 0);',
    },
    { id: 'ctx-2', type: 'context' as const, content: '}' },
  ],
}

const severityToBadgeVariant = {
  critical: 'critical' as const,
  warning: 'warning' as const,
  good: 'good' as const,
  needs_serious_help: 'needs_serious_help' as const,
}

export default async function RoastPage({ params }: RoastPageProps) {
  const { id } = await params

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-col gap-8 px-4 sm:gap-10 sm:px-6 md:px-10 py-6 sm:py-8 lg:py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8 lg:gap-12 xl:gap-48">
          <ScoreRing score={roastData.score} />

          <div className="flex flex-col gap-4">
            <Badge variant={roastData.verdict}>
              verdict: {roastData.verdict.replace(/_/g, ' ')}
            </Badge>

            <p className="max-w-xl font-mono text-base text-text-primary sm:text-lg lg:text-xl">
              {roastData.quote}
            </p>

            <div className="flex flex-wrap items-center gap-2 sm:gap-4 font-mono text-xs text-text-tertiary sm:text-sm">
              <span>lang: {roastData.language}</span>
              <span>·</span>
              <span>{roastData.lines} lines</span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/share/${id}`}
                className="rounded-md border border-border-primary px-4 py-2 font-mono text-sm text-text-secondary transition-colors hover:border-accent-green hover:text-accent-green"
              >
                share
              </Link>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-border-primary" />

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-base font-bold text-accent-green sm:text-lg">
              {'//'}
            </span>
            <h2 className="font-mono text-base font-bold text-text-primary sm:text-lg">
              your_submission
            </h2>
          </div>

          <CodeBlock code={roastData.code} lang={roastData.language} />
        </div>

        <div className="h-px w-full bg-border-primary" />

        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-base font-bold text-accent-green sm:text-lg">
              {'//'}
            </span>
            <h2 className="font-mono text-base font-bold text-text-primary sm:text-lg">
              detailed_analysis
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {roastData.issues.map(issue => (
              <Card key={issue.id} className="gap-3 p-5">
                <div className="flex items-center gap-3">
                  <Badge variant={severityToBadgeVariant[issue.severity]}>
                    {issue.severity.replace(/_/g, ' ')}
                  </Badge>
                </div>
                <h3 className="font-mono text-base font-semibold text-text-primary">
                  {issue.title}
                </h3>
                <p className="font-mono text-sm text-text-secondary">{issue.description}</p>
              </Card>
            ))}
          </div>
        </div>

        <div className="h-px w-full bg-border-primary" />

        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-base font-bold text-accent-green sm:text-lg">
              {'//'}
            </span>
            <h2 className="font-mono text-base font-bold text-text-primary sm:text-lg">
              suggested_fix
            </h2>
          </div>

          <div className="flex flex-col overflow-hidden rounded-md border border-border-primary bg-bg-input">
            <div className="flex items-center gap-2 border-b border-border-primary px-4 py-2.5">
              <span className="font-mono text-sm text-text-secondary">
                your_code.ts → improved_code.ts
              </span>
            </div>

            <div className="flex flex-col p-1">
              {roastData.diffLines.map(line => (
                <DiffLine key={line.id} variant={line.type}>
                  {line.content}
                </DiffLine>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
