export function getVerdictColor(verdict: string): string {
  if (verdict === 'needs_serious_help' || verdict === 'critical') return '#EF4444'
  if (verdict === 'warning') return '#F59E0B'
  return '#10B981'
}
