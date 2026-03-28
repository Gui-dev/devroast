# Storybook Integration Design

## Contexto

O projeto Devroast possui um design system com ~11 componentes UI sem documentação visual. A integração do Storybook permite desenvolvimento de componentes em isolamento, documentação interativa e testes de acessibilidade.

## Decisões

- **Framework:** `@storybook/nextjs-vite` (Vite-based) — builds mais rápidos e melhor suporte a testes
- **Escopo:** Apenas componentes UI (button, badge, card, toggle, diff-line, score-ring, code-block-client, code-editor, leaderboard-row, leaderboard-entry, link)
- **Organização:** Stories co-localizadas com componentes (`.stories.tsx`)
- **Testes:** Interaction tests (play functions) + Accessibility testing (a11y addon)
- **CI:** Build check do Storybook no pipeline

## Setup

### Dependências (devDependencies)

- `@storybook/nextjs-vite`
- `storybook`
- `@storybook/addon-a11y`
- `@storybook/addon-essentials`
- `@storybook/test`

### Scripts (`apps/web/package.json`)

```json
"storybook": "storybook dev -p 6006",
"build-storybook": "storybook build"
```

### Turbo (`turbo.json`)

Adicionar task `storybook`:

```json
"storybook": {
  "cache": false,
  "persistent": true
},
"build-storybook": {
  "cache": true,
  "outputs": ["storybook-static/**"]
}
```

### Biome (`biome.json`)

Adicionar `.storybook` ao `files.ignore`.

### Arquivos de configuração

```
apps/web/
├── .storybook/
│   ├── main.ts
│   └── preview.ts
```

#### `.storybook/main.ts`

```typescript
import type { StorybookConfig } from '@storybook/nextjs-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/nextjs-vite',
    options: {},
  },
  features: {
    experimentalRSC: true,
  },
}

export default config
```

#### `.storybook/preview.ts`

```typescript
import type { Preview } from '@storybook/nextjs-vite'
import '../src/app/globals.css'

const preview: Preview = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
}

export default preview
```

## Estrutura de Stories

Hierarquia no sidebar: `UI/ComponentName`.

Padrão CSF 3 para cada story:

```typescript
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Component } from './component'

const meta = {
  component: Component,
  title: 'UI/Component',
} satisfies Meta<typeof Component>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { ... },
}
```

### Arquivos de stories

```
components/ui/
├── button.stories.tsx
├── badge.stories.tsx
├── card.stories.tsx
├── toggle.stories.tsx
├── diff-line.stories.tsx
├── score-ring.stories.tsx
├── code-editor/code-editor.stories.tsx
├── code-block/code-block-client.stories.tsx
├── leaderboard-row.stories.tsx
├── leaderboard-entry.stories.tsx
└── link.stories.tsx
```

### Stories por componente

**button.stories.tsx**
- `Default` — variant=default, children
- `Secondary` — variant=secondary
- `Link` — variant=link

**badge.stories.tsx**
- `Critical` — severity=critical
- `Warning` — severity=warning
- `Good` — severity=good
- `NeedsSeriousHelp` — severity=needs_serious_help

**card.stories.tsx**
- `Default` — Card com CardHeader, CardTitle, CardDescription
- `Critical` — variant=critical

**toggle.stories.tsx**
- `Default` — unchecked state
- `Checked` — checked state
- `WithInteraction` — play function para alternar

**diff-line.stories.tsx**
- `Removed` — variant=removed
- `Added` — variant=added
- `Context` — variant=context

**score-ring.stories.tsx**
- `Score0` — score=0
- `Score5` — score=5
- `Score10` — score=10

**code-block-client.stories.tsx**
- `Default` — single line code
- `MultiLine` — multiple lines
- mockar `shiki` com `vi.mock`

**code-editor.stories.tsx**
- `Empty` — placeholder visible
- `WithValue` — pre-filled content
- `OverLimit` — character count exceeded

**leaderboard-row.stories.tsx**
- `Default` — all sub-components composed
- `ExpandableCode` — long code with expand/collapse
- `CollapsibleInteraction` — play function expand/collapse

**leaderboard-entry.stories.tsx**
- `Rank1` — amber color
- `Rank2` — secondary color
- `Rank3` — red color
- `HighScore` — critical variant
- `LowScore` — good variant

**link.stories.tsx**
- `Default` — renders link text

## Interaction Tests

Play functions para componentes interativos:

```typescript
import { expect, within } from '@storybook/test'

export const ToggleInteraction: Story = {
  args: { label: 'Roast mode' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const toggle = canvas.getByRole('switch')
    await expect(toggle).not.toBeChecked()
    await userEvent.click(toggle)
    await expect(toggle).toBeChecked()
  },
}
```

Componentes com play functions: `toggle`, `code-editor`, `leaderboard-row`.

## Accessibility

`@storybook/addon-a11y` habilitado globalmente. Todos os componentes recebem a11y checks automáticos no painel "Accessibility" do Storybook.

## CI Integration

Adicionar step no pipeline de CI:

```yaml
- name: Build Storybook
  run: pnpm --filter web build-storybook
```

O build estático verifica que nenhuma story quebrou. Sem deploy automático.

## Mocks Necessários

- `shiki` → mockar `codeToHtml` nos stories de `code-block-client` (mesmo padrão dos testes unitários)
- `next/image` → funciona out-of-the-box com `@storybook/nextjs-vite`
- `next/navigation` → stubbed automaticamente pelo framework
- `@tanstack/react-query` → componentes que usam `useQuery` precisam de wrapper com `QueryClientProvider` ou mock

## Ordem de implementação

1. Instalar dependências e criar `.storybook/main.ts` + `preview.ts`
2. Adicionar scripts ao `package.json` e `turbo.json`
3. Atualizar `biome.json`
4. Criar stories para componentes estáticos (button, badge, card, diff-line, score-ring, link)
5. Criar stories para componentes interativos (toggle, code-editor, leaderboard-row)
6. Criar stories para componentes com dependências (code-block-client, leaderboard-entry)
7. Configurar build-storybook no CI
8. Verificar que `pnpm storybook` e `pnpm build-storybook` funcionam
