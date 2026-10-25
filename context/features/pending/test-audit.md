# Test audit

A way to check, whenever wanted (e.g. monthly, before launch), that the tests really catch
mistakes, without the user clicking through the app and without trusting the agent that
wrote them. Builds on the regression tests (`context/features/pending/quality-checks.md`,
item 1, done), and is worth most once a few features have been built with the test guards
(`.claude/skills/feature/rules.md`).

| Part                | What it finds                                      | Bias                          | Cost                          |
| ------------------- | -------------------------------------------------- | ----------------------------- | ----------------------------- |
| 1. Coverage report  | Lines no test ever runs                            | None: a program               | Seconds, no tokens            |
| 2. Mutation testing | Bugs the tests would let through                   | None: a program               | Minutes of computer time      |
| 3. Audit agent      | Rules in the spec that no test checks, and bugs    | Low: reads the spec first     | Tokens, one agent run         |

All three run only on what the tests can reach: the saves in `src/db/writes/` and plain
functions in `src/lib/`. Pages and UI are not in scope (they're checked in the browser and
by `quality-checks.md`'s UX walk-through). Everything runs on the test emulator, never a real
project.

## To do

Load one at a time (`/feature load`), each on its own branch, in this order: 4 runs the
other three.

**When one is finished** (at `/feature complete`), mark it here: change its `To do` to
`Done (<commit message>)`, so this list never needs rechecking against the code.

1. **To do — coverage report** (`chore/test-coverage`).
   - Vitest's coverage (`@vitest/coverage-v8`, the version matching Vitest), limited to
     `src/db/writes/` and `src/lib/`. One npm script, e.g. `npm run test:coverage`, through
     the same test emulator as `npm test`.
   - A plain report: each file's share of lines and branches run, and which lines never
     ran. Saved to a git-ignored folder, not committed.
   - No minimum to pass for now: it's a map, not a gate. A line that runs is not
     necessarily checked; that's what part 2 is for.

2. **To do — mutation testing** (`chore/mutation-testing`).
   - **Stryker** (`@stryker-mutator/core` with its Vitest runner); check it supports the
     project's Vitest version first. It changes the code in small ways, one at a time
     (`>=` → `>`, a `+ 1` removed, a check deleted), and runs the tests after each.
     - **Killed:** a test failed, so the tests catch that mistake.
     - **Survived:** every test still passed, so a real bug like it would reach users.
   - Limited to `src/db/writes/` and `src/lib/`; only the tests that touch a changed file
     run, to keep it to minutes. One npm script, e.g. `npm run test:mutation`, on the test
     emulator.
   - The report lists each survivor in plain words: file, line, what was changed. Saved to
     a git-ignored folder.
   - **First run:** expect survivors. Each one is either a missing test (written as its own
     `fix/` or `chore/`, test-first) or a change that makes no real difference (marked as
     accepted in Stryker's config, with a one-line reason, so it doesn't come back).
   - A score to keep above can come later, once the first survivors are sorted.

3. **To do — audit agent** (`chore/test-audit-agent`).
   - A Claude agent (`.claude/agents/`) that checks the tests against the spec. To keep it
     from simply agreeing with the tests, it works in a fixed order:
     1. **Reads only the spec** (`context/project-overview.md`,
        `context/features/pending/database.md`, and the specs of features built since) and
        writes down every rule that should be tested, before it opens any test.
     2. **Reads the code and the tests**, and marks each rule: tested, weakly tested (the
        test can't really fail, or works out its expected value with the code under test),
        or not tested.
     3. **For each gap, tries to write a test that fails.** A failing test is a bug found;
        it is reported, never fixed by the agent. It never changes `src/`.
   - Runs on a different model from the one that usually writes Festio's code, so it
     doesn't share the same blind spots.
   - Given part 2's survivors when they exist, to explain each in plain words and say
     whether it matters.
   - Output: one report file, numbered findings, most serious first, each with what a user
     would see if it shipped.

4. **To do — `/test-audit` command** (`chore/test-audit-command`).
   - One skill that runs parts 1–3 in order and leaves one report: the coverage summary,
     the survivors, the audit agent's findings, and a short plain-language verdict at the
     top ("3 things worth fixing, 2 accepted").
   - Run by hand, on the user's machine (the tests need Java and the emulator). Not on a
     timer for now.
   - After a run, each finding worth fixing becomes its own `fix/` (test-first); the rest
     are noted as accepted in the report.

## Open

- How often to run it: monthly, before each release, or after any change to the saves.
- Which model the audit agent uses (a different one from the main coding model).
- Where the reports live: not `context/reviews/`, which only cleanup runs write to.
