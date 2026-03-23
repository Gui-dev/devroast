# Specs Guideline

## Purpose

Specs document feature requirements and implementation details before coding.

## Format

Each spec file in `docs/specs/` should follow this structure:

```md
# [Feature Name] Feature Specification

## Context
Brief overview of the feature and its purpose.

## Feature Requirements
- [ ] Requirement 1
- [x] Completed requirement

## Implementation Status
| File | Status |
|------|--------|
| `path/to/file.ts` | ✅ Complete |

## Research Summary
### [Approach Name] (e.g., Ray.so Approach)
Key findings, alternatives analysis, pros/cons.

## Proposed Implementation
### Architecture
Diagram or component structure.

### File Structure
```
apps/web/src/
└── components/
    └── feature.tsx
```

### Component API
```typescript
interface FeatureProps {
  prop: Type;
}
```

## Reference Files
- External reference links
```

## Checklist

- [ ] Context: Why this feature is needed
- [ ] Feature Requirements: Checkbox list of requirements
- [ ] Implementation Status: Table with file paths and status
- [ ] Research Summary: Alternatives analysis with pros/cons
- [ ] Proposed Implementation: Architecture + API
- [ ] Reference Files: External links to inspiration
