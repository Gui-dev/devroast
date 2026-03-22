import type { RoastContract } from '../contracts/roast.contract.js'
import type { Roast } from '../entities/roast.entity.js'

export class GetRoastUseCase {
  constructor(private readonly repository: RoastContract) {}

  async execute(id: string): Promise<Roast | null> {
    return this.repository.findById(id)
  }
}
