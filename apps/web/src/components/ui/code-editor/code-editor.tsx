'use client'

import { useShikiHighlighter } from '@/hooks/use-shiki-highlighter'
import { detectLanguage } from '@/lib/detect-language'
import { LANGUAGES, LANGUAGE_OPTIONS } from '@/lib/languages'
import { useCallback, useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'

const MAX_CHARACTERS = 2000

type CodeEditorProps = {
  value: string
  onChange: (value: string) => void
  language: string | null
  onLanguageChange?: (language: string | null) => void
  onLimitExceeded?: (exceeded: boolean) => void
  className?: string
}

function CodeEditor({
  value,
  onChange,
  language,
  onLanguageChange,
  onLimitExceeded,
  className,
}: CodeEditorProps) {
  const { highlight } = useShikiHighlighter()
  const highlightedRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lineNumbersRef = useRef<HTMLDivElement>(null)
  const prevIsOverLimitRef = useRef<boolean | null>(null)

  const [isLocked, setIsLocked] = useState(false)

  const displayLanguage = language ? (LANGUAGES[language]?.name ?? language) : null

  const charCount = value.length
  const isOverLimit = charCount > MAX_CHARACTERS

  const lines = value.split('\n')
  const lineCount = Math.max(lines.length, 16)

  const [highlightedHtml, setHighlightedHtml] = useState('')

  useEffect(() => {
    if (!value) {
      setHighlightedHtml('')
      return
    }

    const lang = language ?? 'javascript'
    highlight(value, lang)
      .then(html => {
        setHighlightedHtml(html)
      })
      .catch(() => {
        setHighlightedHtml(
          `<pre style="background:#0c0c0c;color:#abb2bf"><code>${value.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`
        )
      })
  }, [value, language, highlight])

  const hasHighlight = highlightedHtml.length > 0

  useEffect(() => {
    if (prevIsOverLimitRef.current !== isOverLimit) {
      prevIsOverLimitRef.current = isOverLimit
      onLimitExceeded?.(isOverLimit)
    }
  }, [isOverLimit, onLimitExceeded])

  const handleScroll = useCallback(() => {
    const textarea = textareaRef.current
    const highlighted = highlightedRef.current
    const lineNumbers = lineNumbersRef.current
    if (!textarea) return

    if (highlighted) {
      highlighted.scrollTop = textarea.scrollTop
      highlighted.scrollLeft = textarea.scrollLeft
    }
    if (lineNumbers) {
      lineNumbers.scrollTop = textarea.scrollTop
    }
  }, [])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value)
    },
    [onChange]
  )

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      e.preventDefault()
      const pastedText = e.clipboardData.getData('text')
      if (pastedText) {
        const detectedLang = detectLanguage(pastedText)
        onLanguageChange?.(detectedLang)
        onChange(pastedText)
        setIsLocked(true)
      }
    },
    [onChange, onLanguageChange]
  )

  return (
    <div
      className={twMerge('flex flex-col overflow-hidden border border-border-primary', className)}
    >
      <div className="flex h-10 items-center gap-2 border-b border-border-primary px-4">
        <span className="size-3 rounded-full bg-accent-red" />
        <span className="size-3 rounded-full bg-accent-amber" />
        <span className="size-3 rounded-full bg-accent-yellow" />
        <span className="flex-1" />

        <div className="relative flex items-center">
          <select
            value={language ?? 'auto'}
            onChange={e => {
              const val = e.target.value
              onLanguageChange?.(val === 'auto' ? null : val)
            }}
            className="appearance-none cursor-pointer bg-transparent pr-5 font-mono text-xs text-text-secondary outline-none transition-colors hover:text-text-primary"
          >
            <option value="auto" className="bg-bg-surface text-text-primary">
              {displayLanguage ? `${displayLanguage} (detected)` : 'auto-detect'}
            </option>
            {LANGUAGE_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value} className="bg-bg-surface text-text-primary">
                {opt.label}
              </option>
            ))}
          </select>
          <svg
            className="absolute right-0 size-3.5 pointer-events-none text-text-tertiary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <div className="flex max-h-96 flex-1 flex-1 overflow-hidden bg-bg-input">
        <div
          ref={lineNumbersRef}
          className="flex w-12 flex-col items-end gap-0 overflow-hidden border-r border-border-primary bg-bg-surface px-3 py-4 select-none"
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <span
              key={`ln-${i.toString()}`}
              className="font-mono text-xs leading-[1.625] text-text-tertiary"
            >
              {i + 1}
            </span>
          ))}
        </div>

        <div className="relative min-h-80 flex-1">
          {hasHighlight && (
            <div
              ref={highlightedRef}
              aria-hidden="true"
              className="absolute inset-0 overflow-hidden whitespace-pre px-4 py-4 font-mono text-xs leading-[1.625] pointer-events-none [&_pre]:!bg-transparent [&_pre]:!m-0 [&_pre]:!p-0 [&_pre]:!text-inherit [&_code]:!bg-transparent [&_code]:!text-inherit [&_.line]:!leading-[1.625]"
              dangerouslySetInnerHTML={{
                __html: highlightedHtml,
              }}
            />
          )}

          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onPaste={handlePaste}
            onScroll={handleScroll}
            readOnly={isLocked}
            placeholder="// paste your code here..."
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            className={twMerge(
              'relative z-10 min-h-80 w-full resize-none overflow-auto bg-transparent px-4 py-4 font-mono text-xs leading-[1.625] outline-none [tab-size:2]',
              hasHighlight
                ? 'text-transparent caret-accent-yellow selection:bg-white/10'
                : 'text-text-primary placeholder:text-text-tertiary caret-accent-yellow'
            )}
          />
        </div>
      </div>

      <div className="flex h-8 items-center justify-between border-t border-border-primary px-4">
        {isLocked && (
          <div className="flex items-center gap-1.5 text-accent-amber">
            <svg
              className="size-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span className="font-mono text-[10px]">locked</span>
          </div>
        )}
        <span
          className={twMerge(
            'font-mono text-[10px] tabular-nums',
            isOverLimit ? 'text-accent-red' : 'text-text-tertiary'
          )}
        >
          {charCount.toLocaleString()}/{MAX_CHARACTERS.toLocaleString()}
        </span>
      </div>
    </div>
  )
}

export { CodeEditor, MAX_CHARACTERS }
export type { CodeEditorProps }
