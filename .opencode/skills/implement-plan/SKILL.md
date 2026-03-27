---
name: implement-plan
description: Execution skill that implements an approved plan.md end-to-end. Marks todo items as completed, maintains strict typing, runs typechecks continuously, and does not stop until all phases are done. Implementation should be mechanical, not creative — all decisions were made in the planning phase.
---

# Implement Plan - Disciplined Execution from plan.md

A focused execution skill that takes an approved `plan.md` and implements every task in it without stopping. Progress is tracked by marking todo items as completed in the plan document. The implementation is mechanical — all creative and architectural decisions were made during the planning phase.

## Core Principle

**Implementation should be boring.** The creative work happened in the research and planning phases. By the time this skill is invoked, every decision has been made and validated. Execution should be straightforward.

## When to Use

- After `plan.md` has been reviewed, annotated, and approved by the user
- The plan contains a detailed todo list with phased, atomic tasks
- All architectural decisions and trade-offs have been resolved

## Artifact Location

All plan and research artifacts are stored in **`doc/plans/`** directory.

- `doc/plans/plan.md` — the implementation specification
- `doc/plans/research.md` — the research context (if exists)

## Prerequisites

Before starting implementation:

- [ ] `doc/plans/plan.md` exists with an approved implementation plan
- [ ] The plan contains a todo list with checkable items
- [ ] The user has explicitly said to implement (e.g., "implement it all")
- [ ] No unresolved notes or open questions remain in the plan

## The Implementation Command

The standard implementation prompt encodes everything that matters:

```
Implement it all. When you're done with a task or phase, mark it as completed
in the plan document. Do not stop until all tasks and phases are completed.
Do not add unnecessary comments or jsdocs. Do not use any or unknown types.
Continuously run typecheck to make sure you're not introducing new issues.
```

### What Each Part Means

| Directive                                              | Purpose                                      |
| ------------------------------------------------------ | -------------------------------------------- |
| "implement it all"                                     | Do everything in the plan, don't cherry-pick |
| "mark it as completed in the plan document"            | plan.md is the source of truth for progress  |
| "do not stop until all tasks and phases are completed" | Don't pause for confirmation mid-flow        |
| "do not add unnecessary comments or jsdocs"            | Keep code clean — no noise                   |
| "do not use any or unknown types"                      | Maintain strict typing                       |
| "continuously run typecheck"                           | Catch problems early, not at the end         |

## Execution Workflow

```
flowchart LR
    R[Read plan.md] --> T[Start first todo item]
    T --> I[Implement the task]
    I --> C[Run typecheck]
    C --> M[Mark todo as completed in plan.md]
    M --> N{More tasks?}
    N -->|Yes| T
    N -->|No| D[Done - all phases complete]
```

### Step-by-Step Process

1. **Read plan.md** — understand the full scope and all phases
2. **Start with Phase 1, Task 1** — follow the order defined in the plan
3. **Implement the task** exactly as specified in the plan:
   - Use the code snippets from the plan as the starting point
   - Follow the file paths specified in the plan
   - Respect all constraints and conventions noted in the plan
4. **Run typecheck** after each significant change
5. **Mark the task as completed** in plan.md: `- [ ]` → `- [x]`
6. **Move to the next task** — do not pause for confirmation
7. **Repeat** until all phases and tasks are done

## Progress Tracking

### Marking Completion in plan.md

After completing each task, update the plan document:

```markdown
## Todo List

### Phase 1: Database Schema

- [x] Create migration file for users table
- [x] Add index on email column
- [ ] Create migration file for posts table <-- currently working on this

### Phase 2: API Endpoints

- [ ] Add POST /api/users endpoint
- [ ] Add GET /api/users/:id endpoint
```

This allows the user to glance at plan.md at any point and see exactly where things stand.

### Why This Matters

- Long implementation sessions can run for hours
- The user may step away and return
- Marking progress in the persistent document survives context window compaction
- It provides accountability — every task is explicitly done or not done

## Code Quality Standards

### MUST DO

- Follow existing codebase patterns and conventions
- Use proper TypeScript types — no `any`, no `unknown` as escape hatches
- Run typecheck after each task to catch issues early
- Follow the import order conventions of the project
- Match naming conventions (camelCase for functions, PascalCase for components, etc.)
- Handle error cases as specified in the plan
- Keep files under the project's LOC limit (300 LOC per AGENTS.md)

### MUST NOT DO

