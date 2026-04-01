import { sql } from 'drizzle-orm'
import type { RoastContract } from '../contracts/roast.contract.js'
import { db } from '../db/index.js'
import type { CreateRoastInput, Roast, UpdateRoastInput } from '../entities/roast.entity.js'
import type { AnalysisIssue, CodeDiff } from '../entities/roast.entity.js'

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

    if (!result.rows[0]) {
      throw new Error('Failed to create roast')
    }

    const row = result.rows[0] as Record<string, unknown>
    return {
      ...row,
      createdAt: new Date(row.createdAt as string),
      updatedAt: new Date(row.updatedAt as string),
    } as unknown as Roast
  }

  async findById(id: string): Promise<Roast | null> {
    const result = await db.execute(sql`SELECT * FROM roasts WHERE id = ${id}`)

    if (!result.rows[0]) return null

    const row = result.rows[0] as Record<string, unknown>
    return {
      ...row,
      createdAt: new Date(row.createdAt as string),
      updatedAt: new Date(row.updatedAt as string),
    } as unknown as Roast
  }

  async findByIdWithRelations(id: string): Promise<{
    roast: Roast | null
    issues: AnalysisIssue[]
    diffs: CodeDiff[]
  }> {
    const roast = await this.findById(id)
    if (!roast) return { roast: null, issues: [], diffs: [] }

    const issuesResult = await db.execute(
      sql`SELECT * FROM "analysisIssues" WHERE "roastId" = ${id}`
    )
    const diffsResult = await db.execute(sql`SELECT * FROM "codeDiffs" WHERE "roastId" = ${id}`)

    return {
      roast,
      issues: issuesResult.rows as unknown as AnalysisIssue[],
      diffs: diffsResult.rows as unknown as CodeDiff[],
    }
  }

  async findAll(limit?: number): Promise<Roast[]> {
    const result = await db.execute(
      sql`SELECT * FROM roasts ORDER BY "createdAt" DESC LIMIT ${limit ?? 100}`
    )

    return result.rows.map(row => {
      const r = row as Record<string, unknown>
      return {
        ...r,
        createdAt: new Date(r.createdAt as string),
        updatedAt: new Date(r.updatedAt as string),
      } as unknown as Roast
    })
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
      const quote = data.roastQuote ?? ''
      setClauses.push(`"roastQuote" = '${quote.replace(/'/g, "''")}'`)
    }
    if (data.suggestedFix !== undefined) {
      const fix = data.suggestedFix ?? ''
      setClauses.push(`"suggestedFix" = '${fix.replace(/'/g, "''")}'`)
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

  async getMetrics(): Promise<{ totalRoasts: number; avgScore: number }> {
    try {
      const countResult = await db.execute(sql`SELECT COUNT(*) as cnt FROM roasts`)
      const avgResult = await db.execute(
        sql`SELECT COALESCE(AVG(score), 0) as avg_score FROM roasts`
      )

      const totalRoasts = Number(countResult.rows[0]?.cnt ?? 0)
      const avgScore = Math.round(Number(avgResult.rows[0]?.avg_score ?? 0) * 10) / 10

      return { totalRoasts, avgScore }
    } catch (error) {
      console.error('getMetrics error:', error)
      throw error
    }
  }
}
