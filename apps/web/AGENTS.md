# Web - Agentes

## Visão Geral

Frontend Next.js 16 com App Router, TanStack Query v5 para data fetching e Tailwind CSS para estilos.

## Estrutura do Projeto

```
apps/web/src/
├── app/
│   ├── layout.tsx           # Root layout com Providers
│   ├── page.tsx             # Homepage (Server Component)
│   ├── hooks/
│   │   └── use-metrics.ts   # Fetch function para metrics
│   ├── leaderboard/
│   │   └── page.tsx        # Página de leaderboard
│   └── roast/
│       └── [id]/
│           └── page.tsx     # Página de detail do roast
├── components/
│   ├── providers.tsx            # TanStack Query Provider
│   ├── home-client.tsx          # Client component (CodeEditor, Toggle)
│   ├── metrics-server.tsx       # Server component para metrics
│   ├── animated-metrics.tsx     # Client component com NumberFlow
│   ├── metrics-types.ts         # Tipos compartilhados
│   ├── navbar.tsx               # Navegação
│   └── ui/                      # Componentes de design system
│       ├── button.tsx
│       ├── badge.tsx
│       ├── card.tsx
│       ├── code-block.tsx
│       ├── code-editor.tsx
│       ├── diff-line.tsx
│       ├── leaderboard-row.tsx
│       ├── link.tsx
│       ├── score-ring.tsx
│       └── toggle.tsx
├── lib/
│   ├── cn.ts                # Utilitário clsx + tailwind-merge
│   ├── get-query-client.ts   # TanStack Query client factory
│   ├── detect-language.ts    # Detecção de linguagem
│   ├── get-score-color.ts   # Cor baseada no score
│   └── languages.ts          # Definição de linguagens
└── hooks/
    └── use-shiki-highlighter.ts  # Hook para syntax highlighting
```

## TanStack Query v5

### Provider Setup

O `Providers` component é wrappado no `layout.tsx`:

```tsx
// apps/web/src/components/providers.tsx
import { QueryClientProvider } from '@tanstack/react-query'

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
```

### QueryClient Factory

```typescript
// apps/web/src/lib/get-query-client.ts
export function getQueryClient() {
  if (typeof window === 'undefined') {
    return makeQueryClient()  // Server: nova instância
  }
  if (!browserQueryClient) browserQueryClient = makeQueryClient()
  return browserQueryClient  // Client: singleton
}
```

### Padrão de Server/Client Components

```
page.tsx (Server Component)
  └── <MetricsServer /> (Server Component)
        └── <AnimatedMetrics /> (Client Component com useQuery)
```

### Exemplo: Metrics

```tsx
// animated-metrics.tsx (Client Component)
'use client'

import { useQuery } from '@tanstack/react-query'
import NumberFlow from '@number-flow/react'
import { fetchMetrics } from '@/app/hooks/use-metrics'

export function AnimatedMetrics() {
  const { data } = useQuery({
    queryKey: ['metrics'],
    queryFn: fetchMetrics,
    placeholderData: { totalRoasts: 0, avgScore: 0 },  // Para animação
  })

  return (
    <div>
      <NumberFlow value={data?.totalRoasts ?? 0} />
      <NumberFlow value={data?.avgScore ?? 0} />
    </div>
  )
}
```

```tsx
// metrics-server.tsx (Server Component)
import { AnimatedMetrics } from '@/components/animated-metrics'

export async function MetricsServer() {
  return <AnimatedMetrics />
}
```

### Fetch Function

```typescript
// apps/web/src/app/hooks/use-metrics.ts
export async function fetchMetrics(): Promise<Metrics> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333'
  const response = await fetch(`${baseUrl}/metrics`)
  if (!response.ok) throw new Error('Failed to fetch metrics')
  return response.json()
}
```

## NumberFlow

Biblioteca para animação de números. Usada nos componentes de métricas para transições suaves de valores.

```tsx
import NumberFlow from '@number-flow/react'

<NumberFlow value={100} />
```

## Variáveis de Ambiente

```env
NEXT_PUBLIC_API_URL=http://localhost:3333
```

## Scripts

```bash
pnpm dev      # Next.js dev (porta 3000)
pnpm build    # Production build
pnpm lint     # Biome check
pnpm format   # Biome format
pnpm test     # Run tests
```

## Testes

### Localização
- `src/lib/*.test.ts` - Testes de utilities
- `src/components/ui/**/*.test.tsx` - Testes de componentes

### Padrões
- Usar `@testing-library/react` para renderização
- Usar `vi.mock` para mocks
- Testar comportamento, não implementação

## Design System

Ver [AGENTS.md de UI](./src/components/ui/AGENTS.md) para detalhes dos componentes disponíveis.

## Dependências Principais

- **@tanstack/react-query** - Data fetching e cache
- **@number-flow/react** - Animação de números
- **next** - Framework React
- **tailwindcss** - Estilização
- **tailwind-variants** - Composição de variantes
- **shiki** - Syntax highlighting
- **vitest** - Test runner
