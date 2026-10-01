# Modular invitations — Phase 1: sections and the template page

**Status: settled.** Discussed and agreed 2026-10-01.

Visual reference: the design canvas "Type 2 Invitation"
(https://claude.ai/artifact/4cHNDX7cGjTuVQzEE399WL). Pages **Guest page** (the whole
invitation, desktop + mobile) and **Section options — 15 colours** (the section variants).
Its other pages are not part of this phase.

## Goal

Build the modular (Custom package) invitation system: a library of sections, each with
variants, plus palettes and font pairs. Show one modular template at
`/templates/<id>`, with the same host bar and edit panel as simple invitations, but
with **no forms in any tab**.

Not linked to any event. No Firestore.

## The model

Four shared libraries, built by developers:

1. **Sections.** Each section (Cover, Schedule, FAQ…) has one or more **variants**.
2. **Palettes.** Premade sets of 15 colours, `c1`–`c15`. The host can only pick a whole
   palette, never change single colours.
3. **Font pairs.** Premade pairs. The host picks a pair, not single fonts.
4. **Templates.** Presets only: a palette, a font pair, and a list of sections with a
   chosen variant for each. A template is a starting point the host can change later.

### Adding things must be easy

- **New variant** = one new `.tsx` file in its section folder.
- **New section** = one new folder with `index.ts` + at least one variant.
- **New palette / font pair / template** = one new file.
- Nothing is registered anywhere. Everything is loaded by id with a dynamic import, the
  same way `loadTemplate` works today.

### Permanent ids

Events will later store **section, variant, palette and font-pair ids** (see phase 3). These
ids must never be renamed. **Template ids can change freely**, because events never store
them.

## Folder layout

```
src/modular/
  sections/
    <section-id>/
      index.ts          the section definition
      <variant-id>.tsx  one file per variant
  palettes/<palette-id>.ts
  font-pairs/<pair-id>.ts
  index.ts              loaders: section, variant, palette, pair — by id
```

The modular template file lives in the existing `src/templates/<id>/index.ts`, so
`/templates/[id]` finds it with no new route.

## Sections

### The section definition (`index.ts`)

Each section declares:

- `id` (permanent) and a host-facing name (EN / RO / HU)
- **required or optional.** Required: cover, title, date & time, location. RSVP is also
  always present, as the last section.
- `order`: a number that sets its place in the fixed order (e.g. cover 10, title 20…). The
  fixed order lives with the sections, not in a central list.
- an optional **menu label**. Sections that have one appear as links in the top bar /
  mobile drawer.
- its **fields**, with sample content (see Content below)

### Phase 1 sections and variants

One variant per section. **No variant may need a photo.** Fourteen sections plus RSVP:

| Order | Section          | Kind     | Variant id   | From the board                                    |
| ----- | ---------------- | -------- | ------------ | ------------------------------------------------- |
| 1     | `cover`          | required | `full-bleed` | Option A, with a **dark background instead of the photo** |
| 2     | `title`          | required | `editorial`  | Option A, Editorial two-column                    |
| 3     | `date-time`      | required | `moments`    | Option B, Moment cards                            |
| 4     | `countdown`      | optional | `big-number` | Option A, One big number                          |
| 5     | `location`       | required | `details`    | Option A, Details beside the map (no map, see Maps) |
| 6     | `map`            | optional | `legend`     | Option A, Map with a legend (no map, see Maps)    |
| 7     | `schedule`       | optional | `timeline`   | Option A, Center-line timeline                    |
| 8     | `dress-code`     | optional | `guidance`   | Option A, Guidance and named palette              |
| 9     | `menu`           | optional | `card`       | Option A, Printed menu card                       |
| 10    | `gifts`          | optional | `bank-card`  | Option A, Bank details card                       |
| 11    | `playlist`       | optional | `record`     | Option A, Record and prompt                       |
| 12    | `accommodation`  | optional | `list`       | Option B, Comparison list                         |
| 13    | `transportation` | optional | `ways`       | Option B, Ways to arrive                          |
| 14    | `faq`            | optional | `accordion`  | Option A, Accordion                               |
| 15    | `rsvp`           | always   | `simple`     | Today's simple RSVP form (see RSVP below)         |

