# Padrões de Componentes UI

## Visão Geral

Este documento define os padrões e convenções para a criação de componentes de UI genéricos no projeto Devroast.

## Regras de Implementação

### 1. Estrutura de Arquivos

```
components/
└── ui/
    ├── button.tsx      # Componente principal
    └── index.ts        # Barrel exports (opcional)
```

### 2. Imports

- Usar **named exports** - nunca default exports
- Utilizar `@/` alias para imports de `~/lib` e `~/components`
- Importar tipos do React explicitamente: `import { type ButtonHTMLAttributes } from "react"`

### 3. Estilização com Tailwind

- Usar **tailwind-variants** para gerenciamento de variantes
- Usar **clsx** + **tailwind-merge** para merge de classes
- Não usar CSS modules ou styled-components
- Extender o tema em `globals.css` com `@theme`

### 4. Utilitário `cn()`

Sempre usar o utilitário `cn()` para mesclar classes:

```typescript
import { cn } from "@/lib/cn";

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return <button ref={ref} className={cn(buttonStyles({ className }))} {...props} />;
  }
);
```

### 5. Tipagem com TypeScript

- Estender propriedades nativas do HTML element correspondente
- Exportar tipo `ComponentNameProps` para uso externo
- Usar `forwardRef` quando necessário para `ref` forwarding

```typescript
export type ButtonProps = VariantProps<typeof buttonStyles> &
  ButtonHTMLAttributes<HTMLButtonElement>;
```

### 6. Estrutura de Componente

```typescript
import { cn } from "@/lib/cn";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { type VariantProps, tv } from "tailwind-variants";

const componentStyles = tv({
  base: ["classes-base"],
  variants: {
    variant: {
      default: "classes-variant-default",
    },
    size: {
      default: "classes-size-default",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export type ComponentNameProps = VariantProps<typeof componentStyles> &
  HTMLAttributes<HTMLElement>;

const ComponentName = forwardRef<HTMLElement, ComponentNameProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <element
        ref={ref}
        className={cn(componentStyles({ variant, size, className }))}
        {...props}
      >
        {children}
      </element>
    );
  }
);

ComponentName.displayName = "ComponentName";

export { ComponentName, componentStyles };
```

### 7. Nomenclatura

| Item | Convenção | Exemplo |
|------|-----------|---------|
| Arquivo | kebab-case | `button.tsx` |
| Componente | PascalCase | `Button` |
| Props type | PascalCase + Props | `ButtonProps` |
| Styles TV | camelCase + Styles | `buttonStyles` |
| Variantes | camelCase | `variant`, `size` |

### 8. Variantes Recomendadas

Manter no máximo 6 variantes por componente:

| Variante | Uso |
|----------|-----|
| `default` | Estilo primário (background colorido, texto escuro) |
| `secondary` | Borda visível, fundo transparente, texto claro |
| `link` | Borda visível, fundo transparente, texto secundário |

### 9. Propriedades HTML Estendidas

Sempre incluir todas as propriedades nativas do elemento HTML:

- `Button` → `ButtonHTMLAttributes<HTMLButtonElement>`
- `Input` → `InputHTMLAttributes<HTMLInputElement>`
- `Div` → `HTMLAttributes<HTMLDivElement>`

### 10. Children

Manter o `children` simples. Para ícones ou estados de loading, usar children como wrapper:

```tsx
// ✅ Correto
<Button>
  <Loader className="size-4 animate-spin" />
  Loading
</Button>

// ❌ Errado - não criar props específicas para icon/loading
<Button isLoading={true} leftIcon={<Icon />} />
```

### 11. Padrão de Composição

Componentes complexos devem ser divididos em sub-componentes usando o padrão de composição:

```tsx
// Estrutura de Card com composição
<Card variant="critical">
  <CardHeader>
    <Badge variant="critical" />
  </CardHeader>
  <CardTitle>Título do Card</CardTitle>
  <CardDescription>Descrição do Card</CardDescription>
</Card>
```

