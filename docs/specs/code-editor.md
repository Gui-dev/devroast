# Code Editor Feature Specification

## Context

This document outlines the technical specification for implementing the code editor component with syntax highlighting on the Devroast homepage. The editor should allow users to paste code, automatically detect the language, and provide manual language selection as a fallback.

## Feature Requirements

- [ ] User can paste code into the editor
- [ ] Code is syntax-highlighted based on detected/manual language
- [ ] Language is auto-detected from pasted code
- [ ] User can manually select language from a dropdown
- [ ] Editor has a polished UI matching our design system (Mac window style)

## Research Summary

### Ray.so Approach (Reference Implementation)

Ray.so uses a **textarea + overlay** pattern:

```
┌─────────────────────────────────┐
│ [textarea - invisible bg]       │  ← User types here
│                                 │
│                                 │
├─────────────────────────────────┤
│ [div - syntax highlighted]       │  ← Shows highlighted code
│                                 │
└─────────────────────────────────┘
```

**Key Components:**

| Component | Purpose |
|-----------|---------|
| `Editor.tsx` | Textarea with key handlers (Tab, Enter, etc.) |
| `HighlightedCode.tsx` | Renders Shiki-highlighted HTML |
| `LanguageControl.tsx` | Combobox for language selection |

**Tech Stack:**
- **Shiki** v1.0+ for syntax highlighting
- **highlight.js** only for language auto-detection (not rendering)
- **Jotai** for state management
- Custom textarea (no CodeMirror/Monaco)

**Features Ray.so implements:**
1. Tab key → insert 2 spaces
2. Shift+Tab → dedent
3. Enter → auto-indent (adds spaces based on previous line)
4. `}` auto-close
5. Escape → blur
6. Line highlighting via Alt+click

### Alternatives Analysis

| Option | Pros | Cons | Recommendation |
|--------|------|------|----------------|
| **Ray.so (Textarea + Overlay)** | Lightweight, simple, fast | Limited editing features | ✅ **Recommended** |
| **CodeMirror 6** | Full IDE features, autocomplete | Heavy (~200KB), complex setup | Consider for future |
| **Monaco Editor** | VS Code quality | Very heavy (~2MB), overkill | Not recommended |
| **Prism.js** | Simple, good themes | No language auto-detection | Use Shiki instead |
| **Highlight.js** | Auto-detection built-in | Less accurate, older syntax | Good for detection only |

### Language Detection Options

| Library | Accuracy | Size | Usage |
|---------|----------|------|-------|
| **highlight.js `highlightAuto()`** | ~70-80% | ~50KB | ✅ Ray.so uses this |
| **@vscode/vscode-languagedetection** | ~90% | ~200KB (ML model) | Alternative for higher accuracy |
| **Pattern matching (regex)** | ~60% | Tiny | Fallback only |

**Ray.so's detection logic:**
```typescript
import hljs from "highlight.js";

const detectLanguage = async (input: string) => {
  const result = hljs.highlightAuto(input, Object.keys(LANGUAGES));
  return result.language ?? "plaintext";
};
```

### Ray.so's Shiki Integration

```typescript
// Lazy loading languages
const loadedLanguages = highlighter.getLoadedLanguages();
if (!loadedLanguages.includes(lang)) {
  await highlighter.loadLanguage(langSrc);
}

// Generate HTML
highlighter.codeToHtml(code, {
  lang,
  theme: "vesper",
  transformers: [{
    line(node, line) {
      node.properties["data-line"] = line;
    }
  }]
});
```

## Proposed Implementation

### Architecture

```
┌──────────────────────────────────────────────────┐
│                    CodeEditor                      │
│  ┌────────────────────────────────────────────┐  │
│  │  CodeEditorHeader (Mac dots + lang select) │  │
│  ├────────────────────────────────────────────┤  │
│  │                                            │  │
│  │  CodeEditorContent                         │  │
│  │  ┌──────────────────────────────────────┐  │  │
│  │  │ LineNumbers │ Highlighted Code      │  │  │
│  │  │              │ (textarea overlay)    │  │  │
│  │  └──────────────────────────────────────┘  │  │
│  │                                            │  │
│  └────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

### File Structure

```
apps/web/src/components/ui/
├── code-editor.tsx          # Main editor component
├── code-editor-header.tsx   # Header with Mac dots + lang selector
├── code-editor-content.tsx  # Code area with line numbers + highlighting
├── language-selector.tsx    # Language combobox/dropdown
└── utils/
    └── detect-language.ts   # Language detection utility
```

### Component API

```typescript
// code-editor.tsx
interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  onLanguageChange?: (language: string) => void;
  showLineNumbers?: boolean;
  autoDetectLanguage?: boolean;
  placeholder?: string;
}
```

### Dependencies

| Package | Purpose | Install |
|---------|---------|---------|
| `shiki` | Syntax highlighting | Already installed |
| `highlight.js` | Language detection | `pnpm add highlight.js` |
| `@base-ui-components/react` or custom | Language selector | Already have Base UI |

### Implementation Phases

#### Phase 1: Basic Editor
- [ ] Create `CodeEditor` component with textarea
- [ ] Integrate Shiki for highlighting
- [ ] Add line numbers
- [ ] Basic styling (Mac window frame)

#### Phase 2: Language Features
- [ ] Add language selector dropdown
- [ ] Implement auto-detection with highlight.js
- [ ] Auto-detect on paste
- [ ] Manual override persists

#### Phase 3: Polish
- [ ] Tab/Enter key handling
- [ ] Auto-indent
- [ ] Line highlighting (optional)
- [ ] Keyboard shortcuts

### Open Questions

1. **Editing vs Read-only**: Should users be able to edit code, or only paste it?
   - *Ray.so allows full editing*
   - *Devroast could be paste-only for simplicity*

2. **Language Detection Trigger**: When should we auto-detect?
   - *On paste only* (simpler)
   - *On every change* (more responsive)

3. **Supported Languages**: How many languages to support?
   - *Top 10-20 most common* (JS, TS, Python, Go, Rust, etc.)
   - *Full list* (~40 languages like ray.so)

4. **State Management**: How should editor state be managed?
   - *Local state* (simple, component-level)
   - *Jotai/Zustand* (share state with analysis results)
   - *URL hash* (shareable links like ray.so)

5. **Placeholder**: Should there be a placeholder with sample code or empty?

## Reference Files

- Ray.so Editor: `app/(navigation)/(code)/components/Editor.tsx`
- Ray.so HighlightedCode: `app/(navigation)/(code)/components/HighlightedCode.tsx`
- Ray.so LanguageControl: `app/(navigation)/(code)/components/LanguageControl.tsx`
- Ray.so Languages: `app/(navigation)/(code)/util/languages.ts`
- Ray.so Store: `app/(navigation)/(code)/store/code.ts`

## Related Documentation

- [Shiki Documentation](https://shiki.matsu.io/)
- [Highlight.js Auto-detection](https://highlightjs.readthedocs.io/en/latest/api.html#highlightauto)
- [VSCode Language Detection](https://github.com/microsoft/vscode-languagedetection)
