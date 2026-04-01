import hljs from 'highlight.js'

type LanguageEntry = {
  name: string
  shikiId: string
  hljsId: string
  eager?: boolean
}

const SUPPORTED_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'java',
  'csharp',
  'cpp',
  'php',
  'ruby',
  'go',
  'rust',
  'swift',
  'kotlin',
  'html',
  'css',
  'sql',
  'bash',
  'json',
  'yaml',
  'c',
  'markdown',
] as const

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

const LANGUAGES: Record<string, LanguageEntry> = {
  javascript: {
    name: 'JavaScript',
    shikiId: 'javascript',
    hljsId: 'javascript',
    eager: true,
  },
  typescript: {
    name: 'TypeScript',
    shikiId: 'typescript',
    hljsId: 'typescript',
    eager: true,
  },
  jsx: {
    name: 'JSX',
    shikiId: 'jsx',
    hljsId: 'javascript',
    eager: true,
  },
  tsx: {
    name: 'TSX',
    shikiId: 'tsx',
    hljsId: 'typescript',
    eager: true,
  },
  python: {
    name: 'Python',
    shikiId: 'python',
    hljsId: 'python',
  },
  go: {
    name: 'Go',
    shikiId: 'go',
    hljsId: 'go',
  },
  rust: {
    name: 'Rust',
    shikiId: 'rust',
    hljsId: 'rust',
  },
  java: {
    name: 'Java',
    shikiId: 'java',
    hljsId: 'java',
  },
  ruby: {
    name: 'Ruby',
    shikiId: 'ruby',
    hljsId: 'ruby',
  },
  php: {
    name: 'PHP',
    shikiId: 'php',
    hljsId: 'php',
  },
  sql: {
    name: 'SQL',
    shikiId: 'sql',
    hljsId: 'sql',
  },
  bash: {
    name: 'Shell',
    shikiId: 'shellscript',
    hljsId: 'bash',
  },
  html: {
    name: 'HTML',
    shikiId: 'html',
    hljsId: 'xml',
  },
  css: {
    name: 'CSS',
    shikiId: 'css',
    hljsId: 'css',
  },
  json: {
    name: 'JSON',
    shikiId: 'json',
    hljsId: 'json',
  },
  yaml: {
    name: 'YAML',
    shikiId: 'yaml',
    hljsId: 'yaml',
  },
  markdown: {
    name: 'Markdown',
    shikiId: 'markdown',
    hljsId: 'markdown',
  },
  c: {
    name: 'C',
    shikiId: 'c',
    hljsId: 'c',
  },
  cpp: {
    name: 'C++',
    shikiId: 'cpp',
    hljsId: 'cpp',
  },
  csharp: {
    name: 'C#',
    shikiId: 'csharp',
    hljsId: 'csharp',
  },
  swift: {
    name: 'Swift',
    shikiId: 'swift',
    hljsId: 'swift',
  },
  kotlin: {
    name: 'Kotlin',
    shikiId: 'kotlin',
    hljsId: 'kotlin',
  },
} as const

const LANGUAGE_OPTIONS = Object.entries(LANGUAGES)
  .filter(([key]) => SUPPORTED_LANGUAGES.includes(key as SupportedLanguage))
  .sort(([, a], [, b]) => a.name.localeCompare(b.name))
  .map(([key, entry]) => ({ value: key, label: entry.name }))

const HLJS_DETECTION_LANGUAGES = [...new Set(Object.values(LANGUAGES).map(l => l.hljsId))]

function hljsIdToLanguageKey(hljsId: string): string | null {
  const entry = Object.entries(LANGUAGES).find(([, lang]) => lang.hljsId === hljsId)
  return entry?.[0] ?? null
}

const SHEBANG_MAP: Record<string, string> = {
  python: 'python',
  python3: 'python',
  node: 'javascript',
  nodejs: 'javascript',
  bash: 'bash',
  sh: 'bash',
  ruby: 'ruby',
  php: 'php',
}