- Add unnecessary comments or JSDoc (unless the plan explicitly calls for them)
- Use `as any`, `@ts-ignore`, or `@ts-expect-error`
- Skip tasks or phases without explicit user approval
- Deviate from the plan's approach without raising it first
- Add features not in the plan (no scope creep)
- Leave empty catch blocks `catch(e) {}`
- Introduce new dependencies not specified in the plan

## Handling Issues During Implementation

### Type Errors

1. Fix them immediately — do not accumulate
2. Run typecheck to verify the fix
3. If the fix requires changing the plan's approach, **stop and inform the user**

### Unexpected Complexity

If a task turns out to be more complex than the plan anticipated:

1. Implement what's possible following the plan
2. Note the deviation in the plan document
3. Continue with remaining tasks
4. Inform the user of the deviation at the end

### Conflicts with Existing Code

If the plan's approach conflicts with existing code not covered in research:

1. **Stop** — do not force the implementation
2. Note the conflict in the plan document
3. Inform the user and ask for guidance
4. Continue with non-conflicting tasks if possible

## User Feedback During Implementation

Once implementation begins, the user's role shifts from architect to supervisor. Their feedback will be terse:

### Types of Feedback

| Feedback                                    | Action                                  |
| ------------------------------------------- | --------------------------------------- |
| "You didn't implement X"                    | Go back and implement the missing piece |
| "Move this to the correct location"         | Relocate as directed                    |
| "wider" / "still cropped" / "2px gap"       | Make the exact visual adjustment        |
| "This should look exactly like [reference]" | Read the reference and match it         |
| "I reverted everything. Now just do X"      | Start fresh with narrowed scope         |

### Responding to Feedback

- Keep responses minimal — the user doesn't want explanations
- Make the fix and move on
- If a screenshot is provided, address the exact visual issue shown
- Reference existing code when the user points to it as a model

## Verification

### After Each Task

- Run `typecheck` (e.g., `npx tsc --noEmit`, `npm run typecheck`)
- Verify no new TypeScript errors introduced

### After Each Phase

- Run the full test suite if tests exist
- Run linting if configured
- Verify the phase's functionality works end-to-end

### After All Phases Complete

- Run full typecheck
- Run full test suite
- Run linting and formatting
- Verify all todo items in plan.md are marked `[x]`
- Inform the user that implementation is complete

## Example Prompts

### Start Implementation

```
/implement-plan

Implement the plan in plan.md. Mark tasks as completed as you go.
Don't stop until everything is done. Run typecheck continuously.
```

### Resume After Interruption

```
/implement-plan

Continue implementing plan.md from where you left off.
Check which tasks are already marked complete and start from the next one.
```

### Implementation with Extra Constraints

```
/implement-plan

Implement plan.md. Additional constraints:
- Run tests after each phase
- Keep all existing API signatures unchanged
- Use the existing error handling patterns from src/shared/errors.ts
```

## Integration with Other Skills

This skill is Phase 3 of the Boris Tane workflow:

```
Research → Plan → Implement (this skill)
```

- **Input**: Approved `doc/plans/plan.md` with todo checklist from the plan skill
- **Context**: `doc/plans/research.md` from the research skill (referenced in plan)
- **Output**: Fully implemented feature with all todos marked complete

## Revert and Retry

If implementation goes in a wrong direction:

1. **User reverts** the git changes
2. **User narrows scope** (e.g., "I reverted everything. Now all I want is to make the list view more minimal — nothing else.")
3. **Agent re-reads plan.md** and implements with the narrowed scope
4. Narrowing scope after a revert almost always produces better results than trying to incrementally fix a bad approach

## Anti-Patterns

| Bad                                         | Good                                          |
| ------------------------------------------- | --------------------------------------------- |
| Cherry-picking tasks from the plan          | Implementing all tasks in order               |
| Pausing for confirmation mid-flow           | Running continuously until all tasks done     |
| Adding features not in the plan             | Sticking to the plan's scope                  |
| Accumulating type errors                    | Fixing each error immediately                 |
| Forgetting to mark tasks complete           | Updating plan.md after each task              |
| Adding `as any` to fix type issues          | Writing proper types                          |
| Explaining every change                     | Making changes silently, letting code speak   |
| Implementing without reading the plan first | Reading the full plan before writing any code |

## Limitations

- Requires an approved plan.md with todo checklist
- Cannot make architectural decisions — those belong in the planning phase
- May need to stop and consult user if unexpected conflicts arise
- Visual/frontend changes may need iterative feedback cycles
- Long implementations may hit context window limits (plan.md survives compaction)