The order follows the board's Guest page (countdown sits between date & time and
location).

Section-to-RSVP links on the board (the Playlist song question, the Transportation shuttle
question) are **not** part of this phase.

### Maps

**No live map embed.** A Google Maps embed would send guest data to Google before any
consent. Instead:

- **Location** shows the address and an **"Open in Maps"** button (a plain link).
- **Map** lists the places, each with its own "Open in Maps" button.

Nothing loads from Google until the guest taps a button.

### "Save to calendar"

Not in v1 (add-to-calendar is out of scope). The Date & time variant has no save buttons.

## Palettes

- A palette file holds `c1`–`c15` and a display name.
- The 15 roles are fixed and positional, as on the board: `c1`–`c7` light grounds and
  lines, `c8`–`c10` ink, `c11`–`c12` dark grounds, `c13` main accent, `c14`–`c15`
  secondary accents.
- Variants use **only** these 15 colours.
- **Phase 1 palettes:** `terracotta` and `midnight`, with the exact hex values from the board.

### CSS variables

- On the page, the palette becomes **`--m1`…`--m15`**.
- Not `--c*`: the shared host bar, edit panel and RSVP form already read `--c1`–`--c6` with
  different meanings. The two sets must not collide.
- **One mapping, written once in `src/modular/`,** fills the old roles from the new ones:

  | Old role (`--c*`) | Meaning | From |
  | ----------------- | ------- | ---- |
  | `--c1`            | surface | `m1` |
  | `--c2`            | accent  | `m13` |
  | `--c3`            | ink     | `m8` |
  | `--c4`            | muted   | `m10` |
  | `--c5`            | hover   | `m15` |
  | `--c6`            | warning | `m13` |

- A variant on a dark ground (e.g. the RSVP band) may set its own mapping on its own
  wrapper.

## Font pairs

- Fonts are declared in the existing `src/lib/fonts.ts` (self-hosted via `next/font/google`).
- A pair has the same `primary` / `secondary` shape as simple templates (`TemplateFonts`).
  For modular: **`primary` = body text** (the RSVP form already reads it), **`secondary` =
  headings**.
- **Phase 1 pairs:**
  - `classic`: Libre Baskerville headings + Kantumruy Pro body (as on the board)
  - `script`: Kapakana headings + Noto Serif body (the Wolf Dance fonts)

## Content

### Invitation basics

Facts that appear in several sections are entered **once**:

- the hosts' names (cover, title signature, top-bar initials)
- the date (cover, date & time, countdown, "replies close")
- the venue name and address (cover, location)

Any variant can read these. Phase 1 has no event, so they come from **one set of sample
values** in `src/modular/` (e.g. Maria & Andrei, 12 June 2027, Conacul Bragadiru).

### Section fields

- Everything else **belongs to its section**, declared in the section's `index.ts`. The idea
  is the same as `TemplateField` today: id, host-facing label (EN / RO / HU), type, max
  length, sample content as `LocalizedText`.
- Sample content that is a phrase is given in all three languages. Names and addresses
  stay plain sample text.
- **Field types:** `text`, `longText`, `time`, and the new **`list`**: a repeating group of
  fields. It's needed for schedule items, FAQ entries, menu courses, places to stay, ways to
  arrive, map places and date & time moments.
- **Variants never declare fields of their own.** A variant may show fewer of its
  section's fields. That's why switching variants (phase 2) never loses content.
- Phase 1 has no forms. The page shows the sample content. Phase 2 builds the forms from
  these same declarations.

### Fixed guest-facing words

Words the host doesn't edit ("Days", "Open in Maps", "RSVP", the drawer's "Sections") go in
`messages/{en,ro,hu}.json` under a new **`Sections`** group, guest-facing like `Rsvp`.

