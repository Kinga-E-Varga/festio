---
name: feature
description: Manage current feature workflow - load, plan, start or complete
argument-hint: load|plan|start|complete|release
---

# Feature Workflow

Manages the full lifecycle of a feature from spec to merge.

## Working File

@context/current-feature.md

### File Structure

current-feature.md has these sections:

- `# Current Feature` - H1 heading with feature name when active
- `## Status` - Not Started | In Progress | Completed
- `## Goals` - Bullet points of what success looks like
- `## Notes` - Additional context, constraints, or details from spec

Completed features are listed in `context/history.md` (append only, newest first).

## Task

Execute the requested action: $ARGUMENTS

| Action     | Description                                      |
| ---------- | ------------------------------------------------ |
| `load`     | Load a feature spec or inline description        |
| `plan`     | Write an implementation plan (large features)    |
| `start`    | Begin implementation, create and switch branch   |
| `complete` | Simplify, commit, merge, reset, push             |
| `release`  | Move `main` up to `develop` and push (deploys)   |
| `test`     | Write and run tests for the feature (`npm test`) |

See [actions/](actions/) for detailed instructions.

If no action provided, explain the available options.
