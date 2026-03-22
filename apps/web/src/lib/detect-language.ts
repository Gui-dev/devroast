import hljs from 'highlight.js'

type LanguageEntry = {
  name: string
  shikiId: string
  hljsId: string
  eager?: boolean
}

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
  dart: {
    name: 'Dart',
    shikiId: 'dart',
    hljsId: 'dart',
  },
} as const

const LANGUAGE_OPTIONS = Object.entries(LANGUAGES)
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
  // HTML - VERY specific, check first (has < > brackets)
  {
    patterns: [
      /<!DOCTYPE\s+html/i,
      /<html[^>]*>/i,
      /<head[^>]*>/i,
      /<body[^>]*>/i,
      /<div[^>]*>/i,
      /<script[^>]*>/i,
      /<style[^>]*>/i,
      /<\/\w+>/,
    ],
    language: 'html',
    weight: 10,
  },

  // CSS - specific (has { } and : for properties)
  {
    patterns: [
      /^[\.#\@]?\w+\s*\{/m,
      /@media\s*\(/,
      /@keyframes\s+\w+/,
      /@import\s+/,
      /@charset\s+/,
      /:\s*(flex|grid|block|none|auto)\s*;/,
      /:\s*\d+(px|em|rem|%|vh|vw)/,
      /background(-color)?:/,
      /color:\s*[\w\#]/,
      /:\s*#[0-9a-f]{3,6}/i,
    ],
    language: 'css',
    weight: 10,
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

  // TYPESCRIPT - specific (interface, type, :)
  {
    patterns: [
      /\binterface\s+\w+/,
      /\btype\s+\w+\s*=/,
      /:\s*(string|number|boolean|void|any|never|unknown)\b/,
      /<\w+(\s*,\s*\w+)*>/,
      /\bas\s+(string|number|boolean|any)/,
      /:\s*\w+\s*=>\s*\w+/,
      /\bimplements\s+\w+/,
      /\benum\s+\w+/,
    ],
    language: 'typescript',
    weight: 10,
  },

  // PYTHON - specific (def, import, print, self.)
  {
    patterns: [
      /^\s*def\s+\w+\s*\(/m,
      /^\s*class\s+\w+\s*[:(]/m,
      /^\s*import\s+\w+/m,
      /^\s*from\s+\w+\s+import/m,
      /\bprint\s*\(/,
      /\.self\b/,
      /\braise\s+\w+/,
      /\belif\s+/,
      /\bwith\s+\w+\s+as/,
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
  if (shebangResult) return shebangResult

  const heuristicResult = detectByHeuristics(code)
  if (heuristicResult) return heuristicResult

  try {
    const result = hljs.highlightAuto(code, HLJS_DETECTION_LANGUAGES)
    if (result.language) {
      const mapped = hljsIdToLanguageKey(result.language)
      if (mapped) return mapped
    }
  } catch {
    // ignore errors
  }

  return 'javascript'
}

export {
  LANGUAGES,
  LANGUAGE_OPTIONS,
  HLJS_DETECTION_LANGUAGES,
  hljsIdToLanguageKey,
  type LanguageEntry,
}
