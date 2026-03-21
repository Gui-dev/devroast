# Devroast

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=nodedotjs)
![PNPM](https://img.shields.io/badge/PNPM-9.0+-F69220?style=flat-square&logo=pnpm)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**Paste your code. Get roasted.**

A web application that analyzes and rates code with brutally honest feedback.

</div>

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Quick Start](#quick-start)
- [For Developers](#for-developers)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
  - [Scripts](#available-scripts)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Conventions](#conventions)
- [Contributing](#contributing)
- [License](#license)

---

## About

Devroast is a code analysis tool that provides brutally honest feedback on your code. Paste any code snippet, and get an instant roast with a score based on code quality, best practices, and potential issues.

### Key Features

- **Smart Syntax Highlighting** - Automatic language detection with manual override option
- **Code Analysis** - Instant feedback on code quality
- **Roast Mode** - Maximum sarcasm enabled for maximum entertainment
- **Leaderboard** - See the worst code on the internet ranked by shame

---

## Quick Start

### Using the Application

1. Visit the live application at `https://devroast.app`
2. Paste your code in the editor
3. Select the language (or let us auto-detect it)
4. Click "Roast My Code"
5. Get your score and feedback

### Local Development

```bash
# Clone the repository
git clone https://github.com/Gui-dev/devroast.git

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## For Developers

### Prerequisites

- **Node.js** 18+
- **PNPM** 9.0+
- **Git**

### Setup

1. **Clone the repository**

```bash
git clone https://github.com/Gui-dev/devroast.git
cd devroast
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Start the development server**

```bash
pnpm dev
```

4. **Open the application**

Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm lint` | Run linting |
| `pnpm lint:fix` | Fix linting issues automatically |
| `pnpm format` | Format code |
| `pnpm format:check` | Check code formatting |
| `pnpm clean` | Clean cache and build artifacts |

---

## Architecture

### Monorepo Structure

This project uses **Turborepo** for monorepo management:

```
devroast/
├── apps/
│   └── web/                    # Next.js application
│       └── src/
│           ├── app/            # App Router pages
│           ├── components/     # React components
│           └── lib/            # Utilities
├── docs/                       # Documentation
├── packages/                   # Shared packages (future)
├── turbo.json                  # Turbo configuration
└── biome.json                  # Biome configuration
```

### Design System

The UI follows a composition-based component pattern:

```tsx
// Components are composed with sub-components
<Card variant="critical">
  <CardHeader>
    <Badge variant="critical" />
  </CardHeader>
  <CardTitle>Card Title</CardTitle>
  <CardDescription>Card description text</CardDescription>
</Card>
```

### Code Editor

The code editor uses a **textarea + syntax highlighting overlay** pattern inspired by [ray.so](https://ray.so):

- **Auto-detection**: Language is automatically detected using `highlight.js`
- **Syntax highlighting**: Powered by `Shiki` with the Vesper theme
- **Paste-only**: Users paste code, view highlighting, and can manually override the language

---

## Tech Stack

### Core

| Technology | Version | Purpose |
|------------|---------|---------|
| [Next.js](https://nextjs.org/) | 16.x | React framework |
| [React](https://react.dev/) | 19.x | UI library |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | v4 | Styling |
| [Biome](https://biomejs.dev/) | 1.9+ | Linting & formatting |

### Libraries

| Library | Purpose |
|---------|---------|
| [Shiki](https://shiki.matsu.io/) | Syntax highlighting |
| [highlight.js](https://highlightjs.org/) | Language auto-detection |

### Tooling

| Tool | Purpose |
|------|---------|
| [Turborepo](https://turbo.build/) | Monorepo orchestration |
| [PNPM](https://pnpm.io/) | Package management |

---

## Project Structure

```
devroast/
├── apps/
│   └── web/
│       └── src/
│           ├── app/
│           │   ├── globals.css        # Global styles & design tokens
│           │   ├── layout.tsx        # Root layout
│           │   ├── page.tsx          # Homepage
│           │   └── components/
│           │       └── page.tsx      # Component showcase
│           │
│           ├── components/
│           │   ├── navbar.tsx        # Navigation component
│           │   │
│           │   └── ui/               # Design system components
│           │       ├── button.tsx
│           │       ├── badge.tsx
│           │       ├── toggle.tsx
│           │       ├── diff-line.tsx
│           │       ├── card.tsx
│           │       ├── score-ring.tsx
│           │       ├── link.tsx
│           │       ├── leaderboard-row.tsx
│           │       │
│           │       ├── code-editor/   # Code editor with auto-detect
│           │       │   ├── index.ts
│           │       │   └── code-editor.tsx
│           │       │
│           │       └── code-block/    # Static code block
│           │           ├── index.ts
│           │           └── code-block.tsx
│           │
│           └── lib/
│               ├── cn.ts              # Utility for class merging
│               └── detect-language.ts # Language detection utility
│
├── docs/
│   ├── specs/                       # Feature specifications
│   │   └── code-editor.md
│   └── skills/
│       └── commits-guideline.md
│
├── biome.json                       # Biome configuration
├── turbo.json                      # Turborepo configuration
├── pnpm-workspace.yaml             # Workspace definition
└── package.json                    # Root package.json
```

---

## Conventions

### Code Style

- **Indentation**: 2 spaces
- **File naming**: `kebab-case` (e.g., `code-editor.tsx`, `my-component.tsx`)
- **Exports**: Named exports only (no default exports)
- **Components**: Use `forwardRef` when ref forwarding is needed

### Component Pattern

Components follow a composition pattern with sub-components:

```tsx
// Main component + sub-components in same file
export const Card = forwardRef<HTMLDivElement, CardProps>(...)
export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(...)
export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(...)
export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(...)

// Barrel export in index.ts
export { Card, CardHeader, CardTitle, CardDescription }
```

### Folder Structure for Components

When a component has sub-components, organize in a folder:

```
code-editor/
├── index.ts              # Barrel export
└── code-editor.tsx      # Component + sub-components
```

### Git Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting, no code change
- `refactor` - Code restructuring
- `test` - Adding tests
- `chore` - Maintenance

**Examples:**
```bash
git commit -m "feat: add CodeEditor component with auto-detect"
git commit -m "fix: restore CodeBlock composition pattern"
git commit -m "docs: update readme with setup instructions"
```

### Design Tokens

Design tokens are defined in `globals.css` using Tailwind CSS v4 `@theme` directive:

```css
@theme {
  /* Colors */
  --color-accent-green: #10b981;
  --color-accent-amber: #f59e0b;
  --color-accent-red: #ef4444;
  
  /* Fonts */
  --font-mono: "JetBrains Mono", monospace;
  --font-sans: "IBM Plex Mono", monospace;
  
  /* Borders */
  --color-border-primary: #1f1f1f;
  
  /* Backgrounds */
  --color-bg-page: #0c0c0c;
  --color-bg-surface: #0f0f0f;
}
```

---

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create your feature branch**
   ```bash
   git checkout -b feat/your-feature-name
   ```
3. **Make your changes** and follow the [conventions](#conventions)
4. **Run the linter**
   ```bash
   pnpm lint
   ```
5. **Commit your changes**
   ```bash
   git commit -m "feat(scope): description"
   ```
6. **Push to your branch**
   ```bash
   git push origin feat/your-feature-name
   ```
7. **Open a Pull Request**

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with 🔥 for developers who need honest feedback.

</div>
