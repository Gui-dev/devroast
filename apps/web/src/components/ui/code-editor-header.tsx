import { cn } from '@/lib/cn'
import { LANGUAGES, type LanguageId } from '@/lib/detect-language'
import { type HTMLAttributes, forwardRef } from 'react'

export type CodeEditorHeaderProps = HTMLAttributes<HTMLDivElement> & {
  language: LanguageId
  onLanguageChange: (language: LanguageId) => void
}

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
          onChange={e => onLanguageChange(e.target.value as LanguageId)}
          className="ml-auto cursor-pointer rounded border border-border-primary bg-bg-page px-2 py-1 font-mono text-xs text-text-secondary outline-none hover:border-border-secondary focus:border-accent-green"
        >
          {LANGUAGES.map(lang => (
            <option key={lang.id} value={lang.id}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>
    )
  }
)

CodeEditorHeader.displayName = 'CodeEditorHeader'

export { CodeEditorHeader }
