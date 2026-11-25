# Current Feature: Template Drafts

## Status

Completed

## Goals

- **Finalize button (dev only).** On a modular template's preview (`/templates/<id>`), in
  development only, a Finalize action next to Save. It opens a small dialog: the template's
  name, and whether it is a **new** template or an **update** of the one the preview started
  from. Never shown or reachable in production.
- **The draft.** Finalize sends the editor's current state to a dev-only route handler, which
  writes `drafts/templates/<id>.json`: the name, new or update (and the starting template's
  id), the language it was written in, and the whole `ModularState` (palette, font
  pair, pattern, corners, envelope, each section's on/off and variant, every section's
  values). The route answers 404 outside development and only ever writes inside
  `drafts/templates/`. `drafts/` is git-ignored.
- **A `template` skill** (`.claude/skills/template/`) — Claude's side: read a draft, write or
  update `src/templates/modular/<id>/index.ts` in the house style (sections on, with their
  variants, in the fixed order; `values` only where they differ from `DEFAULTS`; the other
  two languages written for every phrase; short comments on non-obvious choices), ask for
  what the draft doesn't hold (recommended event types, anything unclear), run the template
  check, delete the draft once the template is in.
- **Template check test** (`tests/lib/`) — every modular template's palette, font pair,
  pattern and corners exist; each listed section and its variant exist; no section listed
  twice; every key in `values` is a section of the library and a field of that section.
  Fails with the template id and what is wrong.

- **Date & time: Simple** (`12`) — Simple accent's date and note on the surface in turn,
  listed before Simple accent.

- **Item marks by style** — Icon & list shows numbers only, behind its own Use numbers
  switch (on by default); Icon & cards and Two-line & cards show no marks, their text
  centred; every other list's and card's icon discs take turns, secondary then accent.

- **Sample photos (dev only)** — on a template's preview in development, Change photo picks a
  JPEG, PNG or WebP (at most `SAMPLE_PHOTO_MAX_MB`), saved into `public/modular/samples/`
  through `api/dev/sample-photo`; the field takes its path. Hosts still see it off.

- **Picking a template applies it in full** — in the editor's Design tab, the picked
  template's look and sections (on, off, styles) replace the invitation's; each value the
  host never changed (still the old template's sample or `DEFAULTS`) takes the new
  template's, and the host's own text stays (`applyTemplate`).

## Notes

- Simplify: ran 2026-11-25
- Modular only. Simple templates have their design in code; the editor can't build one.
- Uses the existing preview: `src/app/[locale]/templates/[id]/page.tsx` already runs
  `ModularEditor` with Save kept in memory. No event, no database.
- To make a template from scratch: open any modular template's preview, change it, Finalize
  as **new**.
- Dev-only pattern to follow: `process.env.NODE_ENV === "development"` (as in
  `PaletteSwitcher.tsx`); the route like `src/app/api/dev/db-count/route.ts`, 404 otherwise.
- The editor's text is in the preview's one language (the host locale); the skill writes the
  other two.
- Once the test is in, fix whatever it finds in `coastal-fun` and `olive-garden` (the reason
  for this feature).
