# Roast OG Image Design

## Overview

Generate Open Graph images for shared roast result URLs. The image is rendered dynamically using Takumi (JSX-to-image) based on a design created in Pencil.

## Architecture

```
apps/web/src/app/roast/[id]/
├── page.tsx              # (existing) Roast detail page
└── og/
    ├── route.tsx         # GET handler → fetchRoast + ImageResponse
    └── og-image.tsx      # JSX component matching Pencil design
```

## Data Flow

1. Bot/crawler accesses `/roast/[id]`
2. `generateMetadata` references `/roast/[id]/og` as OG image URL
3. Route handler calls `fetchRoast(id)` against the API
4. Data passed to `OgImage` component
5. Takumi `ImageResponse` renders JSX → PNG 1200x630

## OG Image Layout

Based on the Pencil frame "Screen 4 - OG Image" (1200x630, dark theme).

### Structure

```
┌─────────────────────────────────────────────────────────────┐
│  #0A0A0A background, 1px border #2A2A2A                     │
│                                                             │
│  > devroast                              (logo, top)        │
│                                                             │
│              3.5 /10              (score, large)            │
│                                                             │
│          ● needs_serious_help     (verdict badge)           │
│                                                             │
│        lang: javascript · 7 lines  (meta info)              │
│                                                             │
│   "this code was written during a power outage..."          │
│   (roast quote, centered, max-width)                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Layout Properties

- Container: flex column, centered, gap 28px, padding 64px
- Dimensions: 1200x630 (standard OG size)
- Background: `#0A0A0A`
- Border: 1px `#2A2A2A`

### Typography

All text uses Geist Mono (bundled with Takumi by default).

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Logo `>` | 24px | bold | `#10B981` |
| Logo text | 20px | normal | `#FAFAFA` |
| Score number | 160px | black | dynamic (see below) |
| Score denom `/10` | 56px | normal | `#4B5563` |
| Verdict text | 20px | normal | dynamic (see below) |
| Verdict dot | 12px circle | — | dynamic (see below) |
| Lang info | 16px | normal | `#4B5563` |
| Quote | 22px | normal | `#FAFAFA`, line-height 1.5, centered |

### Dynamic Colors

**Score color:**
- `score >= 7` → `#10B981` (green)
- `score >= 4` → `#F59E0B` (amber)
- `score < 4` → `#EF4444` (red)

**Verdict color:**
- `needs_serious_help` → `#EF4444`
- `critical` → `#EF4444`
- `warning` → `#F59E0B`
- `good` → `#10B981`

## Component API

```tsx
interface OgImageProps {
  score: number
  verdict: string
  language: string
  lineCount: number
  roastQuote: string
}
```

## Route Handler

```tsx
// GET /roast/[id]/og
import { ImageResponse } from 'takumi-js/response'
import { fetchRoast } from '@/app/hooks/use-roast'
import { OgImage } from './og-image'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const roast = await fetchRoast(id)
  return new ImageResponse(<OgImage {...roast} />, { width: 1200, height: 630 })
}
```

## Error Handling

- If `fetchRoast` fails, return a 404 response with a fallback "Roast not found" OG image
- Fallback image uses the same layout but displays an error message

## Metadata Integration

Update `generateMetadata` in `page.tsx` to include OG image reference:

```tsx
openGraph: {
  images: [`/roast/${id}/og`],
}
```

## Dependencies

- `takumi-js` — new package for JSX-to-image rendering
- `@takumi-rs/core` — must be added to `serverExternalPackages` in `next.config.ts`

## File Changes Summary

| File | Action |
|------|--------|
| `apps/web/src/app/roast/[id]/og/route.tsx` | Create |
| `apps/web/src/app/roast/[id]/og/og-image.tsx` | Create |
| `apps/web/src/app/roast/[id]/page.tsx` | Modify (add OG metadata) |
| `apps/web/next.config.ts` | Modify (add serverExternalPackages) |
| `apps/web/package.json` | Modify (add takumi-js) |
