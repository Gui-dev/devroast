import { AnimatedMetrics } from '@/components/animated-metrics'

export interface Metrics {
  totalRoasts: number
  avgScore: number
}

export async function MetricsServer() {
  return <AnimatedMetrics />
}
