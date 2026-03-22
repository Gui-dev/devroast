import { cn } from '@/lib/cn'
import { LANGUAGE_OPTIONS, detectLanguage } from '@/lib/detect-language'
import { type HTMLAttributes, forwardRef, useCallback, useEffect, useState } from 'react'
import { codeToHtml } from 'shiki'

export type CodeEditorProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  defaultValue?: string
  onChange?: (value: string) => void
  showLineNumbers?: boolean
}

export type CodeEditorHeaderProps = HTMLAttributes<HTMLDivElement> & {
  language: string
  onLanguageChange: (language: string) => void
}

export type CodeEditorContentProps = HTMLAttributes<HTMLDivElement> & {
  code: string
  lang?: string
  showLineNumbers?: boolean
  placeholder?: string
}

const PLACEHOLDER_CODE = '// Cole seu código aqui'

const CodeEditorHeader = forwardRef<HTMLDivElement, CodeEditorHeaderProps>(
  ({ className, language, onLanguageChange, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-3 border-b border-border-primary bg-bg-surface px-4 py-2.5',
          className
        )}
        {...props}
      >
        <span className="size-2.5 rounded-full bg-accent-red" />
        <span className="size-2.5 rounded-full bg-accent-amber" />
        <span className="size-2.5 rounded-full bg-accent-green" />

        <select
          value={language}
          onChange={e => onLanguageChange(e.target.value)}
          className="ml-auto cursor-pointer rounded border border-border-primary bg-bg-page px-2 py-1 font-mono text-xs text-text-secondary outline-none hover:border-border-secondary focus:border-accent-green"
        >
          {LANGUAGE_OPTIONS.map(lang => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>
    )
  }
)

CodeEditorHeader.displayName = 'CodeEditorHeader'

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

const CodeEditor = forwardRef<HTMLDivElement, CodeEditorProps>(
  ({ className, defaultValue = '', onChange, showLineNumbers = true, ...props }, ref) => {
    const [code, setCode] = useState(defaultValue)
    const [language, setLanguage] = useState('javascript')

    const handlePaste = useCallback(
      (e: React.ClipboardEvent<HTMLDivElement>) => {
        const pastedText = e.clipboardData.getData('text')
        if (pastedText) {
          setCode(pastedText)
          const detectedLang = detectLanguage(pastedText)
          setLanguage(detectedLang)
          onChange?.(pastedText)
        }
      },
      [onChange]
    )

    const handleLanguageChange = useCallback((newLanguage: string) => {
      setLanguage(newLanguage)
    }, [])

    return (
      <div
        ref={ref}
        className={cn('w-full overflow-hidden rounded-md border border-border-primary', className)}
        onPaste={handlePaste}
        {...props}
      >
        <CodeEditorHeader language={language} onLanguageChange={handleLanguageChange} />
        <CodeEditorContent code={code} lang={language} showLineNumbers={showLineNumbers} />
      </div>
    )
  }
)

CodeEditor.displayName = 'CodeEditor'

export { CodeEditor, CodeEditorHeader, CodeEditorContent }