type LanguagePattern = {
  patterns: RegExp[]
  language: string
  weight: number
}

const LANGUAGE_PATTERNS: LanguagePattern[] = [
  // TSX/JSX - MUST come before HTML (has JSX syntax)
  {
    patterns: [
      /import\s+.+from\s+['"][./@]/m, // JS/TS import
      /export\s+(default\s+)?(function|const|class)\s/m, // JS/TS export
      /<\w+[^>]*\s+className\s*=/, // JSX className attribute
      /<\w+[^>]*\s+on(Click|Change|Submit|Focus|Blur)\s*=/, // JSX event handlers
      /<\w+[^>]*\s+href\s*=/, // JSX link attributes
      /<[A-Z]\w+[^>]*>/m, // React components (PascalCase)
      /\w+useState\s*</, // useState with type parameter
      /useEffect\s*\(\s*\(\s*\)\s*=>/, // useEffect with arrow function
      /\w+useCallback\s*</, // useCallback with type parameter
      /\w+useMemo\s*</, // useMemo with type parameter
      /React\.(createElement|Fragment)/, // React API usage
      /\{[^}]*<[A-Z]\w+[^}]*\}/, // JSX in object: {<Component />}
      /return\s+</, // return < (JSX return)
      /<\w+[^>]*>\s*\{/, // Tag with JSX expression: <div>{...}
    ],
    language: 'tsx',
    weight: 15,
  },

  // TYPESCRIPT - specific (interface, type, :)
  {
    patterns: [
      /\binterface\s+\w+/,
      /\btype\s+\w+\s*=/,
      /export\s+function\s+\w+/,
      /:\s+(string|number|boolean|void|any|never|unknown)\b/,
      /<[A-Z]\w*>|<\w+,\s*\w+>/, // Generic types: <T>, <string, number>
      /\bas\s+(string|number|boolean|any)/,
      /:\s*\w+\s*=>\s*\w+/,
      /\bimplements\s+\w+/,
      /\benum\s+\w+/,
    ],
    language: 'typescript',
    weight: 12,
  },

  // JAVASCRIPT (generic patterns) - comes after TypeScript
  {
    patterns: [
      /\bconsole\.(log|error|warn)\s*\(/, // console.log
      /\bdocument\.\w+/, // DOM manipulation
      /\bwindow\.\w+/, // Window API
      /=>\s*{/, // Arrow functions
      /const\s+\w+\s*=/, // const declaration
      /let\s+\w+\s*=/, // let declaration
      /function\s+\w+\s*\(/, // function declaration
      /\bnew\s+\w+\s*\(/, // new instance
      /\.then\s*\(/, // Promise
      /\.catch\s*\(/, // Promise error
      /async\s+function/, // async function
      /\bawait\s+/, // await keyword
      /return\s+\w+\s*;/, // return statement
      /Math\.\w+/, // Math object
      /JSON\.(parse|stringify)/, // JSON methods
      /Array\.\w+/, // Array methods
      /Object\.\w+/, // Object methods
    ],
    language: 'javascript',
    weight: 8,
  },

  // JAVASCRIPT/TYPESCRIPT (generic patterns)
  {
    patterns: [
      /\bconsole\.(log|error|warn)\s*\(/, // console.log
      /\bdocument\.\w+/, // DOM manipulation
      /\bwindow\.\w+/, // Window API
      /=>\s*{/, // Arrow functions
      /const\s+\w+\s*=/, // const declaration
      /let\s+\w+\s*=/, // let declaration
      /function\s+\w+\s*\(/, // function declaration
      /\bnew\s+\w+\s*\(/, // new instance
      /\.then\s*\(/, // Promise
      /\.catch\s*\(/, // Promise error
      /async\s+function/, // async function
      /\bawait\s+/, // await keyword
      /return\s+\w+\s*;/, // return statement
      /Math\.\w+/, // Math object
      /JSON\.(parse|stringify)/, // JSON methods
      /Array\.\w+/, // Array methods
      /Object\.\w+/, // Object methods
    ],
    language: 'javascript',
    weight: 8,
  },

  // HTML - VERY specific (has DOCTYPE, html, head, body tags)
  {
    patterns: [
      /<!DOCTYPE\s+html/i,
      /<html[^>]*\b(lang|xmlns)\s*=/i,
      /<head[^>]*>/i,
      /<body[^>]*>/i,
      /<\/\s*(html|head|body)\s*>/i,
      /<\w+>\s*<\w+>/, // HTML tag pattern: <div>\n    <p>
      /<\/\w+>/, // Closing tags: </div>, </p>
      /<\/?(style|script|link)\b/i, // HTML embedded content tags
    ],
    language: 'html',
    weight: 14,
  },

  // CSS - specific (has { } and : for properties) - must NOT have HTML tags
  {
    patterns: [
      /^\s*[\.#\@]\w+\s*\{/m, // Starts with .class or #id
      /^[\.#\@]\w+\s*\{/m, // Selector followed by {
      /@media\s*\(/,
      /@keyframes\s+\w+/,
      /@import\s+/,
      /@charset\s+/,
    ],
    language: 'css',
    weight: 8, // Lower weight so HTML wins
  },

  // JSON - specific (has "key": value pattern)
  {
    patterns: [/^\s*\{\s*"[\w-]+":\s*["\d\[\{tfn]/m, /^\s*\[\s*\{/m],
    language: 'json',
    weight: 10,
  },

  // SQL - specific (uppercase keywords)
  {
    patterns: [
      /\bSELECT\s+.+\s+FROM\b/i,
      /\bINSERT\s+INTO\b/i,
      /\bUPDATE\s+\w+\s+SET\b/i,
      /\bDELETE\s+FROM\b/i,
      /\bCREATE\s+TABLE\b/i,
      /\bALTER\s+TABLE\b/i,
      /\bDROP\s+TABLE\b/i,
    ],
    language: 'sql',
    weight: 10,
  },

  // PHP - specific (<?php or $)
  {
    patterns: [/<\?php/, /\$\w+\s*=/, /->\w+\(/, /::\w+\(/, /\$\{\w+\}/],
    language: 'php',
    weight: 10,
  },

  // BASH - specific (shebang or $)
  {
    patterns: [/^\#!/, /\b\$\w+/, /\|\s*\w+/, /\b(echo|cd|ls|grep|awk|sed|chmod|mkdir|rm|cp|mv)\b/],
    language: 'bash',
    weight: 10,
  },

  // JAVA - very specific (System., public static void main)
  {
    patterns: [
      /System\.out\./,
      /System\.err\./,
      /public\s+static\s+void\s+main/,
      /public\s+class\s+\w+/,
      /private\s+(static\s+)?void/,
      /protected\s+\w+\s+\w+\s*\(/,
      /package\s+[\w.]+;/,
      /import\s+java\./,
    ],
    language: 'java',
    weight: 10,
  },

  // GO - specific (package, func, :=)
  {
    patterns: [
      /package\s+\w+/,
      /func\s+\w+\s*\(/,
      /func\s+\(\w+\s+\*?\w+\)/,
      /:=\s+/,
      /fmt\.(Print|Sprintf|Error)/,
      /\berr\s*!=\s*nil/,
      /\bgo\s+func/,
    ],
    language: 'go',
    weight: 10,
  },

  // RUST - specific (fn, let mut, impl, ->)
  {
    patterns: [
      /\bfn\s+\w+/,
      /let\s+mut\s+\w+/,
      /\bimpl\s+\w+/,
      /pub\s+(fn|struct|enum|trait|mod)/,
      /\->/,
      /::\s*(new|Some|None|Ok|Err)/,
      /println!\s*\(/,
      /unwrap\(\)/,
      /match\s+\w+\s*\{/,
    ],
    language: 'rust',
    weight: 10,
  },

  // RUBY - specific (end keyword, class variables, require)
  {
    patterns: [/\bputs\s+/, /require\s+['"]/, /@@\w+/, /\bend\b/],
    language: 'ruby',
    weight: 10,
  },

  // C++ - specific (#include, std::)
  {
    patterns: [
      /#include\s*</,
      /std::/,
      /cout\s*<</,
      /cin\s*>>/,
      /\bnullptr\b/,
      /virtual\s+\w+\s*\(/,
    ],
    language: 'cpp',
    weight: 10,
  },

  // YAML - specific (key: without quotes)
  {
    patterns: [/^\w+:\s*$/m, /^\s+-\s+\w+:/m, /:\s+\|$/, /:\s+>$/],
    language: 'yaml',
    weight: 8,
  },

  // PYTHON - specific (def, import, print, self.)
  {
    patterns: [
      /^\s*def\s+\w+\s*\(/m, // Python def (no semicolon, no type annotation)
      /^\s*class\s+\w+\s*[:(]/m, // Python class with : or (
      /^\s*import\s+\w+$/m, // Python import (no 'from')
      /^\s*from\s+\w+\s+import/m, // Python from import
      /\bprint\s*\(/, // Python print (no console)
      /\.self\b/, // Python self
      /\braise\s+\w+/, // Python raise
      /\belif\s+/, // Python elif
      /\bwith\s+\w+\s+as/, // Python with
    ],
    language: 'python',
    weight: 10,
  },

  // YAML fallback
  {
    patterns: [/^\s*-\s+\w+/m],
    language: 'yaml',
    weight: 5,
  },
]

const HEURISTIC_THRESHOLD = 5

function detectByShebang(code: string): string | null {
  const firstLine = code.trim().split('\n')[0]
  if (!firstLine.startsWith('#!')) return null

  const match = firstLine.match(/#!\/.*?(\w+)/)
  if (match) {
    return SHEBANG_MAP[match[1]] ?? null
  }
  return null
}

function detectByHeuristics(code: string): string | null {
  let bestMatch: { language: string; score: number } | null = null

  for (const { patterns, language, weight } of LANGUAGE_PATTERNS) {
    let score = 0
    for (const pattern of patterns) {
      if (pattern.test(code)) {
        score += weight
      }
    }

    if (score >= HEURISTIC_THRESHOLD) {
      if (!bestMatch || score > bestMatch.score) {
        bestMatch = { language, score }
      }
    }
  }

  return bestMatch?.language ?? null
}

export function detectLanguage(code: string): string {
  const shebangResult = detectByShebang(code)
  if (shebangResult && SUPPORTED_LANGUAGES.includes(shebangResult as SupportedLanguage)) {
    return shebangResult
  }

  const heuristicResult = detectByHeuristics(code)
  if (heuristicResult) {
    if (heuristicResult === 'jsx') return 'javascript'
    if (heuristicResult === 'tsx') return 'typescript'
    if (SUPPORTED_LANGUAGES.includes(heuristicResult as SupportedLanguage)) {
      return heuristicResult
    }
  }

  try {
    const result = hljs.highlightAuto(code, HLJS_DETECTION_LANGUAGES)
    if (result.language) {
      const mapped = hljsIdToLanguageKey(result.language)
      if (mapped && SUPPORTED_LANGUAGES.includes(mapped as SupportedLanguage)) {
        return mapped
      }
    }
  } catch {
    // ignore errors
  }

  return 'javascript'
}

export function normalizeLanguageForApi(language: string): string {
  if (language === 'jsx') return 'javascript'
  if (language === 'tsx') return 'typescript'
  return language
}

export {
  LANGUAGES,
  LANGUAGE_OPTIONS,
  HLJS_DETECTION_LANGUAGES,
  hljsIdToLanguageKey,
  type LanguageEntry,
}
