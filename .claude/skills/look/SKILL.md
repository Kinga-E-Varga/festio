---
name: look
description: See a page of the running dev server — measure elements, screenshot on request. Use to check a layout or visual change, or when a layout bug is reported.
argument-hint: "[path] [--section id] [--style name] [--width 800,970] [--measure sel] [--shot]"
---

Run `npm run look -- $ARGUMENTS` (dev server on :3000). Options and examples:
`context/dev-tools/look.md`.

- Measure first (`--measure`): a few lines of text. Take `--shot` only to find what is
  wrong or when the user asks to see it, then Read the one file it prints.
- Several widths in one run: `--width 800,970,1200`.