### Language

There's no invitation yet, so the template page speaks the **host's locale**, the same as
simple template previews do today.

## The modular template

One file in `src/templates/<id>/index.ts`:

```ts
export const template = {
  kind: "modular",
  id: "garden",
  name: "Garden",
  palette: "terracotta",
  fontPair: "classic",
  sections: [
    { section: "cover", variant: "full-bleed" },
    // … all 15, in order, rsvp last
  ],
};
```

- Sections are listed in the fixed order. Storing the order on the template (and later the
  event) leaves room for rearranging later.
- The simple templates get `kind: "simple"`. `TemplateModule` becomes a union of the two.
- **Phase 1 templates:**
  - `garden`: Terracotta + Classic, all sections on
  - `garden-midnight`: Midnight + Script, same sections. It exists to prove that swapping
    palettes and pairs restyles everything.

### Other `loadTemplate` callers

The guest invite page, the print page and the invitation page load templates by an event's
`templateId`. They only handle simple templates. Given a modular one, they show not found.

## The guest page (`ModularInvitation`)

Top to bottom, as on the board's Guest page:

- **Sticky top bar:** hosts' initials ("M & A"), links to the sections that have a menu
  label, "Replies close …" (from the sample date, using the existing reply-close rule), and
  an RSVP button.
- **Mobile:** the links move into a drawer behind a ☰ button. RSVP stays in the bar at all
  times.
- **The sections**, stacked full width, each with an anchor (`#schedule`). Laid out
  responsively, **not** scaled like the simple card.
- **Footer:** the privacy line. The deletion period comes from
  `GUEST_DATA_RETENTION_DAYS` in `src/lib/config.ts`, never hardcoded (the board's "30 days"
  is just sample text).

## RSVP section (`rsvp/simple`)

- Today's simple RSVP form (Coming / Not coming, names, age, diet, note), moved into a
  full-width section and coloured from the 15-colour palette.
- RSVP is a section with variants, like the others. Phase 1 has one.
- In the editor, sending shows the existing "test reply" toast, never a save.

## The host editor on `/templates/<id>`

- `src/app/[locale]/templates/[id]/page.tsx` loads the template as now. For
  `kind: "modular"` it renders a new **`ModularEditor`**. Simple templates are unchanged.
- **Host bar** reused as is: Back (same fallback as now), the Edit toggle, and Save (shows
  the "saved" toast).
- **Edit panel:** the same `SidePanel` shell, the same three tabs (**Text / Response /
  Design**) and the X. **Every tab is empty.**
- The tab row moves out of `EditPanel.tsx` into a small shared **`PanelTabs`** component,
  so both panels use it. This is the only change to existing editor code.
- The page underneath stays scrollable while the panel is open. The RSVP form works.
- Variants render in the browser (like `TemplateCard`), so phase 2 can re-render them live.
  A loading skeleton shows while they load.
- The page keeps `noindex`, as template previews already do.

## Core spec update

`context/project-overview.md` says sections are "defined per template, not shared
globally". That no longer holds. Update it in this phase's commit: sections, palettes and
font pairs are shared libraries, and modular templates are presets over them.

## Out of scope for phase 1

Forms in any tab, pickers (sections on/off, variant, palette, font pair), linking to
events, Firestore, image uploads and photo variants, second variants, rearranging, the
custom free-form section, modular RSVP questions, section-driven RSVP questions,
click-to-load maps, modular print.

## Testing

- `npm run build` and `npm run lint` pass.
- In the browser, at desktop and mobile widths, in EN / RO / HU:
  - `/templates/garden` and `/templates/garden-midnight` render all 15 sections, with
    clearly different colours and fonts
  - the sticky bar, menu links / anchors and the mobile drawer work
  - the host bar and edit panel open and close, all three tabs empty
  - the RSVP form works and shows the "test reply" toast
- The simple template preview (`/templates/wolf-dance`) and the guest page still work as
  before.
