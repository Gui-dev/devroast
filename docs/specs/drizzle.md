# Database Specification - Drizzle ORM

## Context

This document outlines the database schema design for the Devroast application using Drizzle ORM with PostgreSQL. The schema supports code roasting, analysis, leaderboard, and user management features.

## Data Model Overview

Based on the application screens:

1. **Screen 1 - Code Input**: Users paste code for analysis
2. **Screen 2 - Roast Results**: Display score, verdict, issues, and diffs
3. **Screen 3 - Leaderboard**: Ranked list of roasted code
4. **Screen 4 - OG Image**: Social sharing with score preview

---

## Enums

### Programming Language

```typescript
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

export type ProgrammingLanguage = typeof programmingLanguages[number]
```

### Verdict

Score-based verdict classification:

```typescript
export const verdicts = ['critical', 'warning', 'good', 'needs_serious_help'] as const
export type Verdict = typeof verdicts[number]
```

**Score Ranges:**

| Verdict | Score Range |
|---------|-------------|
| critical | 0.0 - 2.9 |
| warning | 3.0 - 5.9 |
| good | 6.0 - 7.9 |
| needs_serious_help | 8.0 - 10.0 |

### Roast Mode

```typescript
export const roastModes = ['honest', 'roast'] as const
export type RoastMode = typeof roastModes[number]
```

- `honest`: Professional feedback
- `roast`: Maximum sarcasm enabled

---

## Tables

### 1. Users

Optional user table for tracking personal roasts.

```typescript
export const users = pgTable('users', {
  id: text('id').primaryKey(), // UUID or auth provider ID
  email: text('email').unique(),
  username: text('username').unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
```

### 2. Roasts

Core table storing roasted code submissions.

```typescript
export const roasts = pgTable('roasts', {
  id: text('id').primaryKey(), // UUID
  userId: text('user_id').references(() => users.id), // Optional - null for anonymous

  // Code information
  code: text('code').notNull(),
  language: text('language').$type<ProgrammingLanguage>().notNull(),
  lineCount: integer('line_count').notNull(),

  // Analysis results
  score: real('score').notNull(), // 0.0 - 10.0
  verdict: text('verdict').$type<Verdict>().notNull(),
  roastQuote: text('roast_quote'), // Sarcastic quote
  roastMode: text('roast_mode').$type<RoastMode>().default('roast').notNull(),
  suggestedFix: text('suggested_fix'), // Complete fixed code version

  // Metadata
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
```

### 3. Analysis Issues

Issues found during code analysis.

```typescript
export const analysisIssues = pgTable('analysis_issues', {
  id: text('id').primaryKey(),
  roastId: text('roast_id').references(() => roasts.id).notNull(),

  // Issue details
  title: text('title').notNull(),
  description: text('description').notNull(),
  severity: text('severity').$type<Verdict>().notNull(),
  issueType: text('issue_type').notNull(), // e.g., 'var_vs_const', 'missing_error_handling'

  // Code location
  lineNumber: integer('line_number'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
})
```

### 4. Code Diffs

Suggested improvements with before/after code (line-by-line changes).

```typescript
export const codeDiffs = pgTable('code_diffs', {
  id: text('id').primaryKey(),
  roastId: text('roast_id').references(() => roasts.id).notNull(),

  // Diff content
  removedLine: text('removed_line'), // null for additions
  addedLine: text('added_line'), // null for removals
  context: text('context'), // Surrounding code context

  // Position
  lineNumber: integer('line_number'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
})
```

### 5. Leaderboard

Pre-computed rankings for efficient queries.

```typescript
export const leaderboard = pgTable('leaderboard', {
  id: text('id').primaryKey(),
  roastId: text('roast_id').references(() => roasts.id).notNull(),

  // Ranking info
  rank: integer('rank').notNull(),
  score: real('score').notNull(),
  language: text('language').$type<ProgrammingLanguage>().notNull(),

  // For leaderboard display
  codePreview: text('code_preview').notNull(), // First N chars of code

  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
```

---

## Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐
│    users    │       │    roasts   │
├─────────────┤       ├─────────────┤
│ id (PK)     │───┐   │ id (PK)     │
│ email       │   │   │ user_id (FK)│
│ username    │   └───►│ code        │
│ created_at  │       │ language    │
└─────────────┘       │ score       │
                      │ verdict     │
                      │ roast_quote │
                      │ roast_mode  │
                      │ suggested_fix│
                      │ created_at  │
                      └──────┬──────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ analysis_issues │ │    code_diffs   │ │   leaderboard   │
