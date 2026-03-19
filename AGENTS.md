# Devroast - Agentes

## Visão Geral

Este é um monorepo Turbo Repo com Next.js para o projeto Devroast.

## Estrutura do Projeto

```
devroast/
├── apps/
│   └── web/                    # Next.js App
│       └── src/
│           ├── app/            # App Router (pages, layouts)
│           ├── components/     # Componentes React
│           │   └── ui/         # Componentes de UI genéricos
│           └── lib/            # Utilitários
├── docs/                       # Documentação e guidelines
│   └── skills/                 # Skills para agentes
├── packages/                   # Pacotes compartilhados (futuro)
└── turbo.json                  # Configuração Turbo
```

## Referências

- [Padrões de Componentes UI](./apps/web/src/components/ui/AGENTS.md)
- [Configuração Biome](./biome.json)
- [Configuração Tailwind](./apps/web/src/app/globals.css)
- [Testing Guideline](./docs/TESTING_GUIDELINE.md)
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
pnpm dev          # Desenvolvimento
pnpm build        # Build de produção
pnpm lint         # Verificar código (Biome)
pnpm format       # Formatar código
pnpm clean        # Limpar cache
```
