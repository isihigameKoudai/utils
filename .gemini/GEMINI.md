@../doc/AGENT.md

# Claude Project Configuration

This is a React TypeScript project focused on creating reusable utilities and common functions, and then you can try to use some utilities on sandbox.

## Project Overview
- **Purpose**: Creating reusable utilities and shared components for cross-project use
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Testing**: Vitest

## Key Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production (includes TypeScript compilation)
- `npm run test` - Run tests with Vitest
- `npm run preview` - Preview production build

## Project Structure
- `utils/` - Utility modules.
- `src/` - Sandbox of utils directories & files.
  - `components/` - Reusable React components
  - `features/` - Feature-specific modules (AggregateBill, CryptoCharts)
  - `routes/` - Router configuration

## Code Conventions
- Use TypeScript for all new code
- Components follow the container/presentational pattern where applicable
- Utilities are organized by domain (array, file, promise, etc.)
- Test files use `.test.ts` extension
- Prefer functional components with hooks

## Development Guidelines
- Always run TypeScript compilation before building
- Test coverage is important - add tests for new utilities
- Follow existing file organization patterns
- Use provided utility functions where possible
