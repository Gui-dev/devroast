export interface WorstRoast {
  id: string
  roastId: string
  rank: number
  score: number
  language: string
  codePreview: string
  code: string
  lineCount: number
  updatedAt: string
}

export async function fetchWorstRoasts(): Promise<WorstRoast[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333'
  const response = await fetch(`${baseUrl}/leaderboard/worst`)

  if (!response.ok) {
    throw new Error('Failed to fetch worst roasts')
  }

  return response.json()
}
