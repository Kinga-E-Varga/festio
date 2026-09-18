# Type 1 invitation page and editing platform

## Overview

The approach authors each card once at a fixed pixel size and scales the whole card uniformly to fit whatever space it is given.

Use a simple mochup invitation design.

---

## Requirements

### 1. The core rule

**A template is authored once, at one fixed pixel size, and never reflows.**

The card's DOM node is always exactly `designWidth × designHeight` (1080 × 1532
for the reference template). A single `transform: scale(s)` paints it smaller.
Because a transform scales the entire rendered subtree, every element inside —
text, gaps, borders, SVG, images — scales from that one number.

Consequences a developer must internalise:

- Inside a template file, use **plain px only**. No `%`, `vw`, `em`, `rem`,
  `cqw`, and **no Tailwind responsive prefixes** (`md:`, `lg:`). A breakpoint
  inside the card fires on viewport width, which is unrelated to how large the
  card is actually painted, so it will silently desynchronise from everything
  around it.
- Content may still _reflow within the fixed canvas_ when a host leaves a field
  blank. Use a flex column with `gap` and conditional rendering; blank fields
  are omitted and siblings close the gap. This is compatible with scaling — it
  happens at the fixed design size, before the transform.

## 2. `ScaledStage` (infrastructure — write once, share)

Lift `ScaledStage` from `InvitationPage.jsx` into a shared module. It is not
template-specific and must not be duplicated per template.

Behaviour:

```
scale = clamp(minScale, min(slotW / designW, slotH / designH), maxScale)
```

- Measures its **own container** with `ResizeObserver`, never the viewport.
  This is required: the card must work in the guest page, the host editor, a
  dashboard thumbnail and the print preview, and only one of those has any
  relationship to viewport size.
- Renders two nested elements. The outer is a normal-flow placeholder sized to
  `designW * scale × designH * scale`. The inner is `position: absolute` with
  the transform and `transformOrigin: "top left"`. **Both are required.** A
  transform does not affect layout, so without the placeholder the page
  reserves the full unscaled size and leaves a large blank gap; without
  `top left` the painted card is offset from the placeholder.
- Sets `visibility: hidden` until the first measurement so no unscaled frame
  flashes before JS runs.
- Uses `useLayoutEffect`, not `useEffect`, so measurement happens before paint.
- The state setter ignores sub-0.0005 changes to avoid redundant re-renders.

SSR note: this is a Next.js SSR app. The card is invisible until hydration
measures it. If that gap is noticeable on a cold mobile load, size the
placeholder on the server with a CSS `min()` / `aspect-ratio` fallback so the
frame is correct on first paint and only the contents pop in. Do not attempt to
remove the JS — CSS cannot divide a length by a length to produce the unitless
scalar that `scale()` requires.

### Flex requirements around it

`ScaledStage` expects to be a flex child that absorbs remaining space. It sets
`flex: 1; minWidth: 0; minHeight: 0`. **Both `min-*: 0` values are mandatory** —
without them the flex item refuses to shrink below the card's 1080 × 1532
intrinsic size and pushes sibling chrome off screen. This is the most common
failure when adding elements to the page.

Adding page chrome (password gate, "RSVP closed" notice) requires no change to
the scaling: add a fixed-height flex row, and the stage refits automatically.

## 3. Template file contract

One file per template, per the existing architecture constraint. It exports:

- `template` — an object holding id, display name, `type`, `minTier`,
  `eventTypes`, `design: { width, height }`, `printSize`, `palette`, `fonts`, `edge`,
  and `fields`.
- the card component, which takes `{ values }` and renders at the fixed size.

**Palette is part of the template's public surface, not a private detail.**
The RSVP chrome is styled from `template.palette`, because the guest must
experience one continuous designed object — Festio's own palette and fonts must
not appear on the guest page. The palette therefore needs enough entries to
style an interactive form: surface, on-surface text, action fill, on-action
text, and input underline, each with adequate contrast. A template declaring
only paper/ink/accent is insufficient.

## 4. Guest page composition

Desktop (≥ 900px) is a flex **row**; below that a flex **column**. The same
`ScaledStage` serves both — when the RSVP panel moves to the right, the card's
constraining axis flips from height to width and it refits with no code change.

The RSVP surface:

- **Desktop** — a fixed panel on the right, always visible (1/3 od the viewport width but maximum 700 px minimum 400 px width).
- **Mobile** — a bar at the bottom that opens a drawer.

