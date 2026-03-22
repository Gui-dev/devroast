import type { RoastContract } from '../contracts/roast.contract.js'
import type { CreateRoastInput, Roast, UpdateRoastInput } from '../entities/roast.entity.js'

export class RoastRepository implements RoastContract {
  private roasts: Roast[] = []

  async create(data: CreateRoastInput): Promise<Roast> {
    const now = new Date()
    const roast: Roast = {
      id: crypto.randomUUID(),
      userId: data.userId ?? null,
      code: data.code,
      language: data.language,
      lineCount: data.code.split('\n').length,
      score: 0,
      verdict: 'warning',
      roastQuote: null,
      roastMode: data.roastMode ?? 'roast',
      suggestedFix: null,
      createdAt: now,
      updatedAt: now,
    }
    this.roasts.push(roast)
    return roast
  }

  async findById(id: string): Promise<Roast | null> {
    return this.roasts.find(r => r.id === id) ?? null
  }

  async findAll(limit?: number): Promise<Roast[]> {
    const sorted = [...this.roasts].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    return limit ? sorted.slice(0, limit) : sorted
  }

  async update(id: string, data: UpdateRoastInput): Promise<Roast | null> {
    const roast = this.roasts.find(r => r.id === id)
    if (!roast) return null

    const updated: Roast = {
      ...roast,
      ...data,
      updatedAt: new Date(),
    }
    this.roasts = this.roasts.map(r => (r.id === id ? updated : r))
    return updated
  }

  async delete(id: string): Promise<boolean> {
    const index = this.roasts.findIndex(r => r.id === id)
    if (index === -1) return false
    this.roasts.splice(index, 1)
    return true
  }
}
