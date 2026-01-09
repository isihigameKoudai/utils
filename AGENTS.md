# AGENTS.md

Motto: "Small, clear, safe steps — always grounded in real docs."

## Project Overview

React 19 + TypeScript project for creating reusable utilities and shared components. The `utils/` directory contains utility modules, while `src/` serves as a sandbox for testing those utilities.

## Build/Lint/Test Commands

```bash
# Development
npm run dev          # Start dev server (Vite)
npm run build        # TypeScript compile + Vite build
npm run preview      # Preview production build

# Testing with Vitest
npm run test         # Run all tests in watch mode
npx vitest run       # Run all tests once (CI mode)
npx vitest run utils/array/array.test.ts           # Run single test file
npx vitest run -t "splitMap"                       # Run tests matching pattern
npx vitest run utils/array/array.test.ts -t "配列を指定した数で分割する"  # Specific test

# Linting & Formatting
npm run lint         # ESLint with auto-fix
npm run format       # Prettier formatting
```

## Project Structure

```
utils/               # Reusable utility modules (array, file, promise, etc.)
src/
  ├── components/    # Reusable React components (domain-agnostic)
  ├── features/      # Feature-specific modules (AggregateBill, CryptoCharts)
  ├── pages/         # Page components (sandbox/examples)
  └── routes/        # TanStack Router configuration
```

### Dependency Direction (Features Architecture)

Dependencies must flow in one direction only:

```
routes/pages → features → components → utils
```

**Prohibited imports:**

- `utils/` → `src/` (utilities must not depend on application code)
- `components/` → `features/` (shared components must not depend on features)
- `components/` → `pages/` (shared components must not depend on pages)
- `components/` → `routes/` (shared components must not depend on routes)
- `features/` → `pages/` (features must not depend on pages)
- `features/` → `routes/` (features must not depend on routes)
- `features/A` → `features/B` (cross-feature imports forbidden)
- `generated/` → any (generated files are output only, not imported by app code directly except routes config)
- `utils/` → `node_modules` application-specific libs (keep utils pure)

## Code Style Guidelines

### TypeScript Configuration

- **Strict mode enabled**: `strict: true`, `noImplicitAny: true`
- **No unused code**: `noUnusedLocals: true`, `noUnusedParameters: true`
- **Path aliases**: Use `@/*` for root-relative imports (e.g., `@/utils/array`)
- **Target**: ESNext with ES module syntax

### Formatting (Prettier)

- Semicolons: required
- Quotes: single quotes
- Tab width: 2 spaces

### Import Order

1. React and core libraries
2. External dependencies
3. Internal modules using `@/` alias
4. Relative imports
5. Type imports (use `import type` when importing only types)

```typescript
import React from 'react';
import { create } from 'zustand';
import { fromEntries } from '@/utils/object';
import type { StateProps, QueriesProps } from './type';
```

### Type Imports

Always use `type` keyword when importing types/interfaces:

```typescript
// Top-level type import
import type { StateProps, QueriesProps } from './type';

// Named import with inline type
import { someFunction, type SomeType } from './module';
```

### Naming Conventions

- **Files**: camelCase for utilities (`array.ts`), PascalCase for components (`Menu.tsx`)
- **Test files**: `*.test.ts` suffix, same directory as source
- **Components**: PascalCase (`RootLayout`, `NavigationHeader`)
- **Functions**: camelCase (`splitMap`, `createCachePromise`)
- **Types/Interfaces**: PascalCase (`ListItem`, `DeferredOut`)
- **Constants**: UPPER_SNAKE_CASE for true constants

### Component Guidelines

- Functional components with hooks only (no class components)
- `src/components/` must be domain-agnostic and reusable
- Props interface above component; named exports (default for pages)

### Utility Functions

- Files ≤ 300 LOC; single-purpose modules
- Use `const` for immutability; export from `index.ts`
- Add JSDoc comments with `@example` for public APIs

### Error Handling

- Use explicit return types for functions
- Prefer returning `undefined`/`null` over throwing for expected failures
- Use type guards from `utils/guards.ts` and `utils/is.ts`
- Handle edge cases (empty arrays, undefined values) explicitly

### Testing Guidelines

- Vitest for all tests; test files alongside source (`array.ts` → `array.test.ts`)
- Cover all code paths including edge cases; target 80%+ coverage
- Use mocks/spies for external dependencies

## Principles

- Keep changes minimal, safe, and reversible
- Prefer clarity over cleverness; simplicity over complexity
- Avoid new dependencies unless necessary; remove when possible
- Implement exactly what's requested—no extra features

## Workflow

1. **Plan**: Share a short plan before major edits; prefer small, reviewable diffs
2. **Read**: Identify and read all relevant files fully before changing anything
3. **Verify**: Confirm external APIs/assumptions against docs
4. **Implement**: Keep scope tight; write modular, single-purpose files
5. **Test**: Add at least one test and verify all existing tests pass
6. **Reflect**: Fix at the root cause; consider adjacent risks

## Key Libraries

| Library         | Purpose                             |
| --------------- | ----------------------------------- |
| React 19        | Functional components with hooks    |
| TanStack Router | File-based routing (`src/routes/`)  |
| Zustand         | State management (`utils/i-state/`) |
| Vitest          | Testing framework                   |
| TensorFlow.js   | ML models for detection features    |

## Collaboration & Accountability

- Always think in English and respond in Japanese
- Escalate when requirements are ambiguous or security-sensitive
- Express uncertainty honestly (confidence < 80% → ask questions)
- Value correctness over speed; use context7 MCP server when available

## Cursor Rules (from .cursor/rules/main.mdc)

- Production code must be placed under `src/`
- Consider robustness, availability, reusability, and readability
- Use shared modules from `utils/` when possible
- Components must be reusable and domain-agnostic
- Pages have 1:1 relationship with URLs
- Tests must be unit-level, covering all branches and edge cases

## Quick Checklist

Plan → Read → Verify → Implement → Test → Reflect

- [ ] TypeScript strict mode compliance
- [ ] Tests added/updated and passing (`npm run test`)
- [ ] Lint/format pass (`npm run lint && npm run format`)
- [ ] File ≤ 300 LOC with JSDoc for public APIs
