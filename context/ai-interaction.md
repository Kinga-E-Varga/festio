# AI Interaction Guidelines

## Communication

- **Use plain, everyday language.** Short sentences, common words.
- **Be concise — few words, not dense words.** Don't compress to the point where it has to
  be read twice. An extra sentence is fine if it reads easier.
- Explain non-obvious decisions briefly.
- Ask before large refactors or architectural changes
- Don't add features not in the project spec
- Never delete files without clarification

## Archived specs — do not read unless asked

`context/features/`, `context/fixes/` (including `pending/`) and `context/plans/` are completed
work. The code is the source of truth.

- **Never read a file there on your own initiative** — only when the user names it, or the
  `feature` skill resolves a name to it.
- **Plans are stricter:** read one only when the user names it, or when the `Plan:` line in
  @context/current-feature.md Notes points to it while that feature is being built. Never
  list or search `context/plans/`.
- **Exclude these folders from every Grep and Glob.** They produce false matches.
- A match there is not evidence about current behaviour. Check the code or
  @context/project-overview.md.

@context/current-feature.md is the only spec file to consult by default.

## Reading the Next.js docs

AGENTS.md requires reading the relevant guide in `node_modules/next/dist/docs/` before
writing code. 452 files, ~3 MB — don't grep it.

**Find the guide, in this order:**

1. Check the pinned list below. It covers most Festio work.
2. Otherwise read `node_modules/next/dist/docs/index.md` (3 KB) and `01-app/index.md` (1 KB).
3. Grep the docs tree only if both come up empty.

**Prefer `01-getting-started/` (7–15 KB) over `03-api-reference/` (30–61 KB)** — same topics.
Go to the API reference only when you need an exhaustive option list.

**Read the pinned guides below directly. Send any other doc file to a subagent**, which
returns only the relevant excerpt. Also use a subagent when you need just one detail from
a pinned guide — a signature, one option, whether an API still exists.

Ignore `02-pages/` entirely. This project is App Router only.

### Pinned guides

| Topic | Path (under `node_modules/next/dist/docs/`) |
| ----- | ------------------------------------------- |
| Forms (with React Hook Form) | `01-app/02-guides/forms.md` |
| Server Actions | `01-app/02-guides/server-actions.md` |
| Fonts — `next/font/google` | `01-app/01-getting-started/13-fonts.md` |
| Images — `next/image` | `01-app/01-getting-started/12-images.md` |
| Route handlers (webhooks, uploads) | `01-app/01-getting-started/15-route-handlers.md` |
| Metadata + `noindex` headers | `01-app/01-getting-started/14-metadata-and-og-images.md` |
| Error handling | `01-app/01-getting-started/10-error-handling.md` |
| Layouts and pages | `01-app/01-getting-started/03-layouts-and-pages.md` |
| Dynamic routes (invitation slugs) | `01-app/03-api-reference/03-file-conventions/dynamic-routes.md` |

## Workflow

Workflow for every feature/fix:

1. **Document** - Document the feature in @context/current-feature.md.
2. **Plan** - Large features only, and ask before planning: write an implementation plan to `context/plans/[feature].md`. Plans are git-ignored and never committed. @context/current-feature.md stays the spec.
3. **Branch** - Create new branch for feature, fix, etc
4. **Implement** - Implement the feature/fix that I create in @context/current-feature.md
5. **Test** - Verify it works in the browser. Implement unit testing later. Run `npm run build` and fix any errors
6. **Iterate** - Iterate and change things if needed
7. **Commit** - Only after build passes and everything works. Right before committing, set **Status: Completed** in @context/current-feature.md — that line only, nothing else in the file — and delete `.superpowers/` if it exists. If the change moved a route, a top-level `src/` directory, a file in `src/lib/`, or a component between folders, update @context/repo-map.md in this same commit. Adding a template does not count.
8. **Merge** - Merge to main. Fast-forward, no merge commits — if main has moved on and a fast-forward isn't possible, rebase the branch onto main first rather than creating a merge commit.
9. **Delete Branch** - Delete the branch after the merge.
10. **Close out** - The last step, after the merge. In @context/current-feature.md: add the feature name to the top of History, then reset everything else — Status back to `Not Started`, Goals and Notes back to their empty boilerplate comments. **History is never reset; it only grows.** Leave this edit uncommitted; it rides along with the next feature's commit at step 7.

Do NOT commit without permission and until the build passes. If build fails, fix the issues first.

One feature/fix = one commit. The close-out edit above is the only change allowed to sit uncommitted between features.

## Branching

We will create a new branch for every feature/fix. Name branch **feature/[feature]** or **fix[fix]**, etc.

## Commits

- Ask before committing (don't auto-commit)
- Use conventional commit messages (feat:, fix:, chore:, etc.)
- Keep commits focused (one feature/fix per commit)
- Never put "Generated With Claude" or "Co-authored with..." in the commit messages

## When Stuck

- If something isn't working after 2-3 attempts, stop and explain the issue
- Don't keep trying random fixes
- Ask for clarification if requirements are unclear

## Code Changes

- Make minimal changes to accomplish the task
- Don't refactor unrelated code unless asked
- Don't add "nice to have" features
- Preserve existing patterns in the codebase

## Code Review

Review AI-generated code periodically, especially for:

- Security (auth checks, input validation)
- Performance (unnecessary re-renders, N+1 queries)
- Logic errors (edge cases)
- Patterns (matches existing codebase?)
