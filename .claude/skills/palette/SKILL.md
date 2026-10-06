---
name: palette
description: Make a new modular invitation palette from a mood (subtle, balanced or vivid), light or dark, and an optional colour idea or reference (image, swatch, link) — propose directions as swatches, check readability, write the file
argument-hint: "[subtle|balanced|vivid] [light|dark] [colour idea, or a path / link to a reference]"
---

# New palette

Make one new palette for modular invitations in `src/modular/palettes/`.

**Brief:** $ARGUMENTS

## 1. Read what exists — always fresh

The user edits palettes by hand. Never work from memory or from earlier in the
conversation; read every file in `src/modular/palettes/` now, then run:

```bash
node .claude/skills/palette/check.mjs --all --out <scratchpad>/current.html
```

Note for each palette: its mood, light or dark (the surface), and its main hues.
The new palette must not repeat a hue pairing an existing one already has.

## 2. Settle the brief

- **Mood** — required. If it's missing, ask. See _Moods_ below.
- **Light or dark** — if not given, pick the one that mood has fewer of, and say so.
- **Colour idea** — optional: words ("yellow-blue"), hex codes, or a reference
  to look at (see _Reading a reference_). A reference is a **starting point
  only**: adjust its hues to fit the roles and the mood, don't copy it.

### Reading a reference

The user may point at a swatch, a mood board or another design. Open it before
proposing anything, and say which colours you took from it.

- **Image file** (`.png`, `.jpg`, a screenshot) — read it with the Read tool. A
  Windows path like `C:\Users\me\Downloads\swatch.png` is
  `/mnt/c/Users/me/Downloads/swatch.png` here. A folder: list it, read each image.
- **Image pasted into the chat** — it's already visible; use it.
- **claude.ai artifact link** — read it with the Artifact tool (`action: "read"`)
  and look for colour values in its CSS.
- **Web page** — fetch it with WebFetch and ask for the colour values it uses.
- **Hex codes** — use them as given.

Labelled hex codes in an image win over colours guessed by eye; otherwise say the
values are estimates.

## 3. Propose 2–3 directions

Write the drafts as one JSON array in the scratchpad (`[{ id, name, mood, colors }]`,
all 15 roles each) and run:

```bash
node .claude/skills/palette/check.mjs <scratchpad>/drafts.json --out <scratchpad>/drafts.html
```

Tune until no draft has a `FAIL`, then show the user a short table per direction
(accent / secondary / tertiary / surfaces / ground) and where to open the swatch
page. Windows programs can't be started from here (no `explorer.exe`), so give the
path as Windows sees it, for the browser's or File Explorer's address bar:
`\\wsl.localhost\$WSL_DISTRO_NAME\<path with backslashes>`. Wait for a pick.

## 4. Write the palette

Fill all 15 roles of the picked direction, run the checker on it again, then write
`src/modular/palettes/<id>.ts` in the shape the others use:

```ts
import type { ModularPalette } from "@/types/modular";

/** <The real colours: accent with secondary and a <tertiary> band, on <surfaces> and a <canvas> ground.> */
export const palette: ModularPalette = {
  id: "<id>",
  name: "<Name>",
  mood: "<subtle|balanced|vivid>",
  colors: {/* all 15 roles */},
};
```

- **Name:** a fun, evocative name that fits the feel — a place, thing, moment or
  era, like Sunbaked, Linen, Coastal, Noir, Orchard, Peony, Thistle, Y2K, Flint.
  It can be more than one word ("Golden Hour" is fine). Never a list of its
  colours (not "Dark Olive", "Blush & Sage"). Offer 2–3 names if unsure.
- **Id:** the name in kebab-case. Ids are permanent once events store them.
- The file is found automatically — no registration.

Then run `npx prettier --write` on the file and `npx tsc --noEmit -p .`, and tell
the user it's ready to check in the browser. Don't claim it looks right before
they've seen it.

After their feedback, change only what they named, re-run the checker, and repeat.

## The roles — what each does on the page

| Role                        | Used for                                                          | Needs                                                     |
| --------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------- |
| `canvas`                    | The ground around the invitation's column (it casts a shadow)     | Usually between `surface` and `surface-alt`; may be close |
| `surface` / `surface-alt`   | Sections alternate between them                                   | A clear step between the two (≥1.15)                      |
| `ink` / `ink-muted`         | Text; muted for notes and captions                                | 4.5:1 on both surfaces and on `secondary-soft`            |
| `line`                      | Card borders, hairlines                                           | Visible on `surface-alt`                                  |
| `accent`                    | Main colour: buttons, header, bands, the playlist disc; also text | 4.5:1 as text on both surfaces                            |
| `accent-ink`                | Text on the accent                                                | 4.5:1, and its muted mix (a fifth towards the accent) too |
| `accent-soft`               | Icon discs, picked answers in the reply form                      | Accent icon on it 3:1; `ink` on it 4.5:1                  |
| `secondary`                 | Small coloured text: eyebrows, icons, hover; a header fill        | 4.5:1 on both surfaces and on `secondary-soft`            |
| `secondary-ink`             | Text on a secondary fill                                          | 4.5:1                                                     |
| `secondary-soft`            | Secondary icon discs, the first reply variant's ground            | Must not blend into `surface-alt`                         |
| `tertiary` / `tertiary-ink` | A band (cover 2, reply 2) and its text                            | 4.5:1, its muted mix too                                  |
| `error`                     | Form warnings                                                     | 4.5:1 on both surfaces                                    |

On a **dark** palette the surfaces are dark and the accent, secondary and their
inks flip: light colours with dark text on them. The canvas usually stays light.

## Moods

Judge against the current palettes of that mood (step 1), not a fixed list.

- **subtle** — greyed-down colours, nothing shouts. Neutrals tinted towards the
  accent. Often two colour families plus neutrals. Light: a soft mid-light band,
  not a near-black one. Dark: near-black surfaces, a muted accent (champagne, not
  mustard).
- **balanced** — clear colour, but softened and gentle, like dusty pastels: more
  colour than subtle, never bright. Three hues can work if they sit far apart.
- **vivid** — saturated, high-energy, colours that pop. Light: bright fills and a
  bright band. Dark: glowing colours on deep surfaces. Readability still holds: a
  vivid colour too light for text goes on fills, with a darker shade of it for text.

## Rules for every mood

The checker enforces the first; the rest are warnings to fix or explain.

- Every text pair passes (4.5:1; icons on a soft disc 3:1).
- Surfaces: `surface` vs `surface-alt` ≥1.15. A light `surface` is never near-white
  and not cream-yellow unless the user asks.
- Soft tints don't blend into `surface-alt`, and are no louder than the rest.
- Accent, secondary and tertiary don't look alike: hues at least ~30° apart, or a
  clearly different lightness (burgundy vs burnt orange, yellow vs orange both failed).
- No hue that fights the accent (purple-mauve against olive failed).
- The file's comment names the real colours.

## Don't

- Change an existing palette unless the user asks. Sunbaked's remaining fails are
  known and accepted: darker shades would change its look.
- Copy a reference palette as-is.
- Add roles, or touch `vars.ts` / the type, for a palette.
