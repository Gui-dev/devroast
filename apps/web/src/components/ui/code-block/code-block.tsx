import type { BundledLanguage } from 'shiki'
import { codeToHtml } from 'shiki'
import { cn } from '@/lib/cn'

type CodeBlockProps = {
  code: string
  lang: BundledLanguage
  className?: string
}

async function CodeBlock({ code, lang, className }: CodeBlockProps) {
  'use cache'

  const html = await codeToHtml(code, {
    lang,
    theme: 'vesper',
  })

  const lines = code.split('\n')

  return (
    <div className={cn('border border-border-primary overflow-hidden', className)}>
      <div className="flex bg-bg-input">
        <div className="flex w-10 flex-col items-end gap-1.5 border-r border-border-primary bg-bg-surface py-3 pr-2.5 select-none">
          {lines.map((_, i) => (
            <span
              key={`ln-${i.toString()}`}
              className="font-mono text-[13px] leading-tight text-text-tertiary"
            >
              {i + 1}
            </span>
          ))}
        </div>
        <div
          className="flex-1 overflow-x-auto p-3 font-mono text-[13px] leading-tight [&_pre]:!bg-transparent [&_pre]:!m-0 [&_pre]:!p-0 [&_code]:!bg-transparent [&_.line]:leading-[1.65]"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  )
}

function CodeBlockHeader({ filename }: { filename?: string }) {
  return (
    <div className="flex h-10 items-center gap-3 border-b border-border-primary px-4">
      <span className="size-2.5 rounded-full bg-accent-red" />
      <span className="size-2.5 rounded-full bg-accent-amber" />
      <span className="size-2.5 rounded-full bg-accent-green" />
      <span className="flex-1" />
      {filename && (
        <span className="font-mono text-xs text-text-tertiary">{filename}</span>
      )}
    </div>
  )
}

export { CodeBlock, CodeBlockHeader }
export type { CodeBlockProps }
