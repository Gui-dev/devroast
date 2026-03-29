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

async function DiffBlock({ lines, lang = 'javascript', className }: DiffBlockProps) {
  'use cache'
  const highlightedLines: Array<{ html: string; type: 'context' | 'removed' | 'added' }> = []

  for (const line of lines) {
    const content = line.content.trim()
    if (!content) {
      highlightedLines.push({ html: '', type: line.type })
      continue
    }

    const html = await codeToHtml(content, {
      lang,
      theme: 'vesper',
    })
    const codeMatch = html.match(/<code[^>]*>([\s\S]*?)<\/code>/)
    const innerHtml = codeMatch ? codeMatch[1] : content
    highlightedLines.push({ html: innerHtml, type: line.type })
  }

  return (
    <div className={cn('border border-border-primary overflow-hidden', className)}>
      <div className="flex items-center gap-2 border-b border-border-primary px-4 py-2.5">
        <span className="font-mono text-sm text-text-secondary">
          your_code.ts → improved_code.ts
        </span>
      </div>
      <div className="flex flex-col">
        {highlightedLines.map((line, index) => (
          <div
            key={`${line.type}-${index}`}
            className={cn(
              'flex items-center gap-2 px-4 py-2 font-mono text-[13px]',
              line.type === 'removed' && 'bg-diff-removed',
              line.type === 'added' && 'bg-diff-added'
            )}
          >
            <span
              className={cn(
                'w-4 text-center',
                line.type === 'removed' && 'text-accent-red',
                line.type === 'added' && 'text-accent-green',
                line.type === 'context' && 'text-text-tertiary'
              )}
            >
              {line.type === 'removed' ? '-' : line.type === 'added' ? '+' : ' '}
            </span>
            <span
              className={cn(
                'flex-1',
                line.type === 'removed' && 'text-text-secondary',
                line.type === 'added' && 'text-text-primary',
                line.type === 'context' && 'text-text-secondary'
              )}
              dangerouslySetInnerHTML={{ __html: line.html }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export { DiffBlock }
export type { DiffBlockProps, DiffLineData }
