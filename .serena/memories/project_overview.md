## Purpose
React/TypeScript utility playground that bundles various UI demos and feature modules (e.g., AggregateBill) for internal tooling and experiments.

## Tech Stack
- React 19 (Vite build)
- TypeScript
- Zustand-like custom store via `utils/i-state`
- Styling via typestyle-based `styled`

## Structure Highlights
- `src/features/*`: domain feature modules such as AggregateBill or CryptoCharts
- `src/components/*`: shared UI components
- `utils/*`: reusable utilities (file handling, math, guards, etc.) with Vitest tests alongside.
- `routes/` + `pages/`: TanStack Router pages matching URL structure

## Tooling
- Vite dev server (`npm run dev`)
- Vitest for unit tests (`npm run test`)
- ESLint + Prettier (`npm run lint`, `npm run format`)

## Notes
- Follow feature-specific constants/types per module
- Utilities are often split between `src` (app) and top-level `utils` package