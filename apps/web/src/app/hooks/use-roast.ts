export type Verdict = 'needs_serious_help' | 'critical' | 'warning' | 'good'

export interface RoastIssue {
  id: string
  title: string
  description: string
  severity: 'critical' | 'warning' | 'good'
  issueType: string
  lineNumber: number | null
}

export interface RoastDiff {
  id: string
  removedLine: string | null
  addedLine: string | null
  context: string | null
  lineNumber: number | null
}

export interface RoastFull {
  id: string
  userId: string | null
  code: string
  language: string
  lineCount: number
  score: number
  verdict: Verdict
  roastQuote: string | null
  roastMode: string
  suggestedFix: string | null
  createdAt: string
  updatedAt: string
  issues: RoastIssue[]
  diffs: RoastDiff[]
}

export async function fetchRoast(id: string): Promise<RoastFull> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333'
  const response = await fetch(`${baseUrl}/roasts/${id}`)

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Roast not found')
    }
    throw new Error('Failed to fetch roast')
  }

  return response.json()
}
