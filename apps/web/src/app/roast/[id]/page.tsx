import { type RoastFull, fetchRoast } from '@/app/hooks/use-roast'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { CodeBlock } from '@/components/ui/code-block/code-block'
import { DiffBlock } from '@/components/ui/diff-block'
import { Link } from '@/components/ui/link'
import { ScoreRing } from '@/components/ui/score-ring'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import type { BundledLanguage } from 'shiki'

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

interface DiffLineData {
  id: string
  type: 'context' | 'removed' | 'added'
  content: string
}

function parseSuggestedFix(suggestedFix: string | null): DiffLineData[] {
  if (!suggestedFix) {
    return []
  }

  let lines: string[] = []

  try {
    const parsed = JSON.parse(suggestedFix)
    if (Array.isArray(parsed)) {
      lines = parsed
    } else if (typeof parsed === 'object' && parsed !== null) {
      const allLines: string[] = []
      for (const value of Object.values(parsed)) {
        if (typeof value === 'string') {
          allLines.push(value)
        } else if (Array.isArray(value)) {
          allLines.push(...value)
        }
      }
      lines = allLines
    } else {
      lines = [String(parsed)]
    }
  } catch {
    lines = suggestedFix.split('\n')
  }

  const result: DiffLineData[] = []
  let id = 0

  for (const block of lines) {
    const blockLines = block.split('\n')
    for (const line of blockLines) {
      const trimmed = line.trim()
      if (!trimmed) continue
      if (trimmed === '---') continue

      if (trimmed.startsWith('-')) {
        result.push({
          id: `rm-${id++}`,
          type: 'removed',
          content: trimmed.replace(/^-+/, '').trim(),
        })
      } else if (trimmed.startsWith('+')) {
        result.push({
          id: `add-${id++}`,
          type: 'added',
          content: trimmed.replace(/^\++/, '').trim(),
        })
      } else {
        result.push({
          id: `ctx-${id++}`,
          type: 'context',
          content: trimmed,
        })
      }
    }
  }

  return result
}

const severityToBadgeVariant = {
  critical: 'critical' as const,
  warning: 'warning' as const,
  good: 'good' as const,
  needs_serious_help: 'needs_serious_help' as const,
}

function RoastContent({ roast, id }: { roast: RoastFull; id: string }) {
  const diffLines = parseSuggestedFix(roast.suggestedFix)

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-col gap-8 px-4 sm:gap-10 sm:px-6 md:px-10 py-6 sm:py-8 lg:py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8 lg:gap-12 xl:gap-48">
          <ScoreRing score={roast.score} />

          <div className="flex flex-col gap-4">
            <Badge variant={roast.verdict as keyof typeof severityToBadgeVariant}>
              verdict: {roast.verdict.replace(/_/g, ' ')}
            </Badge>

            <p className="max-w-xl font-mono text-base text-text-primary sm:text-lg lg:text-xl">
              {roast.roastQuote}
            </p>

            <div className="flex flex-wrap items-center gap-2 sm:gap-4 font-mono text-xs text-text-tertiary sm:text-sm">
              <span>lang: {roast.language}</span>
              <span>·</span>
              <span>{roast.lineCount} lines</span>
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

          <CodeBlock code={roast.code} lang={roast.language as BundledLanguage} />
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

          {roast.issues.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {roast.issues.map(issue => (
                <Card key={issue.id} className="gap-3 p-5">
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        severityToBadgeVariant[
                          issue.severity
                        ] as keyof typeof severityToBadgeVariant
                      }
                    >
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
          ) : (
            <p className="font-mono text-text-tertiary">No issues found.</p>
          )}
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

          {diffLines.length > 0 ? (
            <DiffBlock lines={diffLines} lang={roast.language as BundledLanguage} />
          ) : (
            <p className="font-mono text-text-tertiary">No suggested fix available.</p>
          )}
        </div>
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-col gap-8 px-4 sm:gap-10 sm:px-6 md:px-10 py-6 sm:py-8 lg:py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8 lg:gap-12 xl:gap-48">
          <div className="size-32 animate-pulse rounded-full bg-border-primary" />
          <div className="flex flex-col gap-4">
            <div className="h-6 w-32 animate-pulse rounded bg-border-primary" />
            <div className="h-16 w-full max-w-xl animate-pulse rounded bg-border-primary" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RoastPage({ params }: RoastPageProps) {
  return (
    <Suspense fallback={<LoadingState />}>
      <RoastPageContent params={params} />
    </Suspense>
  )
}

async function RoastPageContent({ params }: RoastPageProps) {
  const { id } = await params

  let roast: RoastFull
  try {
    roast = await fetchRoast(id)
  } catch {
    notFound()
  }

  return <RoastContent roast={roast} id={id} />
}