├─────────────────┤ ├─────────────────┤ ├─────────────────┤
│ id (PK)         │ │ id (PK)         │ │ id (PK)         │
│ roast_id (FK)   │ │ roast_id (FK)   │ │ roast_id (FK)   │
│ title           │ │ removed_line    │ │ rank            │
│ description     │ │ added_line     │ │ score           │
│ severity        │ │ context        │ │ language        │
│ issue_type      │ │ line_number    │ │ code_preview    │
│ line_number     │ │ created_at     │ │ updated_at      │
│ created_at      │ └─────────────────┘ └─────────────────┘
└─────────────────┘
```

---

## Implementation Checklist

### Phase 1: Setup

- [ ] Install Drizzle ORM dependencies
  ```bash
  pnpm add drizzle-orm
  pnpm add -D drizzle-kit @types/pg
  ```

- [ ] Create Docker Compose configuration
  ```yaml
  # docker-compose.yml
  version: '3.8'
  services:
    postgres:
      image: postgres:16-alpine
      environment:
        POSTGRES_USER: devroast
        POSTGRES_PASSWORD: devroast
        POSTGRES_DB: devroast
      ports:
        - '5432:5432'
      volumes:
        - postgres_data:/var/lib/postgresql/data

  volumes:
    postgres_data:
  ```

- [ ] Create Drizzle configuration file
  ```typescript
  // drizzle.config.ts
  import { defineConfig } from 'drizzle-kit'

  export default defineConfig({
    schema: './src/db/schema.ts',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
      url: process.env.DATABASE_URL!,
    },
  })
  ```

- [ ] Set up environment variables
  ```env
  # .env.local
  DATABASE_URL=postgresql://devroast:devroast@localhost:5432/devroast
  ```

### Phase 2: Database Schema

- [ ] Create `src/db/` directory structure
  ```
  src/db/
  ├── index.ts           # Database connection
  ├── schema.ts          # All tables and enums
  └── migrations/        # Generated migrations
  ```

- [ ] Create database connection module
  ```typescript
  // src/db/index.ts
  import { drizzle } from 'drizzle-orm/node-postgres'
  import { Pool } from 'pg'
  import * as schema from './schema'

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })

  export const db = drizzle(pool, { schema })
  export type Database = typeof db
  ```

- [ ] Create schema file with all tables and enums
- [ ] Generate initial migration
  ```bash
  npx drizzle-kit generate
  ```

### Phase 3: CRUD Operations

- [ ] Create repository pattern for each table
  ```
  src/db/
  ├── repositories/
  │   ├── roasts.ts
  │   ├── analysis-issues.ts
  │   ├── code-diffs.ts
  │   └── leaderboard.ts
  ```

- [ ] Implement roast repository
  - `createRoast(data)`
  - `getRoastById(id)`
  - `getRoastsByUserId(userId)`
  - `getRecentRoasts(limit)`

- [ ] Implement leaderboard repository
  - `getTopRoasts(limit)`
  - `updateLeaderboard()`
  - `getRoastRank(roastId)`

### Phase 4: Integration

- [ ] Create API routes for roasts
  ```
  src/app/api/
  ├── roasts/
  │   ├── route.ts        # POST - create roast
  │   └── [id]/
  │       └── route.ts    # GET - get roast by ID
  └── leaderboard/
      └── route.ts        # GET - top roasts
  ```

- [ ] Update homepage to fetch roasts from database
- [ ] Update leaderboard page to fetch from database
- [ ] Add database stats to homepage (2,847 codes roasted, avg score)

### Phase 5: Leaderboard Optimization

- [ ] Create cron job or trigger to update leaderboard
- [ ] Add database indexes for performance
  ```typescript
  // Add to schema (using pgTable)
  export const roasts = pgTable('roasts', {
    // ... fields
  }, (table) => ({
    scoreIdx: index('roasts_score_idx').on(table.score),
    createdAtIdx: index('roasts_created_at_idx').on(table.createdAt),
  }))
  ```

---

## Environment Setup

### Development

```bash
# Start PostgreSQL
docker compose up -d

# Run migrations
npx drizzle-kit push

# Or use migrate command
npx drizzle-kit migrate
```

### Production

Set `DATABASE_URL` environment variable with your production PostgreSQL connection string.

---

## Type Safety

All types are derived from the schema:

```typescript
import { db } from './db'
import { roasts, type Roast, type NewRoast } from './schema'

// Type-safe inserts
const newRoast: NewRoast = {
  id: crypto.randomUUID(),
  code: 'const x = 1',
  language: 'javascript',
  score: 7.5,
  verdict: 'good',
  suggestedFix: 'const x = 1', // Fixed code version
}

await db.insert(roasts).values(newRoast)

// Type-safe queries
const roast = await db.select().from(roasts).where(eq(roasts.id, id))
```

---

## Migrations

Drizzle uses migration files for schema changes:

```bash
# Generate migration after schema changes
npx drizzle-kit generate

# Apply migrations
npx drizzle-kit migrate

# Push schema (development only - bypasses migrations)
npx drizzle-kit push
```

---

## Related Documentation

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Drizzle Kit CLI](https://orm.drizzle.team/kit-docs/overview)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
