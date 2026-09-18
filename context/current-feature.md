# Current Feature: Type 1 invitation page and editing platform

<!-- One line: what is being built or fixed. -->

Guest invitation page and host text-editor for Type 1 invitations, built on a fixed-size template card that scales uniformly.

Spec: `context/features/type-1-invitation-basics.md`

## Status

In Progress

## Goals

<!-- What must exist when this is done. -->

- **`ScaledStage`** — shared infrastructure module (not per-template). Measures its own container with `ResizeObserver` (never the viewport), `scale = clamp(minScale, min(slotW/designW, slotH/designH), maxScale)`, outer normal-flow placeholder + inner absolutely-positioned transformed node with `transformOrigin: "top left"`, `visibility: hidden` until first measure, `useLayoutEffect`, ignores sub-0.0005 scale changes. Sets `flex: 1; minWidth: 0; minHeight: 0`.
- **One mockup Type 1 template file** exporting `template` (id, display name, `type`, `minTier`, `eventTypes`, `design: { width, height }` = 1080 × 1532, `printSize`, `palette`, `fonts`, `edge`, `fields`) plus the card component taking `{ values }`. No registration step elsewhere.
- **Guest page** — flex row ≥ 900px, flex column below. Card horizontally centred in the visible field, edge strip counted as panel width.
- **RSVP surface** — desktop: fixed right panel, always visible, 1/3 of viewport width clamped to 400–700px. Mobile: bottom bar opening a drawer. CSS-painted decorative edge (wavy in the demo), max 40px, inside the declared panel width.
- **Desktop reveal interaction** — message + outlined "RSVP NOW" button; on click the button collapses and the form expands via `grid-template-rows: 0fr → 1fr` (never `max-height`). The message keeps constant size and becomes the panel title; no separate "RSVP" heading.
- **Type 1 RSVP form** — one or more name rows ("+ new person", rows after the first get a remove control), a single submission-level going / not-going choice, an optional 300-char note for the hosts, submit. Payload: `{ attendees: [{ name, status }], answers: { q_note_host: string | null } }`.
- **Host edit page** — invitation exactly as the guest sees it, with floating "Edit text" / "Save". Edit text hides both buttons and swaps the RSVP panel for the edit form, exited only via a Close button in its header. Same width as the RSVP panel including the edge; only the background colour transitions, never the width. Full-height sheet on mobile. Form generated from `template.fields`; inputs update the card live.
- **All 6 acceptance checks** in the spec pass.

## Notes

<!-- Decisions, constraints, open questions, known limitations. -->

### Hard constraints

- **Inside a template file, plain px only.** No `%`, `vw`, `em`, `rem`, `cqw`, and no Tailwind responsive prefixes — a breakpoint inside the card fires on viewport width, which is unrelated to the painted card size. Reflow within the fixed canvas is fine (flex column + `gap` + conditional rendering for blank fields).
- Both `min-width: 0` and `min-height: 0` on the stage are mandatory; without them the flex item won't shrink below 1080 × 1532 and pushes sibling chrome off screen. Most common failure when adding page chrome.
- **Palette is public template surface**, not a private detail. RSVP chrome is styled from `template.palette`; Festio's own palette and fonts must never appear on the guest page. Palette needs surface, on-surface text, action fill, on-action text, and input underline — paper/ink/accent alone is insufficient.
- Author text at ≥ ~2.2% of design width (≈24px at 1080); hairlines at 3–4px, not 1px. `minScale` is a readability floor — below it the stage scrolls.

### Palette shape — DECIDED

Numbered keys, exactly five for now, no extras and no dev-time contrast check:

```ts
interface Palette {
  color1: string;  // surface
  color2: string;  // on-surface text
  color3: string;  // action fill
  color4: string;  // on-action text
  color5: string;  // input underline
}
```

Roles are positional and load-bearing — the shared RSVP chrome reads them, so reordering a template's palette changes the guest form. `color1` not `color-1`, so it stays `palette.color1` rather than bracket access.

How to extend beyond five (decorative colours used only inside the card, variable count per template) is deliberately deferred until the existing real templates are moved into template objects. Likely route when it comes: a `[key: \`color${number}\`]: string` pattern index signature, and generating `--color-N` CSS custom properties on the card root so Tailwind arbitrary values can reference them — dynamic colours can't be Tailwind class names.

### SSR

Card is invisible until hydration measures it. If the gap shows on a cold mobile load, size the placeholder server-side with a CSS `min()` / `aspect-ratio` fallback so the frame is right on first paint. Do not try to remove the JS — CSS cannot divide a length by a length to produce the unitless scalar `scale()` needs.

### Answer scope — DECIDED (supersedes the spec's open question)

The spec proposed a submission-level `answers` map as a sibling of `attendees`. **Rejected. There is no submission scope in v1** — every answer is attendee-keyed.

Attendees are split apart before the write: **one document per attendee**, not one per submission. The host note is copied onto each attendee of the submission, so `q_note_host` freezes at **attendee** scope. Type 2 party-level questions fan out the same way.

```js
// attendees/{attendeeId}
{
  eventId: "...",
  submissionId: "sub_7fa2",        // shared by everyone who replied together
  name: "Ana",
  status: "going",                  // fixed core: name + status, always present
  answers: { q_note_host: "We'll arrive later" },
}
```

`submissionId` is stamped at write time on every attendee of a submission. Splitting otherwise destroys the fact that these people arrived together, and it is not recoverable afterwards. It lets the guest list show the note once per party rather than once per person, apply a host edit across the party, and feeds the seating chart's "must stay together" grouping.

**Why split rather than one doc per submission:** it keeps attendees queryable across events (returning guests, dedup, per-host guest history), which the grouped shape makes impossible without restructuring. Accepted costs: the note is duplicated per attendee and can diverge if the host edits one copy, and reads/writes are ~2.5× the grouped shape — negligible in absolute terms (~$0.0002 per event).

Consequences to honour:

- Questions not asked in Type 1 (diet, age group, …) are simply **absent** from `answers` — missing key = never asked. Nothing is written as null.
- A host upgrading to Type 2 later starts asking new question IDs; existing attendees lack those keys, which correctly reads as "never asked". No migration, no backfill.
- Host edits to a fanned-out answer should apply across the `submissionId`, not to one row, or the copies diverge.

### Metrics

Counts come from Firestore **aggregation queries**, not denormalised counters — a counter drifts when a write fails, when host CRUD forgets to increment, or when GDPR auto-deletion removes records:

```js
count(where eventId == id, where status == "going")   // 1 read per 1000 index entries
```

Requires a composite index on `(eventId, status)` in `firestore.indexes.json`, added up front — Firestore throws at runtime if it is missing.

### Not blocking this feature

Firebase is not installed yet (no `firebase` / `firebase-admin` in `package.json`, no Firestore code). The Type 1 page and editor can be built against local state; the schema above applies when the write is implemented.

### Out of scope for this feature

- Duplicate-name handling on submit.
- RSVP auto-close 24h before the event (panel should later show a closed state, not disappear).
- Cancelled-event page (replaces the whole invitation, not a panel state).
- Rate limiting (Cloud Function, by IP, per link).
- Blocking save warning for non-Hidden invitations (must exist before release).
- The 24h edit lock.
- Design-editing entry point (Type 2 only).

## History

<!-- Keep this updated latest to earliest -->

- Events list — "Edit invitation" label + safeguard/dates info
- Scanner fixes — cart badge + safeguard bar helper
- Dashboard events + event edit pages
- Dashboard redesign
- Dashboard UI
- Initial setup
