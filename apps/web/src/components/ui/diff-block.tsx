import { cn } from '@/lib/cn'
import type { BundledLanguage } from 'shiki'
import { codeToHtml } from 'shiki'

interface DiffLineData {
  id: string
  type: 'context' | 'removed' | 'added'
  content: string
}

type DiffBlockProps = {
  lines: DiffLineData[]
  lang?: BundledLanguage
  className?: string
}

async function highlightLines(
  lines: { content: string; type: 'context' | 'removed' | 'added' }[],
  lang: BundledLanguage
) {
  const highlighted: Array<{ html: string; type: 'context' | 'removed' | 'added' }> = []

  for (const line of lines) {
    const content = line.content.trim()
    if (!content) {
      highlighted.push({ html: '', type: line.type })
      continue
    }

    const html = await codeToHtml(content, {
      lang,
      theme: 'vesper',
    })
    const codeMatch = html.match(/<code[^>]*>([\s\S]*?)<\/code>/)
    const innerHtml = codeMatch ? codeMatch[1] : content
    highlighted.push({ html: innerHtml, type: line.type })
  }

  return highlighted
}

async function DiffBlock({ lines, lang = 'javascript', className }: DiffBlockProps) {
  'use cache'

  const removedLines = lines.filter(l => l.type === 'removed')
  const addedLines = lines.filter(l => l.type === 'added')
  const contextLines = lines.filter(l => l.type === 'context')

  const [removedHighlighted, addedHighlighted] = await Promise.all([
    highlightLines(removedLines, lang),
    highlightLines(addedLines, lang),
  ])

  if (removedLines.length === 0 && addedLines.length === 0) {
    return (
      <div className={cn('border border-border-primary overflow-hidden', className)}>
        <div className="flex items-center gap-2 border-b border-border-primary px-4 py-2.5">
          <span className="font-mono text-sm text-text-secondary">suggested_fix</span>
        </div>
        {contextLines.length > 0 && (
          <div className="flex flex-col">
            {contextLines.map((line, index) => (
              <div
                key={line.id ?? `ctx-${index}`}
                className="flex items-center gap-2 bg-bg-input px-4 py-2 font-mono text-[13px] text-text-secondary"
              >
                <span className="w-4 text-center text-text-tertiary"> </span>
                <span className="flex-1" dangerouslySetInnerHTML={{ __html: line.content }} />
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {removedLines.length > 0 && (
        <div className="border border-accent-red/30 overflow-hidden">
          <div className="flex items-center gap-2 border-b border-accent-red/20 bg-diff-removed px-4 py-2.5">
            <span className="size-2 rounded-full bg-accent-red" />
            <span className="font-mono text-sm text-text-secondary">your code</span>
          </div>
          <div className="flex flex-col">
            {removedHighlighted.map((line, index) => (
              <div
                key={
                  line.type === 'removed'
                    ? (removedLines[index]?.id ?? `rm-${index}`)
                    : `rm-${index}`
                }
                className="flex items-center gap-2 bg-diff-removed px-4 py-2 font-mono text-[13px]"
              >
                <span className="w-4 text-center text-accent-red">-</span>
                <span
                  className="flex-1 text-text-secondary"
                  dangerouslySetInnerHTML={{ __html: line.html }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {addedLines.length > 0 && (
        <div className="border border-accent-yellow/30 overflow-hidden">
          <div className="flex items-center gap-2 border-b border-accent-yellow/20 bg-diff-added px-4 py-2.5">
            <span className="size-2 rounded-full bg-accent-yellow" />
            <span className="font-mono text-sm text-text-secondary">suggested fix</span>
          </div>
          <div className="flex flex-col">
            {addedHighlighted.map((line, index) => (
              <div
                key={
                  line.type === 'added' ? (addedLines[index]?.id ?? `add-${index}`) : `add-${index}`
                }
                className="flex items-center gap-2 bg-diff-added px-4 py-2 font-mono text-[13px]"
              >
                <span className="w-4 text-center text-accent-yellow">+</span>
                <span
                  className="flex-1 text-text-primary"
                  dangerouslySetInnerHTML={{ __html: line.html }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export { DiffBlock }
export type { DiffBlockProps, DiffLineData }
