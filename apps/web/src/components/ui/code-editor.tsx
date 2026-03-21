import { cn } from '@/lib/cn'
import { type LanguageId, detectLanguage } from '@/lib/detect-language'
import { type HTMLAttributes, forwardRef, useCallback, useState } from 'react'
import { CodeEditorContent } from './code-editor-content'
import { CodeEditorHeader } from './code-editor-header'

export type CodeEditorProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  defaultValue?: string
  onChange?: (value: string) => void
  showLineNumbers?: boolean
}

const CodeEditor = forwardRef<HTMLDivElement, CodeEditorProps>(
  ({ className, defaultValue = '', onChange, showLineNumbers = true, ...props }, ref) => {
    const [code, setCode] = useState(defaultValue)
    const [language, setLanguage] = useState<LanguageId>('javascript')

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

    const handleLanguageChange = useCallback((newLanguage: LanguageId) => {
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

export { CodeEditor }
