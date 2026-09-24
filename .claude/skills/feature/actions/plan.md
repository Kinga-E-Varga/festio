# Plan Action

Large features only. Running this action is the go-ahead to plan.

1. Read current-feature.md - verify Goals are populated
2. If empty, error: "Run /feature load first"
3. If Notes already has a `Plan:` line, ask whether to rewrite that plan. Stop if not.
4. Derive the plan name from the H1 heading, kebab-case, the same way `start` names the
   branch: `context/plans/[feature].md`. Never list or search `context/plans/`.
5. Write the plan with superpowers:writing-plans, saved to that path instead of the
   skill's default folder. The spec is current-feature.md.
6. Add one line to Notes: ``- Plan: `context/plans/[feature].md` ``
7. Do not create the branch or commit. Plans are git-ignored and never committed.
8. Ask the user to review the plan and choose how to build it: inline, or a subagent
   per task.
