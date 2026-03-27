export interface LeaderboardRoast {
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

export async function fetchLeaderboard(): Promise<LeaderboardRoast[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333'
  const response = await fetch(`${baseUrl}/leaderboard`)

  if (!response.ok) {
    throw new Error('Failed to fetch leaderboard')
  }

  return response.json()
}
