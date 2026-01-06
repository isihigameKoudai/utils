## Coding Style
- Place production code under `src`; prefer reusable utilities from `utils`
- Keep modules ≤300 LOC per AGENTS guidance, with brief header comments for new files
- Favor clarity and simplicity; avoid new deps unless necessary
- Follow AGENTS workflow: Plan → Read → Verify → Implement → Test + Docs → Reflect

## Testing Guidelines
- Use Vitest with unit tests mirroring source hierarchy
- Cover all branches/paths; maintain ≥80% coverage targets (per main rules)
- Mock external dependencies to isolate units

## Components & Pages
- Shared components under `src/components` must be domain-agnostic
- Pages map 1:1 with routes (TanStack Router)

## Comments & Config
- Comment non-obvious logic and include brief file headers (where/what/why)
- Centralize tunables in `config.py` when relevant; avoid magic numbers