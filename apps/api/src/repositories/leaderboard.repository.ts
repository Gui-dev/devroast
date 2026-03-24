import { sql } from 'drizzle-orm'
import type {
  CreateLeaderboardEntryInput,
  LeaderboardContract,
} from '../contracts/roast.contract.js'
import { db } from '../db/index.js'
import type { LeaderboardEntry } from '../entities/roast.entity.js'

export class LeaderboardRepository implements LeaderboardContract {
  async create(data: CreateLeaderboardEntryInput): Promise<LeaderboardEntry> {
    const id = crypto.randomUUID()
    const now = new Date()

    await db.execute(
      sql`
      INSERT INTO leaderboard (id, "roastId", rank, score, language, "codePreview", "updatedAt")
      VALUES (
        ${id},
        ${data.roastId},
        ${data.rank},
        ${data.score},
        ${data.language},
        ${data.codePreview},
        ${now.toISOString()}
      )
    `
    )

    const result = await db.execute(sql`SELECT * FROM leaderboard WHERE id = ${id}`)

    return result.rows[0] as unknown as LeaderboardEntry
  }

  async getTopRoasts(limit?: number): Promise<LeaderboardEntry[]> {
    const result = await db.execute(
      sql`SELECT * FROM leaderboard ORDER BY rank ASC LIMIT ${limit ?? 100}`
    )

    return result.rows as unknown as LeaderboardEntry[]
  }

  async getRankByRoastId(roastId: string): Promise<LeaderboardEntry | null> {
    const result = await db.execute(sql`SELECT * FROM leaderboard WHERE "roastId" = ${roastId}`)

    return (result.rows[0] as unknown as LeaderboardEntry) ?? null
  }

  async getWorstRoasts(limit = 3): Promise<LeaderboardEntry[]> {
    const result = await db.execute(
      sql`
        SELECT id, score, language, code, "updatedAt"
        FROM roasts 
        ORDER BY score ASC 
        LIMIT ${limit}
      `
    )

    const rows = result.rows as unknown as {
      id: string
      score: number
      language: string
      code: string
      updatedAt: Date
    }[]

    return rows.map((row, index) => ({
      id: row.id,
      roastId: row.id,
      rank: index + 1,
      score: row.score,
      language: row.language,
      codePreview: row.code.slice(0, 50),
      updatedAt: row.updatedAt,
    }))
  }
}
