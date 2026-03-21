import hljs from 'highlight.js'

export const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', hljs: 'javascript' },
  { id: 'typescript', name: 'TypeScript', hljs: 'typescript' },
  { id: 'python', name: 'Python', hljs: 'python' },
  { id: 'go', name: 'Go', hljs: 'go' },
  { id: 'rust', name: 'Rust', hljs: 'rust' },
  { id: 'java', name: 'Java', hljs: 'java' },
  { id: 'cpp', name: 'C++', hljs: 'cpp' },
  { id: 'css', name: 'CSS', hljs: 'css' },
  { id: 'html', name: 'HTML', hljs: 'xml' },
  { id: 'json', name: 'JSON', hljs: 'json' },
] as const

export type LanguageId = (typeof LANGUAGES)[number]['id']

export function detectLanguage(code: string): LanguageId {
  const result = hljs.highlightAuto(
    code,
    LANGUAGES.map(l => l.hljs)
  )

  if (result.language) {
    const matched = LANGUAGES.find(l => l.hljs === result.language)
    if (matched) {
      return matched.id
    }

    const lowerLang = result.language.toLowerCase()
    const fallback = LANGUAGES.find(l => l.id === lowerLang || l.name.toLowerCase() === lowerLang)
    if (fallback) {
      return fallback.id
    }
  }

  return 'javascript'
}

export function getLanguageById(id: string) {
  return LANGUAGES.find(l => l.id === id) ?? LANGUAGES[0]
}
