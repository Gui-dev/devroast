'use client'

import { cn } from '@/lib/cn'
import { useEffect, useState } from 'react'
import { codeToHtml } from 'shiki'
import type { BundledLanguage } from 'shiki'

type CodeBlockClientProps = {
  code: string
  lang: BundledLanguage
  className?: string
}

export function CodeBlockClient({ code, lang, className }: CodeBlockClientProps) {
  const [html, setHtml] = useState<string>('')

  useEffect(() => {
    codeToHtml(code, {
      lang,
      theme: 'vesper',
    }).then(setHtml)
  }, [code, lang])

  if (!html) {
    return (
      <div className={cn('border border-border-primary overflow-hidden', className)}>
        <div className="flex bg-bg-input">
          <div className="flex w-10 flex-col items-end gap-1.5 border-r border-border-primary bg-bg-surface py-3 pr-2.5 select-none">
            {code.split('\n').map((_, i) => (
              <span
                key={`ln-${i.toString()}`}
                className="font-mono text-[13px] leading-tight text-text-tertiary"
              >
                {i + 1}
              </span>
            ))}
          </div>
          <div className="flex-1 overflow-x-auto p-3 font-mono text-[13px] leading-tight text-text-secondary">
            {code}
          </div>
        </div>
      </div>
    )
  }

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
