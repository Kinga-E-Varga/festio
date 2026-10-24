---
name: cleanup
description: Clean up project housekeeping tasks (add "run" to execute fixes)
argument-hint: run|check
---

Review the codebase for cleanup tasks:

1. Make sure that `context/history.md` is in order from newest to oldest
2. Find unnecessary console.log statements in src/
3. Find unused imports
4. Check for stale TODO comments
5. Find orphaned/unused files
6. Check that context files and skills match the actual project:
   - `context/repo-map.md` and `context/map/`: every path they name exists. Every route folder in `src/app/` and every top-level `src/` folder is listed in the repo-map, every file in `src/lib/` in `context/map/lib.md` (not every component). Each detail map is linked from the repo-map. When fixing, write the missing or changed lines yourself, in the right file and its style.
   - `context/current-feature.md`: Status fits the branch — `Not Started` on main, `In Progress` on a feature branch.
   - `CLAUDE.md`: every `npm run` command it lists exists in `package.json`, and "There is no test setup" is still true.
   - `context/ai-interaction.md`: every pinned guide path exists under `node_modules/next/dist/docs/`.
   - `.claude/skills/`: every command and file path a skill names still exists (e.g. `npm test`, a script, a context file).
7. Check if the .env.production has the same variables (not always the same value) as the .env. If something is missing, tell me.

**Mode: $ARGUMENTS**

If no argument or argument is "check":

- Only report findings, don't modify anything
- List what WOULD be cleaned up

If the argument is "run" or "fix":

- First, report all findings with numbered items
- Then ask: "Which items would you like me to fix? (enter numbers like 1,3,5 or 'all' or 'none')"
- Wait for user response before making any changes
- Only fix the items the user specifies
- Report what you changed