The RSVP form will have different edges both on mobile and desktop view (scalloped, wavy, plain etc) defined in the template object, and **must be inside the panel's declared width**, not overhanging it. It should have a maximum of 40 px width or height and will be painted with css. Int eh demo use a wavy edge

### Reveal interaction (desktop)

The panel opens showing a short message and an outlined "RSVP NOW" button. On
click, the button collapses and the form expands; the message stays put at a
constant size and becomes the panel's title. There is no separate "RSVP"
heading.

Animate with `grid-template-rows: 0fr → 1fr` on a wrapper whose child has
`overflow: hidden; min-height: 0`. **Do not use `max-height`** — it animates
toward an arbitrary ceiling rather than the true content height, which makes the
easing uneven and imposes a hidden clipping limit once enough names are added.

The message must not change size during the transition. Only its position
changes, and that happens because the panel is vertically centred and the
content block grows.

## 5. RSVP form — Type 1

Fields, in order:

1. One or more **names** (one input each, "+ new person" adds a row, rows after
   the first get a remove control).
2. A **single going / not going** choice covering the whole reply — not one per
   person.
3. An optional **note for the hosts**, one per submission, 300 characters.
4. Submit.

Submit payload shape:

```js
{
  attendees: [{ name, status: "going" | "not_going" }],
  answers: { q_note_host: string | null }
}
```

The per-attendee fixed core (name + status) matches the decided answer-storage
rules; the submission-level status is written onto every attendee, so storage is
unchanged by the UI simplification.

**Open decision — needs resolving before the write is implemented.** The note is
submission-level, but the decided rules key every answer to an attendee. This
requires an `answers` map on the RSVP submission itself, as a sibling of
`attendees`. The same keying rules apply to both scopes (permanent IDs; missing
key = never asked; null = asked and skipped; definitions archived, never
deleted), and "scope" becomes part of a question's frozen definition. Confirm
this before writing the Firestore schema. Type 2 will need submission scope
anyway for party-level questions.

### Not yet implemented

- Duplicate-name handling on submit (ask the guest whether they already RSVP'd;
  "Yes, it's me" creates nothing, "No, add mine" creates an entry flagged
  `UNKNOWN`).
- RSVP auto-close 24h before the event. The panel should remain visible in a
  closed state rather than disappearing.
- Cancelled event. Per spec this replaces the whole invitation page, so it is
  not a panel state.
- Rate limiting (Cloud Function, by IP, per link).

## 6. Host edit page

Shows the invitation exactly as a guest sees it, with "Edit text" and "Save"
floating over the field.

- Clicking **Edit text** hides both buttons and replaces the RSVP panel with the
  edit form. The form's only exit is a **Close** button in its header.
- The panel must have the same width the the rsvp form (the edge included) Do not animate the width —
  the invitation must not move when toggling. Only the background colour
  transitions.
- On mobile the form is a full-height sheet.
- The form is generated from `template.fields` (labels, max lengths), so a
  different template yields a different form with no page changes.
- Inputs update the card live.

### Not yet implemented

- **The blocking save warning.** Per spec, saving a non-Hidden invitation
  requires acknowledging that guests will not be notified, showing the current
  RSVP count, with agree/cancel. Save currently just saves. This must be added
  before release.
- The 24h edit lock (content and template are editable until 24h before the
  event).
- Design-editing entry point (Type 2 only).

## 8. Design constraints for template authors

- Minimum text size roughly **2.2% of the design width** (≈ 24px at 1080). Below
  that, text becomes unreadable at small scales, since scaling has no concept of
  a legibility floor.
- Hairlines: author rules at **3–4px**, not 1px. At `minScale` a 1px rule can
  round to zero and vanish.
- `minScale` exists as a readability floor. Below it the stage scrolls rather
  than shrinking further. Tune per template.

## 9. Acceptance checks

1. Resize from 320px to 2560px wide: the card changes size only; no element
   inside ever moves relative to another, and nothing wraps differently.
2. Cross the 900px breakpoint: the RSVP moves between right panel and bottom
   bar; the card refits; no code path is breakpoint-specific inside the card.
3. Toggle the host edit form: the invitation does not move at all.
4. Confirm the card is horizontally centred in the visible field, with the
   edge strip counted as panel width.
5. Add ten names in the RSVP form: the panel scrolls, nothing is clipped.
6. Throttle to slow 3G and reload: confirm no flash of an unscaled card.
