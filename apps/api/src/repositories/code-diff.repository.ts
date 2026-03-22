import { sql } from 'drizzle-orm'
import type { CodeDiffContract, CreateCodeDiffInput } from '../contracts/roast.contract.js'
import { db } from '../db/index.js'
import type { CodeDiff } from '../entities/roast.entity.js'

export class CodeDiffRepository implements CodeDiffContract {
  async create(roastId: string, diff: CreateCodeDiffInput): Promise<CodeDiff> {
    const id = crypto.randomUUID()
    const now = new Date()

    await db.execute(
      sql`
      INSERT INTO "codeDiffs" (id, "roastId", "removedLine", "addedLine", context, "lineNumber", "createdAt")
      VALUES (
        ${id},
        ${roastId},
        ${diff.removedLine ?? null},
        ${diff.addedLine ?? null},
        ${diff.context ?? null},
        ${diff.lineNumber ?? null},
        ${now.toISOString()}
      )
    `
    )

    const result = await db.execute(sql`SELECT * FROM "codeDiffs" WHERE id = ${id}`)

    return result.rows[0] as unknown as CodeDiff
  }

  async findByRoastId(roastId: string): Promise<CodeDiff[]> {
    const result = await db.execute(
      sql`SELECT * FROM "codeDiffs" WHERE "roastId" = ${roastId} ORDER BY "lineNumber" ASC`
    )

    return result.rows as unknown as CodeDiff[]
  }
}
