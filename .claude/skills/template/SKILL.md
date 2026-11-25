---
name: template
description: Turn a modular template draft (drafts/templates/<id>.json, saved by the template preview's dev-only Finalize button) into a template file in src/templates/modular/ — new or an update — with the other two languages written, only what differs from DEFAULTS kept, and the template check run. Use when the user says they finalized a template, or names a draft.
argument-hint: "[draft id, or nothing for the newest draft]"
---

# Template from a draft

The user builds a modular template in the editor on a template's preview
(`/templates/<id>`, dev server) and clicks **Finalize (dev)**: a name, and **new** or
**update** of the template the Design tab shows as current. That saves
`drafts/templates/<id>.json` (git-ignored): `id`, `name`, `mode`, `from` (the starting
template), `language` (what the text is written in) and `state` (the editor's whole
`ModularState`). Your job: turn it into `src/templates/modular/<id>/index.ts`.

**Draft:** $ARGUMENTS (empty: the newest file in `drafts/templates/`; none there: say so
and stop).

## 1. Read

- The draft, with `diff`:

  ```bash
  node .claude/skills/template/run.mjs drafts/templates/<id>.json
  ```

  It prints the look, the sections on with their variants, and for each of those
  sections (and the ones they `reads`) each field marked:
  - `default` — the same as `DEFAULTS`: leave it out of `values`.
  - `template` — the same as the starting template's own sample: copy that sample from
    `src/templates/modular/<from>/index.ts` as it is, all three languages.
  - `changed` — new text: write it (step 3).
  - `unsampled` — empty only because the variant never fills it: leave it out.

- The starting template's file, and one other template, for the house style.
- For an **update**: the file you are replacing. Keep its comments where they still hold.

## 2. Ask what the draft doesn't hold

In one message, only what you can't tell:

- **Recommended event types** (`eventTypes`; `EventKind` in `src/types/dashboard.ts`). An
  update keeps the old ones unless told.
- Anything odd in the diff: a field cleared that may have been an accident, a section on
  whose content is all defaults when the template is meant to be its own.
- **Photos**: on the preview, Change photo saves a picked file into
  `public/modular/samples/` and the field holds its path (`/modular/samples/<name>`), so a
  draft's photos are already in place. A name you can't place: ask what it shows.

Not asked: the envelope (templates don't set it; every new invitation starts with it on).

## 3. Write the file

`src/templates/modular/<id>/index.ts`, as the existing ones:

- `kind: "modular"`, `id`, `name`, `package: "custom"`, `eventTypes`, `palette`,
  `fontPair`, `pattern` only when not null, `corners` only when not `sharp`
  (`DEFAULT_CORNERS`).
- `sections`: only the ones **on**, in the library's order, `{ section, variant }`, each
  with a trailing comment naming the variant (`// plain`), as the others do. Required
  sections too.
- `values`: only `template` and `changed` fields, by section, then field, and only
  those the template **uses**: a field its section's variant shows (down to a list
  item's keys, such as `venues.label` or `days.items.icon`), in a section that is on (or
  one a section on `reads`, as Helpful notes reads Dress code). Anything else stays out,
  even an empty string, so it falls back to `DEFAULTS`. The template check names any
  that slip through.
  - A **phrase** (heading, note, label, a list item's title…) is `{ en, ro, hu }`: the
    draft's language as written, the other two translated to match its tone and length.
    Romanian with diacritics (ș, ț), Hungarian natural, not word for word. English in
    British spelling.
  - **Sample content** (names, venue names, addresses, times, dates, links, phone
    numbers) is a plain string.
  - A list or groups field is written whole when anything in it changed: every item,
    each phrase in three languages.
  - An empty string the user left on purpose (`eyebrow: ""`) stays.
- The doc comment above `template`: one or two lines — palette, font pair, ground, and
  anything notable about the content. Short comments on non-obvious values, as in
  `coastal-fun`.
- An id is permanent: an update keeps `from` as its id, never renamed.

## 4. Check

```bash
TESTS=tests/lib/template-check.test.ts npm test
npx tsc --noEmit -p .
npx prettier --write src/templates/modular/<id>/index.ts
```

The check names any palette, pair, section, variant or value key that doesn't exist.
Then tell the user to open `/templates/<id>` in the browser. Don't look yourself (the
`look` rules in `context/ai-interaction.md`).

## 5. Finish

- Delete the draft once the file is written and the check passes.
- Photos picked on the preview but not in the finished template: list them with
  `git status public/modular/samples/` and offer to delete them (never without a yes).
- A new template needs no registration and no repo-map edit; it is a change to the app,
  so it goes through the `feature` skill like any other (branch, commit on asking).
