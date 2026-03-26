# Leaderboard Page + Homepage Card Layout Design

## Context

The `/leaderboard` page currently uses hardcoded static data (5 entries) and is not connected to the API. The homepage's shame leaderboard section uses a table-style layout. The user wants:

1. Leaderboard page connected to the API, showing 20 results without pagination
2. Card layout (LeaderboardEntry style) with collapsible code + syntax highlighting on both pages
3. Homepage keeps showing 3 entries, leaderboard page shows 20

## Approach

**New endpoint** — `GET /leaderboard` returning 20 results. Existing `GET /leaderboard/worst` stays untouched for homepage (3 results).

## Design

### 1. Backend: New Endpoint

**New use case** — `apps/api/src/use-cases/get-leaderboard.use-case.ts`:
- Class `GetLeaderboardUseCase` with `constructor(private readonly repository: LeaderboardContract)`
- `execute()` calls `repository.getWorstRoasts(20)`
- Reuses existing `LeaderboardContract.getWorstRoasts(limit)` method — no new contract methods needed

**New route** — added to `apps/api/src/routes/leaderboard.routes.ts`:
- `GET /leaderboard` handler
- Instantiates `GetLeaderboardUseCase(repository)`, calls `execute()`
- Reuses existing `WorstRoastResponseSchema` for response validation
- Response shape is identical to `/leaderboard/worst`

**Schema**: Reuse `WorstRoastResponseSchema` from `routes/schemas.ts` — no changes needed.

### 2. Frontend: LeaderboardEntry Component Update

**File**: `apps/web/src/components/ui/leaderboard-entry.tsx`

Add collapsible code support:
- Add optional `lineCount` prop to `LeaderboardEntryProps`
- Wrap `<CodeBlock>` with `<LeaderboardEntryCode lineCount={lineCount}>`
- When `lineCount > 5`: collapsed with gradient fade + "show more"/"show less" toggle
- When `lineCount <= 5`: full code display (no collapse)
- Reuses existing `LeaderboardEntryCode` component from `apps/web/src/components/leaderboard-entry-code.tsx`

### 3. Frontend: Leaderboard Page

**New fetch function** — `apps/web/src/app/hooks/use-leaderboard.ts`:
- `fetchLeaderboard()` calls `GET /leaderboard`
- Returns `LeaderboardEntry[]` with fields: `id`, `roastId`, `rank`, `score`, `language`, `codePreview`, `code`, `lineCount`, `updatedAt`

**New client component** — `apps/web/src/components/leaderboard-client.tsx`:
- `'use client'` component
- Uses `useQuery({ queryKey: ['leaderboard'], queryFn: fetchLeaderboard })`
- Maps results to `<LeaderboardEntry>` cards with collapsible code + syntax highlighting
- Includes loading skeleton state

**Updated page** — `apps/web/src/app/leaderboard/page.tsx`:
- Server component
- Prefetches `['leaderboard']` via `fetchLeaderboard()` and `['metrics']` via `fetchMetrics()`
- Uses `HydrationBoundary` + `dehydrate` for TanStack Query cache hydration
- Renders header: title, description, total submissions, avg score (from API metrics)
- Renders `<LeaderboardClient />` wrapped in `<Suspense>` with skeleton fallback
- Keeps existing metadata export

### 4. Frontend: Homepage Shame Leaderboard

**File**: `apps/web/src/components/shame-leaderboard.tsx`

Replace table layout with card layout:
- Remove `ShameLeaderboardHeader` (table header row) — not needed for card layout
- Replace `ShameLeaderboardItem` rendering with `<LeaderboardEntry>` cards
- `ShameLeaderboardWithFooter` keeps footer text ("showing top 3 of {total} · view full leaderboard >>")
- Data fetching unchanged — continues using `['worstRoasts']` query key (3 items)

## Files Changed

| File | Action |
|------|--------|
| `apps/api/src/use-cases/get-leaderboard.use-case.ts` | **Create** — new use case |
| `apps/api/src/use-cases/get-leaderboard.test.ts` | **Create** — unit test |
| `apps/api/src/routes/leaderboard.routes.ts` | **Edit** — add `GET /leaderboard` route |
| `apps/web/src/app/hooks/use-leaderboard.ts` | **Create** — fetch function |
| `apps/web/src/components/leaderboard-client.tsx` | **Create** — client component |
| `apps/web/src/app/leaderboard/page.tsx` | **Edit** — server component with prefetch |
| `apps/web/src/components/ui/leaderboard-entry.tsx` | **Edit** — add collapsible |
| `apps/web/src/components/shame-leaderboard.tsx` | **Edit** — card layout |

## Testing

- Backend: Unit test for `GetLeaderboardUseCase` using `InMemoryLeaderboardRepository`
- Frontend: Existing component tests should pass; verify leaderboard entry renders with collapsible
