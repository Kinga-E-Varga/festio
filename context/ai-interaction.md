# AI Interaction Guidelines

## Communication

- **Use plain, everyday language.** Short sentences, common words.
- **Be concise — few words, not dense words.** Don't compress to the point where it has to
  be read twice. An extra sentence is fine if it reads easier.
- Explain non-obvious decisions briefly.
- Ask before large refactors or architectural changes
- Don't add features not in the project spec
- Never delete files without clarification
- **Show, don't describe, when the answer is visual** — a layout, mockup, comparison of
  looks, diagram or flow. Use the superpowers visual companion (brainstorming skill,
  `visual-companion.md`), in any conversation, not only brainstorming. Offer it first in one
  short line and start it only on a yes; once it is open, use it for later visual answers
  without asking again. Everything else stays text. Mock up Festio's own UI in its fonts
  (Work Sans, Libre Baskerville) and the `@theme` colours in `src/app/globals.css`; an
  invitation in its own palette and fonts.

## Context folders — do not read unless asked

`context/features/`, `context/fixes/` (including `pending/`), `context/plans/`,
`context/reviews/`, `context/research/`, `context/handoffs/` and `context/dev-tools/` hold
extra context that isn't needed by default. The code is the source of truth.

- **Never read a file there on your own initiative** — only when the user names it, or the
  `feature` skill resolves a name to it.
- **Plans:** also read one when the `Plan:` line in @context/current-feature.md Notes points
  to it while that feature is being built. Never list or search `context/plans/`.
- **Reviews:** only the workflow agents of a cleanup run append to that day's
  `context/reviews/[date].md`.
- **Research:** an idea there is not a decision.
- **Handoffs:** never update one.
- **Exclude these folders from every Grep and Glob.** They produce false matches.
- A match there is not evidence about current behaviour. Check the code or
  @context/project-overview.md.

@context/current-feature.md is the only spec file to consult by default.

`context/history.md` lists the changes that affected the product (features, fixes,
refactors — not skills, agents, context files or dev tooling), newest first. Write to it at close out; read
it only when the user asks.

## Reading the Next.js docs

AGENTS.md requires reading the relevant guide in `node_modules/next/dist/docs/` before
writing code. 452 files, ~3 MB — don't grep it.

**Read the pinned guides below directly** — they cover most Festio work.

**For anything else, use the `next-docs` agent** (Haiku). It finds the guide and returns the
relevant part quoted word for word. Also use it when you need just one detail from a pinned
guide — a signature, one option, whether an API still exists.

### Pinned guides

| Topic                              | Path (under `node_modules/next/dist/docs/`)                     |
| ---------------------------------- | --------------------------------------------------------------- |
| Forms (with React Hook Form)       | `01-app/02-guides/forms.md`                                     |
| Server Actions                     | `01-app/02-guides/server-actions.md`                            |
| Fonts — `next/font/google`         | `01-app/01-getting-started/13-fonts.md`                         |
| Images — `next/image`              | `01-app/01-getting-started/12-images.md`                        |
| Route handlers (webhooks, uploads) | `01-app/01-getting-started/15-route-handlers.md`                |
| Metadata + `noindex` headers       | `01-app/01-getting-started/14-metadata-and-og-images.md`        |
| Error handling                     | `01-app/01-getting-started/10-error-handling.md`                |
| Layouts and pages                  | `01-app/01-getting-started/03-layouts-and-pages.md`             |
| Dynamic routes (invitation slugs)  | `01-app/03-api-reference/03-file-conventions/dynamic-routes.md` |

## Workflow and commits

Every feature/fix goes through the `feature` skill: document, branch from `develop`,
implement, test, commit, merge. **Its rules are in `.claude/skills/feature/rules.md`: read
them before branching, planning, writing tests or committing**, with or without `/feature`.
Always: ask before every commit, and never commit to `main`.

## Superpowers in Festio

The superpowers plugin is welcome, with these adjustments. They override the plugin.

- **Only when the task calls for it.** Questions, small edits and lookups need no process
  skill; brainstorming is for new features and behaviour changes.
- **Brainstorming — yes**, visual companion included. On the architectural path the spec
  goes into @context/current-feature.md (not `docs/superpowers/specs/`) and is never
  committed on its own; the plan comes from `/feature plan`, in `context/plans/`.
- **Use:** `systematic-debugging` for bugs, `verification-before-completion` before saying
  something is done or fixed, `receiving-code-review` when acting on review findings,
  `writing-plans` / `executing-plans` / `subagent-driven-development` through `/feature`.
- **`test-driven-development`** (test first, watch it fail, then the code) for the saves in
  `src/db/writes/`, plain functions in `src/lib/`, and every bug fix there: the fix starts
  with a test that shows the bug. Not for UI; that's checked in the browser. Follow the test
  guards in `.claude/skills/feature/rules.md`.
- **Skip for now:** `using-git-worktrees` (one
  branch at a time), `finishing-a-development-branch` (use `/feature complete`),
  `requesting-code-review`.
- Nothing goes under `docs/superpowers/`. `.superpowers/` is scratch, deleted before each
  feature's commit.

## When Stuck

- If something isn't working after 2-3 attempts, stop and explain the issue
- Don't keep trying random fixes
- Ask for clarification if requirements are unclear

## Code Changes

- Make minimal changes to accomplish the task
- Don't refactor unrelated code unless asked
- Don't add "nice to have" features
- Preserve existing patterns in the codebase
