---
name: research
description: Deep codebase research skill. Thoroughly reads and understands a target area of the codebase, then produces a detailed research.md artifact documenting all findings, patterns, dependencies, and edge cases before any planning or implementation begins.
---

# Research - Deep Codebase Investigation

A systematic skill for deeply understanding a target area of the codebase before any planning or implementation. Produces a persistent `research.md` artifact that serves as the verified foundation for all downstream work.

## Core Principle

**Never skim. Read deeply, understand fully, document everything.**

Surface-level reading leads to implementations that work in isolation but break the surrounding system — functions that ignore existing caching layers, migrations that don't account for ORM conventions, endpoints that duplicate existing logic. This skill prevents all of that.

## When to Use

- Before planning a new feature that touches existing systems
- Before refactoring or modifying an unfamiliar module
- When debugging a complex issue that spans multiple files
- When onboarding to a new area of the codebase
- When investigating potential bugs in a system

## Workflow

```
flowchart LR
    T[Receive target area] --> R[Deep read all relevant files]
    R --> U[Understand patterns & dependencies]
    U --> D[Document findings in research.md]
    D --> V[Self-verify completeness]
```

## Output Location

All research artifacts MUST be saved to **`doc/plans/`** directory.

- `doc/plans/research.md` — default output path
- If multiple research tasks exist, use descriptive names: `doc/plans/research-<topic>.md`
- NEVER save to project root or other directories

## How to Conduct Research

### Step 1: Identify the Target Area

Determine the scope of investigation:

- A specific folder or module
- A specific feature or flow (e.g., "the notification system")
- A specific concern (e.g., "find all bugs in task scheduling")

### Step 2: Deep Read

Read **every relevant file** in the target area. For each file:

- Understand not just what functions do at the signature level, but **how** they work internally
- Trace data flow through the entire pipeline
- Identify all callers and callees
- Note patterns, conventions, and idioms used
- Look for implicit assumptions and constraints

**Key reading strategies:**

- Follow the dependency chain both up (who calls this?) and down (what does this call?)
- Read tests to understand expected behavior and edge cases
- Check configuration files for hidden behaviors
- Look at type definitions to understand data shapes
- Read error handling to understand failure modes

### Step 3: Document in research.md

Write a comprehensive `research.md` in **`doc/plans/`** covering:

```markdown
# Research: [Target Area]

## Overview

Brief summary of what the target area does and its role in the system.

## Architecture

- Module structure and organization
- Key abstractions and their relationships
- Data flow diagrams (text-based)

## Key Files & Components

For each significant file:

- **Purpose**: What it does
- **Key functions/classes**: Signature + behavior summary
- **Dependencies**: What it imports/uses
- **Consumers**: What depends on it

## Patterns & Conventions

- Naming conventions used
- Error handling approach
- State management patterns
- API design patterns
- Testing patterns

## Data Flow

Step-by-step trace of how data moves through the system for key operations.

## Dependencies

- Internal dependencies (other modules in this codebase)
- External dependencies (npm packages, APIs)
- Implicit dependencies (environment variables, config files)

## Edge Cases & Gotchas

- Known limitations
- Implicit assumptions in the code
- Potential race conditions or timing issues
- Error scenarios and how they're handled

## Potential Issues (if investigating bugs)

- Specific bugs found with file/line references
- Conditions that trigger the bugs
- Root cause analysis
- Suggested fixes (without implementing)

## Open Questions

Things that remain unclear after research, requiring clarification.
```

### Step 4: Self-Verify

Before marking research complete:

- [ ] Every file in the target area has been read (not skimmed)
- [ ] All dependencies traced in both directions
- [ ] Data flow documented for key operations
- [ ] Edge cases and error paths identified
- [ ] Patterns and conventions noted for plan conformance
- [ ] No assumptions left unverified

## Research Intensity Signals

Match your research depth to the language used:

| Signal Words                               | Research Depth                                               |
| ------------------------------------------ | ------------------------------------------------------------ |
| "look at", "check"                         | Standard read - understand the module                        |
| "understand", "study"                      | Deep read - trace all paths                                  |
| "deeply", "in great detail", "intricacies" | Exhaustive - read every line, trace every dependency         |
| "find all bugs", "don't stop until"        | Investigative - actively look for issues, verify assumptions |

## Output Requirements

### The research.md artifact MUST:

- Be a **standalone document** — someone reading only this file should fully understand the target area
- Include **specific file paths** and **function/class names** with descriptions
- Contain **code snippets** for non-obvious patterns or behaviors
- Note **conventions** that the planning phase must follow
- List **constraints** that implementations must respect
- Be written in the **same language as the user's request** (Japanese if user writes in Japanese)

### The research.md MUST NOT:

- Include implementation suggestions (that's the planning phase)
- Skip over "boring" files — infrastructure and config matter
- Assume the reader has prior context
- Be a list of file names without content descriptions

## Anti-Patterns

| Bad                                   | Good                                          |
| ------------------------------------- | --------------------------------------------- |
| Reading only function signatures      | Reading full function bodies                  |
| Listing files without describing them | Explaining what each file does and why        |
| Ignoring test files                   | Reading tests to understand expected behavior |
| Missing error handling flows          | Documenting all error paths                   |
| Stopping at the first layer           | Tracing through 3+ layers of abstraction      |
| Verbal summary in chat only           | Persistent research.md document               |

## Example Prompts

### Feature Investigation

```
/research

Read the notification system in great detail. Understand deeply how notifications
are created, queued, sent, and tracked. Document all findings in research.md.
```

### Bug Investigation

```
/research

Go through the task scheduling flow. Understand it deeply and look for potential bugs.
The system sometimes runs tasks that should have been cancelled. Keep researching until
you find all the bugs. Write a detailed report in research.md.
```

### Module Understanding

```
/research

Read the utils/i-state/ folder in depth. Understand how it works deeply, what it does
and all its specificities. Write a detailed report in research.md.
```

## Integration with Other Skills

This skill is Phase 1 of the Boris Tane workflow:

```
Research (this skill) → Plan → Implement
```

The `research.md` output becomes the input context for the `plan` skill. Never skip research — a wrong plan built on wrong understanding wastes more time than thorough research ever costs.

## Limitations

- Research is read-only — no code changes should be made during this phase
- Large codebases may require scoping to specific modules
- External API behaviors may need separate documentation lookup
- Research.md should be treated as a snapshot — it may become stale if the codebase changes significantly
