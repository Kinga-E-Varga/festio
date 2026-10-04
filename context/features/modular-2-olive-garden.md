# Modular invitations 2 — Olive Garden

Redo the modular library's look from the prototype in
`context/plans/online-invitation-design-ideas/` (Nocturne palette). The
prototype is a reference only: evaluate its code, don't copy it straight in.

## Goals

### Clean-up

- Delete every current section variant **except `playlist/record`**. Each
  section gets one new variant, drawn from the prototype. Section ids stay.
- Delete the `map` section. Its place is taken by a photo inside `location`.
- Delete the Terracotta and Midnight palettes, the Classic and Script font
  pairs, and the Garden and Garden Midnight templates.
- Keep the `dots` pattern, even though nothing uses it.

### Colour model

A palette goes from 15 positional roles (`c1`–`c15`) to **9 named roles**.
Everything else is mixed from them, in one place (`vars.ts`), in `oklch`, each
percentage written once. Variants read mixed colours by name, like roles.

**Roles (set per palette):** `canvas`, `surface`, `ink`, `accent`,
`accent-ink`, `secondary`, `secondary-ink`, `tertiary`, `tertiary-ink`.

**Mixed (never set per palette):**

| Name             | Mix                                    |
| ---------------- | -------------------------------------- |
| `surface-alt`    | surface + ~6% ink                      |
| `line`           | surface + ~15% ink                     |
| `ink-muted`      | ink + ~30% surface                     |
| `accent-soft`    | surface + ~15% accent                  |
| `secondary-soft` | surface + ~18% secondary               |
| `shadow`         | black tinted with a little accent      |
| `inverse` pair   | ink as the ground, surface as the text |

Percentages are starting points; tune them by eye on Nocturne.

- `canvas` and the three `*-ink` roles stay real roles: no single mix works
  for both light and dark palettes.
- The count is not fixed at 9. More roles can be added later when a variant
  needs a colour that can't be mixed (required in every palette, or optional
  with a fallback mix — decide when the first one comes).
- The shared `--c1`–`--c6` mapping (host bar, edit panel, RSVP form) is
  re-pointed at the new names.
- Update `project-overview.md`: "a palette is 15 fixed colour roles" becomes
  "9 colour roles, the rest mixed from them; more may be added".

**Nocturne** — the only palette:

| Role            | Value     |
| --------------- | --------- |
| `canvas`        | `#181a17` |
| `surface`       | `#22251f` |
| `ink`           | `#f0eee5` |
| `accent`        | `#a8b891` |
| `accent-ink`    | `#1a2118` |
| `secondary`     | `#d88d6d` |
| `secondary-ink` | `#241812` |
| `tertiary`      | `#e2c480` |
| `tertiary-ink`  | `#2a251a` |

**Invitation shadow:** keep the existing `elevation-band` (`0 0 14px`, 60%).
Only its colour changes, from `--m7` to the mixed `shadow`. Don't use the
prototype's shadows.

### Fonts

One font pair, close to the prototype's Georgia + Arial: **Gelasio** for
headings, **Arimo** for body text, via `next/font/google`.

### Icons

A shared icon library in `src/modular/` that any section can offer as a
choice. Drawn by hand (no `lucide-react`). Adding an icon must be easy — one
place, nothing else to touch. Start with what the prototype uses: meal,
heart, sparkle, moon, train, bus, car, compass, gift, pin, clock.

### Section headings

Every section heading has separate optional fields: the small line above
(eyebrow), the heading, an italic second heading line, and a note under it.
Any of them can be left empty and the heading must still look good.

### Sections

In page order:

| Section          | Prototype part         | Notes                                                                                                                                                                                                                                         |
| ---------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `top-bar`        | Top bar                | Monogram (`mark`) + section links. The prototype's palette switch becomes an **RSVP** button that jumps to the form.                                                                                                                          |
| `cover`          | Cover photo            | Kicker, date, "Scroll to celebrate". Photo required in this variant. A fixed dark fade at the bottom of the photo keeps the text readable (not a palette colour).                                                                             |
| `title`          | Hero ("Mara & Luca")   | Eyebrow, names, caption. **No date link.**                                                                                                                                                                                                    |
| `date-time`      | "The day" text + card  | Keeps the parts-of-the-day list (up to 4).                                                                                                                                                                                                    |
| `countdown`      | Countdown              | Its own section, right under date-time. Live days, hours, minutes, seconds.                                                                                                                                                                   |
| `location`       | Venue card + map       | One section: venue card, and a **photo where the map was**. Photo required in this variant (a host who wants no photo uses another variant later).                                                                                            |
| `schedule`       | Weekend schedule       | The host adds days, and events within each day (time, title, note, icon). No highlighted day. Icon colours alternate by day: odd days `accent` on `accent-soft`, even days `secondary` on `secondary-soft` (as in the prototype). Icons only. |
| `menu`           | Menu card              |                                                                                                                                                                                                                                               |
| `notes`          | "A few helpful notes"  | New section, see below.                                                                                                                                                                                                                       |
| `dress-code`     | Dress code card        | Stays a section of its own too.                                                                                                                                                                                                               |
| `gifts`          | Gifts card             | Stays a section of its own too.                                                                                                                                                                                                               |
| `accommodation`  | "A soft place to land" |                                                                                                                                                                                                                                               |
| `transportation` | Train / shuttle / car  | Each card has an icon from the icon library.                                                                                                                                                                                                  |
| `faq`            | FAQ accordion          |                                                                                                                                                                                                                                               |
| `rsvp`           | RSVP                   | **Our existing form and logic**, in the prototype's look: intro beside the form, heart, field styles, thank-you screen with sign-off. The "kindly reply by" line is host-written text, not filled from the closing date.                      |
| `footer`         | Footer                 | New section, **required and always last.** Monogram (read from the top bar's `mark` — one source), a closing line, date · place filled from the event, "Back to the beginning".                                                               |

`playlist` keeps its old `record` variant and is **not** in the new template.

### Helpful notes (`notes`)

- A section that holds subsections, **at most 4 in total**.
- Subsection types: **Dress code**, **Gifts**, and **Custom** (host's own
  title and text).
- Dress code and Gifts can each be added once. Custom can be added more than
  once.
- Dress code and Gifts read the **same data** as the standalone `dress-code`
  and `gifts` sections — one source. If the host turns on both the standalone
  section and the subsection, the content shows twice; that's allowed, and
  removing one is up to the host.
- Numbering ("01 · Dress code") is automatic.

### Template

- **Olive Garden** — Nocturne palette, Gelasio + Arimo, no pattern, every
  section above except `playlist`, in the order above.
- The prototype's Tuscany photo is the sample image for the cover and the
  location photo until uploads exist.

### Mobile

The prototype barely handles phone widths. Design the mobile layout in the
same style, following the existing modular page's behaviour (drawer, 1280px
column).

## Notes

- Firestore schema is still unsettled. How the shared dress-code / gifts data
  is stored is a layout question for later; for now, both places read the same
  section values.
- Image fields are new. No upload yet — the sample photo is the value.
- No saved events use the old variants, palettes, pairs or the `map` section,
  so deleting them breaks nothing.
