# Devroast - Agentes

## Visão Geral

Este é um monorepo Turbo Repo com Next.js para o frontend e Fastify para a API.

## Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                       │
│                                                                  │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐       │
│  │  page.tsx   │ ──▶ │  MetricsSrv │ ──▶ │ AnimatedMtr │       │
│  │ (Server)    │     │  (Server)   │     │  (Client)   │       │
│  └─────────────┘     └─────────────┘     └──────┬──────┘       │
│                                                  │               │
│                                                  ▼               │
│  ┌─────────────┐                         ┌─────────────┐        │
│  │ Providers   │ ◀───────────────────── │TanStack Q  │        │
│  │ (QueryClient│                         │(cache)     │        │
│  └─────────────┘                         └─────────────┘        │
└─────────────────────────────────────────────────────────────────┘
                              │ Fetch
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Backend (Fastify)                        │
│                                                                  │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐       │
│  │ /metrics    │ ──▶ │ Use Cases   │ ──▶ │ Repositories│       │
│  │  (Route)    │     │             │     │ (Drizzle)   │       │
│  └─────────────┘     └─────────────┘     └──────┬──────┘       │
│                                                  │               │
│                                                  ▼               │
│                                        ┌─────────────────┐      │
│                                        │   PostgreSQL    │      │
│                                        └─────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

## Estrutura do Projeto

```
devroast/
├── apps/
│   ├── api/                    # Fastify API
│   │   ├── src/
│   │   │   ├── db/            # Drizzle schema e conexão
│   │   │   ├── contracts/     # Interfaces de repositórios
│   │   │   ├── entities/      # Tipos de domínio
│   │   │   ├── repositories/  # Implementações (Drizzle + InMemory)
│   │   │   ├── use-cases/     # Lógica de negócio
│   │   │   └── routes/        # Rotas Fastify
│   │   └── drizzle.config.ts
│   └── web/                   # Next.js App
│       └── src/
│           ├── app/            # App Router (pages, layouts)
│           ├── components/     # Componentes React
│           │   ├── providers.tsx    # TanStack Query Provider
│           │   ├── metrics-*.tsx   # Componentes de métricas
│           │   └── ui/             # Componentes de UI genéricos
│           └── lib/            # Utilitários
├── docker-compose.yml          # PostgreSQL (raiz do monorepo)
├── docs/                       # Documentação e guidelines
│   └── specs/                  # Especificações de features
└── turbo.json                  # Configuração Turbo
```

## Referências

- [API AGENTS.md](./apps/api/AGENTS.md) - Documentação da API Fastify
- [Web AGENTS.md](./apps/web/AGENTS.md) - Documentação do Frontend Next.js
- [Padrões de Componentes UI](./apps/web/src/components/ui/AGENTS.md)
- [Configuração Biome](./biome.json)
- [Configuração Tailwind](./apps/web/src/app/globals.css)
- [Testing Guideline Frontend](./docs/TESTING_GUIDELINE.md)
- [Testing Guideline API](./docs/TESTING_GUIDELINE_API.md)
- [TanStack Query Spec](./docs/specs/tanstack-query.md)
- [Commits Guideline](./docs/skills/COMMITS_GUIDELINE.md)

## Regras Gerais

1. **Linting**: Execute `pnpm lint` antes de commit
2. **Build**: Execute `pnpm build` para verificar builds
3. **Formatação**: Execute `pnpm format` para formatar código
4. **Nomenclatura de Exports**: Sempre use named exports, nunca default exports
5. **TypeScript**: Todos os componentes devem ter tipos definidos
6. **Nomenclatura de Arquivos**: Sempre use `kebab-case`. Exemplo: `meu-arquivo.tsx`, `button.tsx`
7. **Commits**: Siga o padrão [Conventional Commits](./docs/skills/COMMITS_GUIDELINE.md)

## Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev          # Inicia todos os apps em watch mode
pnpm dev:api      # Apenas API (porta 3333)
pnpm dev:web      # Apenas Web (porta 3000)

# Build e Lint
pnpm build        # Build de produção
pnpm lint         # Verificar código (Biome)
pnpm format       # Formatar código

# Database (API)
pnpm --filter api db:push        # Push schema para DB
pnpm --filter api db:studio     # Abrir Drizzle Studio

# Docker
docker-compose up -d    # Iniciar PostgreSQL
docker-compose down     # Parar PostgreSQL
docker-compose logs -f  # Ver logs do Postgres

# Testes
pnpm test         # Rodar todos os testes
pnpm clean        # Limpar cache
```
