---
name: plan
description: Implementation planning skill. Creates a detailed plan.md with approach, code snippets, file paths, and trade-offs. Supports iterative annotation cycles where the user adds inline notes and the agent refines the plan. Generates a granular todo checklist before implementation.
---

# Plan - Implementation Planning with Annotation Cycles

A disciplined planning skill that produces a detailed `plan.md` artifact before any code is written. Supports iterative refinement through annotation cycles where the user adds inline notes directly into the document, and the agent updates the plan accordingly.

## Core Principle

**Never let code be written until the plan is reviewed and approved.** The separation of planning and execution prevents wasted effort, keeps the user in control of architecture decisions, and produces significantly better results than jumping straight to code.

## When to Use

- After completing research (research.md exists) and before implementation
- When building a new feature that extends existing systems
- When making significant changes to existing functionality
- When the implementation approach has multiple viable options
- When domain knowledge, business constraints, or trade-offs need to be captured

## Workflow

```
flowchart TD
    W[Agent writes plan.md] --> R[User reviews in editor]
    R --> N[User adds inline notes]
    N --> S[User sends agent back to document]
    S --> U[Agent updates plan]
    U --> D{User satisfied?}
    D -->|No| R
    D -->|Yes| T[Agent adds todo list to plan]
```

The annotation cycle repeats **1 to 6 times** until the user is satisfied.

## Output Location

All plan artifacts MUST be saved to **`doc/plans/`** directory.

- `doc/plans/plan.md` — default output path
- If multiple plans exist, use descriptive names: `doc/plans/plan-<feature>.md`
- NEVER save to project root or other directories

## How to Create a Plan

### Step 1: Gather Context

Before writing the plan:

- Read the `doc/plans/research.md` if it exists (output from the research skill)
- Read all source files that will be modified
- Understand existing patterns and conventions
- If the user provides a reference implementation, study it thoroughly

### Step 2: Write plan.md

Create a comprehensive `plan.md` in **`doc/plans/`**:

````markdown
# Plan: [Feature/Change Name]

## Goal

One-paragraph description of what we're building and why.

## Approach

Detailed explanation of the implementation strategy.

- Why this approach over alternatives
- Key design decisions and their rationale
- How this fits into the existing architecture

## Changes

### [Area/Module 1]

**Files modified:** `path/to/file1.ts`, `path/to/file2.ts`
**Files created:** `path/to/new-file.ts`

[Explanation of what changes and why]

```typescript
// Code snippet showing the actual change
export function newFunction(params: Params): Result {
  // implementation details
}
```
````

### [Area/Module 2]

**Files modified:** `path/to/file3.ts`

[Explanation of what changes and why]

```typescript
// Code snippet showing the actual change
```

## Data Flow

Step-by-step description of how data moves through the new/changed system.

## Migration / Compatibility

- Breaking changes (if any)
- Migration steps needed
- Backward compatibility considerations

## Trade-offs & Considerations

- What we're optimizing for and what we're trading away
- Performance implications
- Security considerations
- Future extensibility

## Out of Scope

Explicitly list what this plan does NOT cover to prevent scope creep.

## Todo List

<!-- Added after annotation cycles are complete -->

````

### Step 3: Plan Quality Checklist

Before presenting the plan, verify:
- [ ] Approach is grounded in the actual codebase (not generic)
- [ ] All code snippets reference real file paths and existing patterns
- [ ] Trade-offs are explicitly stated
- [ ] Scope boundaries are clear
- [ ] No assumptions left unstated

## The Annotation Cycle

This is the most critical part of the planning process.

### How It Works

1. **Agent writes plan.md** with the initial implementation proposal
2. **User opens plan.md in their editor** and adds inline notes directly in the document
3. **User tells the agent** to address the notes (e.g., "I added notes to the plan, address them all and update the document")
4. **Agent reads the annotated plan**, addresses every note, and rewrites the relevant sections
5. **Repeat** until the user is satisfied

### Handling User Notes

When the user says they've added notes to the plan:

1. **Re-read plan.md completely** — do not rely on cached content
2. **Find all inline notes** — they may be marked with `<!-- NOTE: -->`, `> NOTE:`, `**NOTE:**`, or just be obvious additions/comments
3. **Address every single note** — do not skip any
4. **Update the plan in place** — rewrite sections as needed
5. **Remove the notes** after addressing them (replace with the updated content)
6. **Do NOT implement anything** — only update the document

### Types of User Notes

