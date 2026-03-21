import { cn } from '@/lib/cn'
import { type HTMLAttributes, forwardRef, useEffect, useState } from 'react'
import { codeToHtml } from 'shiki'

export type CodeEditorContentProps = HTMLAttributes<HTMLDivElement> & {
  code: string
  lang?: string
  showLineNumbers?: boolean
  placeholder?: string
}

const PLACEHOLDER_CODE = '// Cole seu código aqui'

const CodeEditorContent = forwardRef<HTMLDivElement, CodeEditorContentProps>(
  (
    { className, code, lang = 'javascript', showLineNumbers = true, placeholder, ...props },
    ref
  ) => {
    const [highlightedHtml, setHighlightedHtml] = useState<string>('')
    const displayCode = code || placeholder || PLACEHOLDER_CODE
    const isPlaceholder = !code

    useEffect(() => {
      const highlight = async () => {
        const html = await codeToHtml(displayCode, {
          lang,
          theme: 'vesper',
        })
        setHighlightedHtml(html)
      }
      highlight()
    }, [displayCode, lang])

    return (
      <div ref={ref} className={cn('flex min-h-[240px]', className)} {...props}>
        {showLineNumbers && (
          <div className="flex w-10 flex-col border-r border-border-primary bg-bg-surface py-3 pr-4 font-mono text-[13px] leading-normal text-text-tertiary">
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={`line-${i + 1}`} className="w-full text-right">
                {i + 1}
              </span>
            ))}
          </div>
        )}
        <div
          className={cn(
            'min-w-0 flex-1 overflow-x-auto bg-bg-page px-4 py-3',
            '[&>pre]:!bg-transparent [&>pre]:!p-0 [&>pre]:min-h-[200px]',
            isPlaceholder && 'text-text-tertiary'
          )}
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      </div>
    )
  }
)

CodeEditorContent.displayName = 'CodeEditorContent'

export { CodeEditorContent }
