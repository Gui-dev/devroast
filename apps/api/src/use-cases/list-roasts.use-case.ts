import type { RoastContract } from '../contracts/roast.contract.js'
import type { Roast } from '../entities/roast.entity.js'

export class ListRoastsUseCase {
  constructor(private readonly repository: RoastContract) {}

  async execute(limit?: number): Promise<Roast[]> {
    return this.repository.findAll(limit)
  }
}
