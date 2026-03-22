import type { RoastContract } from '../contracts/roast.contract.js'
import type { CreateRoastInput, Roast } from '../entities/roast.entity.js'

export class CreateRoastUseCase {
  constructor(private readonly repository: RoastContract) {}

  async execute(input: CreateRoastInput): Promise<Roast> {
    if (!input.code || input.code.trim().length === 0) {
      throw new Error('Code is required')
    }

    if (!input.language) {
      throw new Error('Language is required')
    }

    return this.repository.create({
      ...input,
      code: input.code.trim(),
    })
  }
}
