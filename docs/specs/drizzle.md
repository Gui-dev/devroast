# Database Specification - Drizzle ORM

## Context

This document outlines the database schema and implementation plan for adding persistent storage to Devroast using Drizzle ORM with PostgreSQL.

## Technology Stack

| Technology | Purpose |
|------------|---------|
| [Drizzle ORM](https://orm.drizzle.team/) | Type-safe database ORM |
| [PostgreSQL](https://www.postgresql.org/) | Relational database |
| [Docker Compose](https://docs.docker.com/compose/) | Database containerization |

## Features to Support

Based on the current implementation and README:

1. **Code Submission** - Users paste code and get roasted
2. **Scoring System** - Code receives a score (0-10)
3. **Leaderboard** - Display top "worst" code
4. **Feedback Cards** - Display roast results with issues

## Database Schema

### Tables Overview

```
┌─────────────────┐
│     users       │
├─────────────────┤
│ roast_submissions│
├─────────────────┤
│     issues      │
└─────────────────┘
```

### Enums

```typescript
// Language enum - supported programming languages
export const languages = ['javascript', 'typescript', 'python', 'go', 'rust', 'java', 'cpp', 'css', 'html', 'json'] as const

// Roast mode enum
export const roastModes = ['brutally_honest', 'roast_mode'] as const

// Issue severity enum
export const issueSeverities = ['critical', 'warning', 'good', 'needs_serious_help'] as const
```

### Tables

#### 1. `users` (Future - Optional for MVP)

```typescript
// users table - for authenticated users (optional feature)
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  username: varchar('username', { length: 50 }).unique().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
```

**Fields:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT uuid_generate_v4() | Unique identifier |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | User email |
| `username` | VARCHAR(50) | UNIQUE, NOT NULL | Display name |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update |

#### 2. `roast_submissions`

```typescript
// roast_submissions table - stores code submissions
export const roastSubmissions = pgTable('roast_submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: text('code').notNull(),
  language: varchar('language', { length: 50 }).notNull().default('javascript'),
  roastMode: varchar('roast_mode', { length: 50 }).notNull().default('roast_mode'),
  totalScore: decimal('total_score', { precision: 3, scale: 1 }).notNull(),
  userId: uuid('user_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
```

**Fields:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Unique submission ID |
| `code` | TEXT | NOT NULL | The submitted code |
| `language` | VARCHAR(50) | NOT NULL, DEFAULT 'javascript' | Programming language |
| `roast_mode` | VARCHAR(50) | NOT NULL | roast_mode or brutally_honest |
| `total_score` | DECIMAL(3,1) | NOT NULL | Overall score (0.0 - 10.0) |
| `user_id` | UUID | FK → users.id | Optional user reference |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Submission time |

**Indexes:**

- `idx_roast_submissions_score` ON (`total_score`) - For leaderboard queries
- `idx_roast_submissions_created_at` ON (`created_at` DESC) - For recent submissions
- `idx_roast_submissions_language` ON (`language`) - For filtering by language

#### 3. `issues`

```typescript
// issues table - stores individual issues found in code
export const issues = pgTable('issues', {
  id: uuid('id').primaryKey().defaultRandom(),
  submissionId: uuid('submission_id').references(() => roastSubmissions.id).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  severity: varchar('severity', { length: 50 }).notNull(), // critical, warning, good, needs_serious_help
  lineStart: integer('line_start'),
  lineEnd: integer('line_end'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
```

**Fields:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Issue ID |
| `submission_id` | UUID | FK, NOT NULL | Parent submission |
| `title` | VARCHAR(255) | NOT NULL | Issue title |
| `description` | TEXT | NOT NULL | Detailed explanation |
| `severity` | VARCHAR(50) | NOT NULL | critical/warning/good/needs_serious_help |
| `line_start` | INTEGER | NULL | Start line number |
| `line_end` | INTEGER | NULL | End line number |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Creation time |

**Indexes:**

- `idx_issues_submission_id` ON (`submission_id`) - For joining with submissions
- `idx_issues_severity` ON (`severity`) - For filtering by severity

## Relationships

```
users (1) ─────< (N) roast_submissions
roast_submissions (1) ─────< (N) issues
```

## Implementation Checklist

### Phase 1: Database Setup

- [ ] Install Drizzle ORM and PostgreSQL driver
- [ ] Install `drizzle-kit` for migrations
- [ ] Create `docker-compose.yml` with PostgreSQL
- [ ] Create `.env` with database URL
- [ ] Create drizzle config file

### Phase 2: Schema Definition

- [ ] Create `apps/web/src/db/` directory
- [ ] Create `schema.ts` with all tables and enums
- [ ] Create `index.ts` for exports
- [ ] Export types for TypeScript usage

### Phase 3: Database Connection

- [ ] Create `db.ts` for database connection
- [ ] Set up connection pool
- [ ] Add error handling
- [ ] Test connection

### Phase 4: Migrations

- [ ] Create initial migration with drizzle-kit
- [ ] Run migration script
- [ ] Verify tables created

### Phase 5: API Integration (Future)

- [ ] Create API route for submissions
- [ ] Create API route for leaderboard
- [ ] Connect with code analysis logic
- [ ] Update homepage to fetch from DB

## File Structure

```
devroast/
├── apps/
│   └── web/
│       └── src/
│           └── db/
│               ├── schema.ts      # Database schema
│               ├── index.ts       # Schema exports
│               ├── db.ts          # Database connection
│               └── migrations/    # Drizzle migrations
│
├── docker-compose.yml             # PostgreSQL container
├── .env                           # Environment variables
└── drizzle.config.ts             # Drizzle configuration
```

## Docker Compose Configuration

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: devroast-db
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

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://devroast:devroast@localhost:5432/devroast
```

## Dependencies

```bash
# Install Drizzle ORM and PostgreSQL driver
pnpm add drizzle-orm pg

# Install Drizzle Kit for migrations
pnpm add -D drizzle-kit @types/pg
```

## Drizzle Config

```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './apps/web/src/db/schema.ts',
  out: './apps/web/src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

## Usage Examples

### Query Leaderboard (Top 10 Worst Scores)

```typescript
import { db } from './db'
import { roastSubmissions } from './db/schema'
import { asc } from 'drizzle-orm'

const leaderboard = await db
  .select({
    id: roastSubmissions.id,
    language: roastSubmissions.language,
    score: roastSubmissions.totalScore,
    createdAt: roastSubmissions.createdAt,
  })
  .from(roastSubmissions)
  .orderBy(asc(roastSubmissions.totalScore))
  .limit(10)
```

### Insert New Submission

```typescript
import { db } from './db'
import { roastSubmissions } from './db/schema'

await db.insert(roastSubmissions).values({
  code: 'const x = 1;',
  language: 'javascript',
  roastMode: 'roast_mode',
  totalScore: 7.5,
})
```

### Get Submission with Issues

```typescript
import { db } from './db'
import { roastSubmissions, issues } from './db/schema'

const submissionWithIssues = await db
  .select()
  .from(roastSubmissions)
  .leftJoin(issues, eq(issues.submissionId, roastSubmissions.id))
  .where(eq(roastSubmissions.id, submissionId))
```

## Notes

1. **MVP Scope**: For the initial implementation, we may not need the `users` table - submissions can be anonymous
2. **Score Calculation**: The scoring algorithm is not yet defined; `totalScore` is a placeholder
3. **Code Analysis**: The actual code analysis/roasting logic will be implemented separately
4. **Migrations**: Use `drizzle-kit generate` to create migrations and `drizzle-kit push` or `migrate` to apply

## CLI Commands

```bash
# Generate migration
pnpm drizzle-kit generate

# Push schema to database (dev)
pnpm drizzle-kit push

# Run migrations (production)
pnpm drizzle-kit migrate

# Studio (GUI for database)
pnpm drizzle-kit studio
```

## References

- [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview)
- [Drizzle Kit](https://orm.drizzle.team/docs/drizzle-kit)
- [PostgreSQL with Drizzle](https://orm.drizzle.team/docs/postgresql)
