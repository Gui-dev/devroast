import type { LeaderboardContract } from '../contracts/roast.contract.js'
import type { LeaderboardEntry } from '../entities/roast.entity.js'

export class GetLeaderboardUseCase {
  constructor(private readonly repository: LeaderboardContract) {}

  async execute(): Promise<LeaderboardEntry[]> {
    return this.repository.getWorstRoasts(20)
  }
}