| Note Type | Example | How to Handle |
|-----------|---------|---------------|
| Domain knowledge | "use drizzle:generate for migrations, not raw SQL" | Update the plan to use the correct approach |
| Correction | "no — this should be a PATCH, not a PUT" | Fix the incorrect assumption |
| Rejection | "remove this section entirely, we don't need caching here" | Delete the section and adjust dependent sections |
| Explanation | "the queue consumer already handles retries, so this retry logic is redundant" | Remove redundant logic, note existing handling |
| Redirection | "visibility should be on the list, not on items" | Restructure the affected sections |
| Scope trim | "remove the download feature from the plan" | Remove it and adjust scope description |
| Technical override | "use this library's built-in method instead" | Replace the custom implementation with the library call |

### Critical Guard: "Don't Implement Yet"

During annotation cycles, the agent MUST NOT write any code. If tempted to implement:
- **Stop.** The plan is not approved yet.
- Only update the plan.md document.
- Wait for explicit implementation approval from the user.

## Adding the Todo List

When the user is satisfied with the plan and requests a todo list:

### Add to the bottom of plan.md:

```markdown
## Todo List

### Phase 1: [Phase Name]
- [ ] Task 1: [Specific, actionable description]
- [ ] Task 2: [Specific, actionable description]
- [ ] Task 3: [Specific, actionable description]

### Phase 2: [Phase Name]
- [ ] Task 4: [Specific, actionable description]
- [ ] Task 5: [Specific, actionable description]

### Phase 3: [Phase Name]
- [ ] Task 6: [Specific, actionable description]
- [ ] Task 7: [Specific, actionable description]
````

### Todo Quality Requirements

Each todo item MUST be:

- **Atomic**: One specific action, not a vague category
- **Ordered**: Dependencies between items are respected
- **Phased**: Grouped into logical phases
- **Checkable**: Can be definitively marked done or not done

### Todo Anti-Patterns

| Bad                   | Good                                                                                          |
| --------------------- | --------------------------------------------------------------------------------------------- |
| "Set up the database" | "Create migration file for users table with columns: id, email, name, created_at"             |
| "Add API endpoints"   | "Add POST /api/users endpoint with input validation and error handling"                       |
| "Write tests"         | "Add unit tests for createUser function covering: happy path, duplicate email, invalid input" |
| "Update frontend"     | "Add UserForm component to src/features/Users/components/ with name and email fields"         |

## Using Reference Implementations

When the user provides reference code from another project:

1. **Study the reference thoroughly** — understand its patterns, not just surface syntax
2. **Adapt, don't copy** — the plan should describe how to adopt a similar approach within the existing codebase conventions
3. **Note differences** — call out where the reference approach differs from what's appropriate here
4. **Include adapted code snippets** — show how the reference patterns map to the current project

## Scope Management

### During Planning

- If the user adds scope, incorporate it naturally
- If the plan grows too large, suggest splitting into multiple plans
- Always maintain an "Out of Scope" section

### User Scope Controls

The user may:

- **Cherry-pick**: "For the first one, use Promise.all; ignore the fourth and fifth ones"
- **Trim scope**: "Remove the download feature from the plan"
- **Protect interfaces**: "The signatures of these three functions should not change"
- **Override choices**: "Use this model instead of that one"

Always comply with these directives immediately.

## Example Prompts

### New Feature

```
/plan

I want to build a sortable ID system that generates time-ordered unique IDs.
Write a detailed plan.md for how to implement this.
Read source files before suggesting changes.
```

### With Reference Implementation

```
/plan

I want to add cursor-based pagination to our list endpoints.
Here's how [reference project] does it: [paste code].
Write a plan.md explaining how we can adopt a similar approach.
```

### Annotation Cycle

```
I added a few notes to the document.
Address all the notes and update the document accordingly.
Don't implement yet.
```

### Request Todo List

```
Add a detailed todo list to the plan, with all the phases and
individual tasks necessary to complete the plan. Don't implement yet.
```

## Integration with Other Skills

This skill is Phase 2 of the Boris Tane workflow:

```
Research → Plan (this skill) → Implement
```

- **Input**: `research.md` from the research skill (optional but recommended)
- **Output**: `plan.md` with approved implementation plan and todo checklist
- The `implement-plan` skill uses `plan.md` as its execution specification

## Limitations

- Plans are proposals — they require human review and annotation
- Code snippets in plans are illustrative, not final implementations
- Plans may need updating if new information emerges during implementation
- Complex features may need multiple plan iterations before being ready
- The annotation cycle requires the user's active participation

## Anti-Patterns

| Bad                                   | Good                                               |
| ------------------------------------- | -------------------------------------------------- |
| Generic plan not grounded in codebase | Plan references actual files and existing patterns |
| Implementing during annotation cycle  | Only updating the document, waiting for approval   |
| Ignoring user notes                   | Addressing every single note thoroughly            |
| Vague todo items                      | Atomic, specific, ordered tasks                    |
| Assuming scope                        | Maintaining explicit "Out of Scope" section        |
| One-shot plan (no iteration)          | Supporting 1-6 annotation cycles                   |
