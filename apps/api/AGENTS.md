# API - Agentes

## Visão Geral

API Fastify com arquitetura hexagonal (Ports & Adapters). Conecta ao PostgreSQL via Drizzle ORM.

## Estrutura do Projeto

```
apps/api/src/
├── db/
│   ├── index.ts          # Conexão Drizzle + Pool PostgreSQL
│   ├── schema.ts         # Definição das tabelas (Drizzle)
│   └── seed.ts           # Script de seed com dados fakes
├── contracts/
│   └── roast.contract.ts  # Interfaces dos repositórios
├── entities/
│   └── roast.entity.ts    # Tipos de domínio
├── repositories/
│   ├── roast.repository.ts              # Implementação Drizzle
│   ├── leaderboard.repository.ts        # Implementação Drizzle
│   ├── code-diff.repository.ts          # Implementação Drizzle
│   ├── analysis-issue.repository.ts     # Implementação Drizzle
│   └── in-memory/
│       └── roast-in-memory.repository.ts # Para testes unitários
├── use-cases/
│   ├── create-roast.use-case.ts
│   ├── get-roast.use-case.ts
│   ├── list-roasts.use-case.ts
│   ├── get-metrics.use-case.ts
│   └── get-worst-roasts.use-case.ts
├── routes/
│   ├── schemas.ts           # Zod schemas centralizados
│   ├── health.routes.ts     # GET /health
│   ├── roast.routes.ts      # CRUD de roasts
│   ├── metrics.routes.ts    # GET /metrics
│   └── leaderboard.routes.ts # GET /leaderboard/worst
├── app.ts                   # Configuração Fastify
└── index.ts                 # Entry point
```

## Endpoints

### Health
- `GET /health` - Status da API

### Roasts
- `POST /roasts` - Criar roast
- `GET /roasts` - Listar roasts (com `?limit=N`)
- `GET /roasts/:id` - Buscar roast por ID

### Metrics
- `GET /metrics` - Retorna `{ totalRoasts: number, avgScore: number }`

### Leaderboard
- `GET /leaderboard/worst` - Retorna os 3 piores roasts

## Validação com Zod

Todas as validações de rotas usam **Zod** para type-safety e melhor DX.

### Arquivo de Schemas

```typescript
// apps/api/src/routes/schemas.ts
import { z } from 'zod'

export const MetricsResponseSchema = z.object({
  totalRoasts: z.number(),
  avgScore: z.number(),
})

export const CreateRoastBodySchema = z.object({
  userId: z.string().optional(),
  code: z.string().min(1),
  language: z.enum([...]),
  roastMode: z.enum(['honest', 'roast']).default('roast'),
})

// Tipos inferidos automaticamente
export type MetricsResponse = z.infer<typeof MetricsResponseSchema>
export type CreateRoastBody = z.infer<typeof CreateRoastBodySchema>
```

### Uso nas Rotas

```typescript
import { MetricsResponseSchema } from './schemas.js'

fastify.get('/metrics', {
  schema: {
    response: {
      200: MetricsResponseSchema,
    },
  },
}, async () => { ... })
```

### Regras

1. **Sempre usar Zod** para validação de input/output
2. **Centralizar schemas** em `routes/schemas.ts`
3. **Exportar tipos** com `z.infer` para uso em outros arquivos
4. **NUNCA** usar JSON Schema nativo do Fastify

## Arquitetura

### Camadas
1. **Routes** - Recebe requisições HTTP, valida schemas
2. **Use Cases** - Lógica de negócio, injetam repositories
3. **Contracts** - Interfaces que definem operações
4. **Repositories** - Implementam contracts (Drizzle ou InMemory)

### Padrão de Injeção
```typescript
// Routes recebem repository via fastify plugin
export function roastRoutes(fastify: FastifyInstance, { repository }: { repository: RoastContract }) { }

// Use cases recebem repository via constructor
export class CreateRoastUseCase {
  constructor(private readonly repository: RoastContract) {}
}
```

## Variáveis de Ambiente

Criar `apps/api/.env`:
```env
DATABASE_URL=postgresql://root:root@localhost:5432/devroast
```

## Scripts

```bash
pnpm dev              # Development (tsx watch)
pnpm build            # TypeScript build
pnpm test             # Run tests (Vitest)
pnpm test:watch       # Watch mode
pnpm seed             # Seed database with fake data
pnpm drizzle-kit push  # Push schema to database
```

## Testes

### Padrão: Repositórios In-Memory

Cada use case é testado com `InMemory*Repository` para isolamento.

### Arquivos de Teste
- `src/use-cases/*.test.ts`
- `src/repositories/*.test.ts`

### Exemplo
```typescript
describe('CreateRoastUseCase', () => {
  let repository: InMemoryRoastRepository
  let useCase: CreateRoastUseCase

  beforeEach(() => {
    repository = new InMemoryRoastRepository()
    useCase = new CreateRoastUseCase(repository)
  })

  it('should create a roast', async () => {
    const roast = await useCase.execute({ code: '...', language: 'javascript' })
    expect(roast.id).toBeDefined()
  })
})
```

## Linting e Formatação

```bash
pnpm lint    # Biome check
pnpm format  # Biome format
```

## Dependências Principais

- **fastify** - Framework HTTP
- **drizzle-orm** - ORM TypeScript
- **pg** - Driver PostgreSQL
- **zod** - Validação de schemas
- **vitest** - Test runner
- **dotenv** - Variáveis de ambiente

## Performance: Queries Paralelas

Quando necessário buscar múltiplos dados, usar `Promise.all` para executar em paralelo:

```typescript
// ✅ Correto - executa em paralelo
await Promise.all([
  queryClient.prefetchQuery({ queryKey: ['metrics'], queryFn: fetchMetrics }),
  queryClient.prefetchQuery({ queryKey: ['worstRoasts'], queryFn: fetchWorstRoasts }),
])

// ❌ Errado - executa sequencialmente
await queryClient.prefetchQuery({ queryKey: ['metrics'], queryFn: fetchMetrics })
await queryClient.prefetchQuery({ queryKey: ['worstRoasts'], queryFn: fetchWorstRoasts })
```

### Regra

**Sempre usar `Promise.all`** quando:
- Múltiplas queries independentes precisam ser carregadas
- Os dados não dependem um do outro

**Não usar** quando:
- Uma query depende do resultado de outra
- A segunda só deve ser executada após a primeira
