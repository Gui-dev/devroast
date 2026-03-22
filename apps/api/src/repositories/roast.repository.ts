import { sql } from 'drizzle-orm'
import type { RoastContract } from '../contracts/roast.contract.js'
import { db } from '../db/index.js'
import type { CreateRoastInput, Roast, UpdateRoastInput } from '../entities/roast.entity.js'

export class RoastRepository implements RoastContract {
  async create(data: CreateRoastInput): Promise<Roast> {
    const id = crypto.randomUUID()
    const now = new Date()

    await db.execute(
      sql`
      INSERT INTO roasts (id, "userId", code, language, "lineCount", score, verdict, "roastMode", "createdAt", "updatedAt")
      VALUES (
        ${id},
        ${data.userId ?? null},
        ${data.code},
        ${data.language},
        ${data.code.split('\n').length},
        0,
        'warning',
        ${data.roastMode ?? 'roast'},
        ${now.toISOString()},
        ${now.toISOString()}
      )
    `
    )

    const result = await db.execute(sql`SELECT * FROM roasts WHERE id = ${id}`)

    return result.rows[0] as unknown as Roast
  }

  async findById(id: string): Promise<Roast | null> {
    const result = await db.execute(sql`SELECT * FROM roasts WHERE id = ${id}`)

    return (result.rows[0] as unknown as Roast) ?? null
  }

  async findAll(limit?: number): Promise<Roast[]> {
    const result = await db.execute(
      sql`SELECT * FROM roasts ORDER BY "createdAt" DESC LIMIT ${limit ?? 100}`
    )

    return result.rows as unknown as Roast[]
  }

  async update(id: string, data: UpdateRoastInput): Promise<Roast | null> {
    const setClauses: string[] = []

    if (data.score !== undefined) {
      setClauses.push(`score = ${data.score}`)
    }
    if (data.verdict !== undefined) {
      setClauses.push(`verdict = '${data.verdict}'`)
    }
    if (data.roastQuote !== undefined) {
      setClauses.push(`"roastQuote" = '${data.roastQuote.replace(/'/g, "''")}'`)
    }
    if (data.suggestedFix !== undefined) {
      setClauses.push(`"suggestedFix" = '${data.suggestedFix.replace(/'/g, "''")}'`)
    }

    setClauses.push(`"updatedAt" = '${new Date().toISOString()}'`)

    if (setClauses.length === 1) return this.findById(id)

    await db.execute(sql.raw(`UPDATE roasts SET ${setClauses.join(', ')} WHERE id = '${id}'`))

    return this.findById(id)
  }

  async delete(id: string): Promise<boolean> {
    const before = await this.findById(id)
    if (!before) return false

    await db.execute(sql`DELETE FROM roasts WHERE id = ${id}`)
    return true
  }
}
