# Start Action

1. Read current-feature.md - verify Goals are populated
2. If empty, error: "Run /feature load first"
3. Set Status to "In Progress"
4. Create and checkout the feature branch (derive name from H1 heading)
5. If Notes has a `Plan:` line, read that one file and build by following it with
   superpowers:executing-plans, using the method the user chose at `plan`. Otherwise list
   the goals, then implement them one by one.