export function getScoreColor(score: number, maxScore = 10): string {
  const progress = Math.min(Math.max(score / maxScore, 0), 1)
  if (progress >= 0.7) return '#10B981'
  if (progress >= 0.4) return '#F59E0B'
  return '#EF4444'
}
