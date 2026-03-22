import { sql } from 'drizzle-orm'
import type {
  AnalysisIssueContract,
  CreateAnalysisIssueInput,
} from '../contracts/roast.contract.js'
import { db } from '../db/index.js'
import type { AnalysisIssue } from '../entities/roast.entity.js'

export class AnalysisIssueRepository implements AnalysisIssueContract {
  async create(roastId: string, issue: CreateAnalysisIssueInput): Promise<AnalysisIssue> {
    const id = crypto.randomUUID()
    const now = new Date()

    await db.execute(
      sql`
      INSERT INTO "analysisIssues" (id, "roastId", title, description, severity, "issueType", "lineNumber", "createdAt")
      VALUES (
        ${id},
        ${roastId},
        ${issue.title},
        ${issue.description},
        ${issue.severity},
        ${issue.issueType},
        ${issue.lineNumber ?? null},
        ${now.toISOString()}
      )
    `
    )

    const result = await db.execute(sql`SELECT * FROM "analysisIssues" WHERE id = ${id}`)

    return result.rows[0] as unknown as AnalysisIssue
  }

  async findByRoastId(roastId: string): Promise<AnalysisIssue[]> {
    const result = await db.execute(
      sql`SELECT * FROM "analysisIssues" WHERE "roastId" = ${roastId} ORDER BY "lineNumber" ASC`
    )

    return result.rows as unknown as AnalysisIssue[]
  }
}
