# TanStack Query Integration Specification

## Context

TanStack Query (React Query) will be used as our server-state management layer between the Next.js frontend and Fastify backend API. This enables efficient data fetching, caching, and seamless hydration from server to client.

## Feature Requirements

- [x] TanStack Query v5 setup in Next.js app
- [x] QueryClient provider with proper server/client separation
- [x] HydrationBoundary for server-to-client data transfer
- [x] Suspense integration for loading states
- [x] Fastify route for metrics endpoint
- [x] Metrics use-case and repository layer
- [x] dotenv support for DATABASE_URL

## Implementation Status

| File | Status |
|------|--------|
| `apps/api/src/use-cases/get-metrics.use-case.ts` | ✅ Complete |
| `apps/api/src/routes/metrics.routes.ts` | ✅ Complete |
| `apps/web/src/lib/get-query-client.ts` | ✅ Complete |
| `apps/web/src/components/providers.tsx` | ✅ Complete |
| `apps/web/src/components/metrics-skeleton.tsx` | ❌ Removido (usamos `initialData` com 0) |
| `apps/web/src/components/animated-metrics.tsx` | ✅ Complete |
| `apps/web/src/components/metrics-server.tsx` | ✅ Complete |
| `apps/web/src/components/home-client.tsx` | ✅ Complete |
| `apps/web/src/app/page.tsx` | ✅ Complete |

## Research Summary

### TanStack Query v5 + Next.js App Router

**Key Features:**
- **Server Components**: Prefetch data on server, hydrate to client
- **Streaming**: Leverage Next.js streaming with Suspense
- **QueryClient separation**: Different instances for server vs browser
- **Hydration**: Dehydrate state from server, rehydrate on client

**Architecture Pattern:**
```
┌─────────────────────────────────────────────────────────────┐
│                      Next.js Server                         │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐   │
│  │  Page.tsx   │ ──▶ │ prefetchQuery│ ──▶ │  API Fetch  │   │
│  │(Server Comp)│     │ (dehydrate) │     │  /metrics   │   │
│  └─────────────┘     └─────────────┘     └─────────────┘   │
│         │                                        │          │
│         ▼                                        ▼          │
│  ┌─────────────┐                         ┌─────────────┐   │
│  │HydrationBnd │                         │   Fastify   │   │
│  │(dehydrate)  │                         │    API      │   │
│  └─────────────┘                         └─────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Client Browser                          │
│  ┌─────────────┐     ┌─────────────┐                       │
│  │ Client.tsx  │ ──▶ │ TanStack Q  │                       │
│  │(useQuery)   │     │  (cache)    │                       │
│  └─────────────┘     └─────────────┘                       │
└─────────────────────────────────────────────────────────────┘
```

## Proposed Implementation

### File Structure

```
apps/
├── api/
│   └── src/
│       ├── use-cases/
│       │   └── get-metrics.use-case.ts
│       └── routes/
│           └── metrics.routes.ts
└── web/
    └── src/
        ├── lib/
        │   └── get-query-client.ts
        ├── components/
        │   ├── providers.tsx
        │   ├── metrics-skeleton.tsx
        │   ├── animated-metrics.tsx
        │   ├── metrics-server.tsx
        │   └── home-client.tsx
        └── app/
            └── hooks/
                └── use-metrics.ts
```

### QueryClient Setup (`apps/web/src/lib/get-query-client.ts`)

```typescript
import { QueryClient } from '@tanstack/react-query'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

export function getQueryClient() {
  if (typeof window === 'undefined') {
    return makeQueryClient()
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}
```

### Provider Setup (`apps/web/src/components/providers.tsx`)

```typescript
'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/get-query-client'

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

### Metrics Route (`apps/api/src/routes/metrics.routes.ts`)

```typescript
import type { FastifyInstance } from 'fastify'
import { getMetricsUseCase } from '@/use-cases/get-metrics.use-case'

export async function metricsRoutes(fastify: FastifyInstance) {
  fastify.get('/metrics', async () => {
    const metrics = await getMetricsUseCase()
    return metrics
  })
}
```

### Metrics Use-Case (`apps/api/src/use-cases/get-metrics.use-case.ts`)

```typescript
import type { RoastRepository } from '@/repositories/roast.repository.js'

export interface Metrics {
  totalRoasts: number
  avgScore: number
}

export async function getMetricsUseCase(
  roastRepository: RoastRepository
): Promise<Metrics> {
  return roastRepository.getMetrics()
}
```

### Usage in Server Component with Suspense

```tsx
import { Suspense } from 'react'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/get-query-client'
import { fetchMetrics } from '@/app/hooks/use-metrics'
import { AnimatedMetrics } from '@/components/animated-metrics'
import { MetricsSkeleton } from '@/components/metrics-skeleton'

export default async function HomePage() {
  const queryClient = getQueryClient()

  queryClient.prefetchQuery({
    queryKey: ['metrics'],
    queryFn: fetchMetrics,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<MetricsSkeleton />}>
        <AnimatedMetrics />
      </Suspense>
    </HydrationBoundary>
  )
}
```

### Client Component with useQuery

```tsx
'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchMetrics } from '@/app/hooks/use-metrics'

export function AnimatedMetrics() {
  const { data } = useQuery({
    queryKey: ['metrics'],
    queryFn: fetchMetrics,
  })

  return (
    <div>
      <span>{data?.totalRoasts}</span>
      <span>{data?.avgScore}</span>
    </div>
  )
}
```

## Dependencies

| Package | Purpose | Install |
|---------|---------|---------|
| `@tanstack/react-query` | Core library | `pnpm add @tanstack/react-query` |
| `@number-flow/react` | Animated numbers | `pnpm add @number-flow/react` |
| `dotenv` | Environment variables | Already installed |

### Environment Setup

Create `apps/api/.env`:
```env
DATABASE_URL=postgresql://root:root@localhost:5432/devroast
```

## Reference Files

- [TanStack Query React Overview](https://tanstack.com/query/latest/docs/framework/react/overview)
- [TanStack Query Advanced SSR](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr)
- [TanStack Query Suspense](https://tanstack.com/query/latest/docs/framework/react/guides/suspense)
