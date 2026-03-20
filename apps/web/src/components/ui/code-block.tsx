import { type HTMLAttributes, forwardRef } from 'react'
import { codeToHtml } from 'shiki'

export type CodeBlockProps = HTMLAttributes<HTMLDivElement> & {
  code: string
  lang?: string
  filename?: string
}

const CodeBlock = forwardRef<HTMLDivElement, CodeBlockProps>(
  async ({ code, lang = 'javascript', filename, className, ...props }, ref) => {
    const html = await codeToHtml(code, {
      lang,
      theme: 'vesper',
    })

    return (
      <div ref={ref} className={className} {...props}>
        <div className="rounded-md border border-border-primary overflow-hidden">
          <div className="flex items-center gap-3 border-b border-border-primary bg-bg-surface px-4 py-2.5">
            <span className="size-2.5 rounded-full bg-accent-red" />
            <span className="size-2.5 rounded-full bg-accent-amber" />
            <span className="size-2.5 rounded-full bg-accent-green" />
            {filename && (
              <span className="ml-auto font-mono text-[12px] text-text-tertiary">{filename}</span>
            )}
          </div>
          <div className="flex">
            <div className="flex flex-col gap-1.5 border-r border-border-primary bg-bg-surface px-2.5 py-3 font-mono text-[13px] leading-normal text-text-tertiary">
              {code.split('\n').map((line, i) => {
                const lineNumber = i + 1
                return (
                  <span key={`line-${lineNumber}`} className="w-10 text-right pr-4">
                    {lineNumber}
                  </span>
                )
              })}
            </div>
            <div
              className="flex-1 overflow-x-auto bg-bg-input px-3 py-3 font-mono text-[13px] leading-normal"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </div>
      </div>
    )
  }
)

CodeBlock.displayName = 'CodeBlock'

export { CodeBlock }
