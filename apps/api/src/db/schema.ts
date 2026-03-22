import { integer, pgTable, real, text, timestamp } from 'drizzle-orm/pg-core'

export const programmingLanguages = [
  'javascript',
  'typescript',
  'python',
  'go',
  'rust',
  'java',
  'cpp',
  'css',
  'html',
  'json',
] as const

export type ProgrammingLanguage = (typeof programmingLanguages)[number]

export const verdicts = ['critical', 'warning', 'good', 'needs_serious_help'] as const

export type Verdict = (typeof verdicts)[number]

export const roastModes = ['honest', 'roast'] as const

export type RoastMode = (typeof roastModes)[number]

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').unique(),
  username: text('username').unique(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
})

export const roasts = pgTable('roasts', {
  id: text('id').primaryKey(),
  userId: text('userId'),
  code: text('code').notNull(),
  language: text('language').$type<ProgrammingLanguage>().notNull(),
  lineCount: integer('lineCount').notNull(),
  score: real('score').notNull(),
  verdict: text('verdict').$type<Verdict>().notNull(),
  roastQuote: text('roastQuote'),
  roastMode: text('roastMode').default('roast').notNull(),
  suggestedFix: text('suggestedFix'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
})

export const analysisIssues = pgTable('analysisIssues', {
  id: text('id').primaryKey(),
  roastId: text('roastId').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  severity: text('severity').$type<Verdict>().notNull(),
  issueType: text('issueType').notNull(),
  lineNumber: integer('lineNumber'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
})

export const codeDiffs = pgTable('codeDiffs', {
  id: text('id').primaryKey(),
  roastId: text('roastId').notNull(),
  removedLine: text('removedLine'),
  addedLine: text('addedLine'),
  context: text('context'),
  lineNumber: integer('lineNumber'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
})

export const leaderboard = pgTable('leaderboard', {
  id: text('id').primaryKey(),
  roastId: text('roastId').notNull(),
  rank: integer('rank').notNull(),
  score: real('score').notNull(),
  language: text('language').$type<ProgrammingLanguage>().notNull(),
  codePreview: text('codePreview').notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type Roast = typeof roasts.$inferSelect
export type NewRoast = typeof roasts.$inferInsert

export type AnalysisIssue = typeof analysisIssues.$inferSelect
export type NewAnalysisIssue = typeof analysisIssues.$inferInsert

export type CodeDiff = typeof codeDiffs.$inferSelect
export type NewCodeDiff = typeof codeDiffs.$inferInsert

export type LeaderboardEntry = typeof leaderboard.$inferSelect
export type NewLeaderboardEntry = typeof leaderboard.$inferInsert
