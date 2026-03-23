import { useCallback, useEffect, useState } from 'react'
import type { BundledLanguage, BundledTheme, Highlighter } from 'shiki/bundle/web'

let highlighterPromise: Promise<Highlighter> | null = null

async function initHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    const { createHighlighter } = await import('shiki/bundle/web')
    highlighterPromise = createHighlighter({
      langs: [
        'javascript',
        'typescript',
        'jsx',
        'tsx',
        'python',
        'html',
        'css',
        'json',
        'bash',
        'markdown',
      ],
      themes: ['vesper'],
    })
  }
  return highlighterPromise
}

const initPromise = initHighlighter()

export function useShikiHighlighter() {
  const [highlighter, setHighlighter] = useState<Highlighter | null>(null)

  useEffect(() => {
    initPromise.then(hl => {
      setHighlighter(hl)
    })
  }, [])

  const highlight = useCallback(
    async (code: string, lang: string): Promise<string> => {
      try {
        const hl = highlighter ?? (await initPromise)
        const validLang = hl.getLoadedLanguages().includes(lang as BundledLanguage)
          ? (lang as BundledLanguage)
          : 'javascript'

        return hl.codeToHtml(code, {
          lang: validLang,
          theme: 'vesper' as BundledTheme,
        })
      } catch {
        return `<pre><code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`
      }
    },
    [highlighter]
  )

  return {
    highlight,
    isReady: highlighter !== null,
  }
}
