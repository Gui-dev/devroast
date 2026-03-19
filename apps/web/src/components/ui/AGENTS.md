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
```
