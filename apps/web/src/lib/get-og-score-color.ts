export function getOgScoreColor(score: number): string {
  if (score >= 7) return '#10B981'
  if (score >= 4) return '#F59E0B'
  return '#EF4444'
}
