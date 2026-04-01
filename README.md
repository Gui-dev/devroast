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

## Screenshots

> [!TIP]
> Add your project screenshots here!
>
> Recommended images:
> - Homepage with code editor
> - Roast result page with score and feedback
> - Leaderboard page
> - Mobile responsive view

<!-- 
Example:
![Homepage](./docs/screenshots/homepage.png)
![Roast Result](./docs/screenshots/roast-result.png)
-->

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
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Conventions](#conventions)
- [Contributing](#contributing)
- [License](#license)

---

## About

Devroast is a code analysis tool that provides brutally honest feedback on your code. Paste any code snippet, and get an instant roast with a score based on code quality, best practices, and potential issues.

The application uses **AI-powered code analysis** via Ollama (local LLM) to generate sarcastic roasts, identify issues, and provide suggested fixes.

---

## Features

### Core Features

- **Smart Code Editor** - Paste code with automatic language detection and manual override
- **AI-Powered Analysis** - Uses Ollama (qwen2.5-coder:1.5b) for code analysis
- **Roast Modes** - Choose between "Roast" (sarcastic) or "Honest" (constructive) feedback
- **Scoring System** - Code scored 0-10 based on quality, with visual score ring
- **Issue Detection** - Identifies code issues with severity levels (critical, warning, good)
- **Suggested Fixes** - AI-generated diff suggestions to improve code
- **Leaderboard** - Rank the worst code submissions by shame score
- **Shareable URLs** - Open Graph images for sharing roasts on social media

### Technical Features

- **API Backend** - Fastify REST API with Swagger documentation
- **Database** - PostgreSQL with Drizzle ORM
- **E2E Tests** - Playwright for web, supertest for API
- **Type Safety** - Full TypeScript with Zod validation
- **Design System** - Component library with Storybook documentation

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
- **Docker** (for PostgreSQL)

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

3. **Start the database**

```bash
docker-compose up -d
```

4. **Push database schema**

```bash
pnpm --filter api db:push
```

5. **Start the development server**

```bash
pnpm dev
```

6. **Open the application**

Navigate to [http://localhost:3000](http://localhost:3000)

### Environment Variables

Create `apps/api/.env`:

```env
DATABASE_URL=postgresql://root:root@localhost:5432/devroast
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5-coder:1.5b
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm dev:web` | Start only the web app (port 3000) |
| `pnpm dev:api` | Start only the API (port 3333) |
| `pnpm build` | Build all apps for production |
| `pnpm lint` | Run Biome linting |
| `pnpm format` | Format code with Biome |
| `pnpm test` | Run all tests |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm db:studio` | Open Drizzle Studio |
| `pnpm seed` | Seed database with fake data |

---

## Architecture

### Monorepo Structure

This project uses **Turborepo** for monorepo management:

```
devroast/
├── apps/
│   ├── api/                    # Fastify REST API
│   │   └── src/
│   │       ├── routes/         # API endpoints
│   │       ├── use-cases/      # Business logic
│   │       ├── repositories/   # Data access (Drizzle + InMemory)
│   │       ├── contracts/      # Repository interfaces
│   │       ├── entities/       # Domain types
│   │       └── lib/            # Utilities (Ollama client)
│   │
│   └── web/                    # Next.js 16 application
│       └── src/
│           ├── app/            # App Router pages
│           ├── components/     # React components
│           └── lib/            # Utilities
│
├── docs/                       # Documentation
│   ├── specs/                  # Feature specifications
│   ├── plans/                  # Implementation plans
│   └── skills/                 # Agent guidelines
│
├── docker-compose.yml          # PostgreSQL database
├── turbo.json                  # Turborepo config
└── biome.json                  # Biome linting config
```

### API Architecture (Hexagonal)

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

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/roasts` | Create a new roast |
| GET | `/roasts` | List all roasts |
| GET | `/roasts/:id` | Get roast by ID |
| GET | `/metrics` | Get global metrics |
| GET | `/leaderboard` | Get full leaderboard |
| GET | `/leaderboard/worst` | Get top 3 worst roasts |

---

## Tech Stack

### Core

| Technology | Version | Purpose |
|------------|---------|---------|
| [Next.js](https://nextjs.org/) | 16.x | React framework |
| [React](https://react.dev/) | 19.x | UI library |
| [Fastify](https://fastify.dev/) | 5.x | REST API framework |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | v4 | Styling |
| [Biome](https://biomejs.dev/) | 1.9+ | Linting & formatting |

### Backend

| Technology | Purpose |
|------------|---------|
| [Drizzle ORM](https://orm.drizzle.team/) | PostgreSQL ORM |
| [Zod](https://zod.dev/) | Input validation |
| [Vercel AI SDK](https://sdk.vercel.ai/) | Ollama integration |
| [Supertest](https://github.com/ladjs/superagent) | API E2E testing |

### Frontend

| Technology | Purpose |
|------------|---------|
| [TanStack Query](https://tanstack.com/query) | Server state management |
| [Shiki](https://shiki.matsu.io/) | Syntax highlighting |
| [highlight.js](https://highlightjs.org/) | Language auto-detection |
| [Playwright](https://playwright.dev/) | E2E testing |
| [MSW](https://mswjs.io/) | API mocking for tests |
| [Storybook](https://storybook.js.org/) | Component documentation |

### Tooling

| Tool | Purpose |
|------|---------|
| [Turborepo](https://turbo.build/) | Monorepo orchestration |
| [PNPM](https://pnpm.io/) | Package management |
| [Vitest](https://vitest.dev/) | Unit testing |
| [Docker](https://docker.com/) | Containerization |

---

## Testing

### Test Strategy

- **Unit Tests** - Use in-memory repositories for isolated testing
- **API E2E Tests** - Use supertest with in-memory implementations
- **Web E2E Tests** - Use Playwright with MSW for API mocking

### Running Tests

```bash
# Run all tests
pnpm test

# Run API tests
pnpm --filter api test

# Run web tests
pnpm --filter web test

# Run specific test file
pnpm vitest run path/to/test.test.ts
```

### Test Coverage

| Type | Location | Framework |
|------|----------|-----------|
| Unit Tests | `src/**/*.test.ts` | Vitest |
| API E2E | `src/routes/*.e2e.test.ts` | supertest + Vitest |
| Web E2E | `test/e2e/*.spec.ts` | Playwright |

---

## Project Structure

```
devroast/
├── apps/
│   ├── api/
│   │   └── src/
│   │       ├── app.ts                    # Fastify app builder
│   │       ├── index.ts                  # API entry point
│   │       ├── db/                       # Drizzle config & schema
│   │       ├── routes/                   # API endpoints
│   │       │   ├── health.routes.ts
│   │       │   ├── roast.routes.ts
│   │       │   ├── metrics.routes.ts
│   │       │   ├── leaderboard.routes.ts
│   │       │   ├── schemas.ts             # Zod schemas
│   │       │   └── *.e2e.test.ts         # E2E tests
│   │       ├── use-cases/                # Business logic
│   │       ├── repositories/             # Data access
│   │       │   └── in-memory/            # In-memory for tests
│   │       ├── contracts/                # Repository interfaces
│   │       ├── entities/                 # Domain types
│   │       ├── lib/                      # Utilities
│   │       │   └── ollama-client.ts      # AI client
│   │       └── test/                     # Test helpers & mocks
│   │
│   └── web/
│       └── src/
│           ├── app/                      # Next.js App Router
│           │   ├── page.tsx              # Homepage
│           │   ├── layout.tsx            # Root layout
│           │   ├── globals.css           # Design tokens
│           │   └── roast/
│           │       └── [id]/             # Roast detail page
│           │
│           ├── components/               # React components
│           │   ├── ui/                   # Design system
│           │   ├── code-editor/          # Editor with highlighting
│           │   ├── code-block/           # Static code display
│           │   ├── metrics-card.tsx      # Animated metrics
│           │   ├── msw-provider.tsx      # Test mocking
│           │   └── providers.tsx         # Query client provider
│           │
│           └── lib/                      # Utilities
│               ├── cn.ts                 # Class merge utility
│               ├── detect-language.ts    # Language detection
│               └── query-client.ts       # TanStack Query setup
│
├── docs/
│   ├── specs/                            # Feature specs
│   │   └── *.md
│   ├── plans/                           # Implementation plans
│   │   └── *.md
│   └── skills/                          # Agent guidelines
│       └── commits-guideline.md
│
├── test/
│   ├── e2e/                             # Web E2E tests
│   │   ├── *.spec.ts
│   │   └── mocks/                       # MSW handlers
│   └── playwright.config.ts
│
├── docker-compose.yml                    # PostgreSQL
├── turbo.json                            # Turborepo
├── biome.json                            # Biome config
└── package.json                         # Root package
```

---

## Conventions

### Code Style

- **Indentation**: 2 spaces
- **File naming**: `kebab-case` (e.g., `code-editor.tsx`, `my-component.tsx`)
- **Exports**: Named exports only (no default exports)
- **Components**: Use `forwardRef` when ref forwarding is needed

### API Development

- **Validation**: Always use Zod schemas in routes
- **Error Handling**: Use Fastify's built-in error handling
- **Testing**: Use in-memory repositories for isolated tests

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
5. **Run tests**
   ```bash
   pnpm test
   ```
6. **Commit your changes**
   ```bash
   git commit -m "feat(scope): description"
   ```
7. **Push to your branch**
   ```bash
   git push origin feat/your-feature-name
   ```
8. **Open a Pull Request**

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with 🔥 for developers who need honest feedback.

</div>