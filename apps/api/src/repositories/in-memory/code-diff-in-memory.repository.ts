import type { CodeDiffContract, CreateCodeDiffInput } from '../../contracts/roast.contract.js'
import type { CodeDiff } from '../../entities/roast.entity.js'

export class InMemoryCodeDiffRepository implements CodeDiffContract {
  private diffs: CodeDiff[] = []

  async create(roastId: string, diff: CreateCodeDiffInput): Promise<CodeDiff> {
    const newDiff: CodeDiff = {
      id: crypto.randomUUID(),
      roastId,
      removedLine: diff.removedLine ?? null,
      addedLine: diff.addedLine ?? null,
      context: diff.context ?? null,
      lineNumber: diff.lineNumber ?? null,
      createdAt: new Date(),
    }
    this.diffs.push(newDiff)
    return newDiff
  }

  async findByRoastId(roastId: string): Promise<CodeDiff[]> {
    return this.diffs.filter(d => d.roastId === roastId)
  }
}
