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
│   └── get-metrics.use-case.ts
├── routes/
│   ├── health.routes.ts      # GET /health
│   ├── roast.routes.ts       # CRUD de roasts
│   └── metrics.routes.ts     # GET /metrics
├── app.ts                    # Configuração Fastify
└── index.ts                  # Entry point
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
- **vitest** - Test runner
- **dotenv** - Variáveis de ambiente