```tsx
// Estrutura de CodeBlock com composição
<CodeBlock lang="javascript">
  <CodeBlockHeader>arquivo.js</CodeBlockHeader>
  <CodeBlockContent code="..." lang="javascript" />
</CodeBlock>
```

```tsx
// Estrutura de LeaderboardRow com composição
<LeaderboardRow>
  <LeaderboardRank>1</LeaderboardRank>
  <LeaderboardScore>9.5</LeaderboardScore>
  <LeaderboardCode>code snippet...</LeaderboardCode>
  <LeaderboardLanguage>javascript</LeaderboardLanguage>
</LeaderboardRow>
```

**Regras:**
- Exportar todos os sub-componentes do mesmo arquivo
- Sub-componentes devem receber `children` como conteúdo principal
- Sub-componentes devem aceitar `className` para customização

## Design System Tokens

Cores definidas em `globals.css`:

```css
/* Backgrounds */
bg-bg-page      /* #0c0c0c */
bg-bg-input     /* #111111 */
bg-bg-elevated  /* #1a1a1a */

/* Text */
text-text-primary   /* #fafafa */
text-text-secondary /* #6b7280 */
text-text-tertiary  /* #4b5563 */

/* Accent */
text-accent-green  /* #10b981 */
text-accent-amber  /* #f59e0b */
text-accent-red    /* #ef4444 */

/* Fonts */
font-mono /* JetBrains Mono */
font-sans /* IBM Plex Mono */

/* Diff */
bg-diff-removed  /* #1A0A0A */
bg-diff-added    /* #0A1A0F */

/* Syntax Highlighting */
text-syn-keyword    /* #c678dd */
text-syn-function   /* #61afef */
text-syn-variable   /* #e06c75 */
text-syn-number     /* #d19a66 */
text-syn-string     /* #e5c07b */
text-syn-operator   /* #abb2bf */
```

## Componentes Disponíveis

| Componente | Arquivo | Descrição |
|-----------|---------|-----------|
| `Button` | `button.tsx` | Botões com variantes default, secondary, link |
| `Badge` | `badge.tsx` | Status badges com variantes critical, warning, good, needs_serious_help |
| `Toggle` | `toggle.tsx` | Switch toggle customizado com useState |
| `DiffLine` | `diff-line.tsx` | Linhas de diff com variantes removed, added, context |
| `CodeBlock` | `code-block.tsx` | Bloco de código com syntax highlighting (shiki + tema vesper) |
| `Card` | `card.tsx` | Card de análise com sub-componentes (Header, Title, Description) |
| `LeaderboardRow` | `leaderboard-row.tsx` | Linha de leaderboard com sub-componentes (Rank, Score, Code, Language) |
| `ScoreRing` | `score-ring.tsx` | Gráfico circular de pontuação com gradiente |
| `Link` | `link.tsx` | Link de navegação usando Next.js Link |

### Sub-componentes

**Card:**
- `Card` - Container principal
- `CardHeader` - Header wrapper
- `CardTitle` - Título
- `CardDescription` - Descrição

**CodeBlock:**
- `CodeBlock` - Container principal
- `CodeBlockHeader` - Header com dots
- `CodeBlockContent` - Área do código com números de linha

**LeaderboardRow:**
- `LeaderboardRow` - Container da linha
- `LeaderboardRank` - Coluna de rank (#N)
- `LeaderboardScore` - Coluna de score
- `LeaderboardCode` - Coluna de preview do código
- `LeaderboardLanguage` - Coluna de linguagem

### Componentes de Layout

| Componente | Arquivo | Descrição |
|-----------|---------|-----------|
| `Navbar` | `navbar.tsx` | Barra de navegação do topo |

### Dependências de Bibliotecas

- `shiki` - Syntax highlighting (CodeBlock)
