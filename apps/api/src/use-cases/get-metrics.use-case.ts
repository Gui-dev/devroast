import type { RoastContract } from '../contracts/roast.contract.js'

export interface Metrics {
  totalRoasts: number
  avgScore: number
}

export class GetMetricsUseCase {
  constructor(private readonly repository: RoastContract) {}

  async execute(): Promise<Metrics> {
    return this.repository.getMetrics()
  }
}
