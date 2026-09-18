# Current Feature

Restructure the invitation composition so the card + RSVP pairing is owned by one
component, and remove the duplicated desktop/mobile panel trees.

## Status

In Progress

## Goals

The structure this is moving toward, in plain terms:

- **The card** is the invitation artwork. On its own it is the print artifact —
  nothing else. It is the only piece that varies per template.
- **The Invitation** is card + reply panel, always both. There is no case where
  the card is shown on a page without the reply panel. Print does not use the
  Invitation at all; it uses the card directly.
- **Editing** is not a frame around the Invitation. It is an extra layer the
  Invitation accepts and draws inside itself. The state lives above; only the
  rendered surfaces go in.

Layout rules, unchanged from what already ships (do not "improve" these):

- Desktop (>= 1000px): reply panel on the right beside the card.
- Desktop editing: the edit form slides in from the right and **covers the reply
  panel completely and opaquely**. The reply panel is not dimmed, faded, scaled
  or hidden — it is simply covered. Both panels are the same width and carry the
  same `.edge` shape, so the scalloped edge is covered by an identical edge and
  reads as seamless.
- Below 1000px: the reply panel is a bottom bar that drags out into a drawer.
  The edit form does **not** take the reply panel's place — it still slides in
  from the right and covers the whole screen.

## Instructions

One branch, one commit at the end. The steps below are a work order, not commit
boundaries — do them in this sequence, but keep it all as a single change.
Step 4 is conditional; decide at the end whether it still applies.

---

### 1. Fix — dead breakpoint variant and the mobile inert gap

Small, independent, no structural change. Do this first so the restructure
starts from correct behaviour.

**1a.** `HostInvitationEditor.tsx` — the Edit/Save wrapper uses
`invitation:top-10 invitation:left-10`. There is no `--breakpoint-invitation`
in `globals.css` (only `nav` 820px, `invite` 1000px, `rail` 1400px). Tailwind v4
silently drops utilities with an unknown variant, so these two produce no CSS
and the buttons sit at `top-5 left-5` at every width.

Decide which breakpoint was intended and use its real name. `invite:` is the
likely one — it is the width at which the panel moves beside the card and the
card gains room. Confirm visually before committing.

**1b.** `RsvpPanel.tsx` — `inert` is applied only to the desktop `<aside>`. The
mobile bottom-drawer block does not get it. So when the host opens the editor on
a narrow screen, the full-screen edit form covers everything visually, but the
reply drawer's "Respond" button is still in the tab order behind it.

Apply the same `inert` to the mobile block. Note the inner scroll div already
has `inert={!open}` for its own open/closed state — these are two different
things and both need to hold; the panel must be inert if _either_ the host is
editing or the drawer is closed.

---

### 2. Restructure — the Invitation owns the reply panel

**2a. Rename `InvitationFrame` to `Invitation`.** It is no longer just a frame;
it is the pairing.

**2b. It builds the `RsvpPanel` itself.** Remove the `panel?` prop. The
component takes `template` and `values` and renders the reply panel internally.
Add `onSubmit?` so the reply can be handed upward when that gets wired up.

Reason: `panel?` is typed optional but both call sites pass it, and the rule
above says they always will. Print takes the card directly and never reaches
this component, so there is no case that needs the panel absent. An invariant
should not be a prop.

**2c. Collapse `panel` and `overlay` into one `host?` slot.** It is rendered
last inside the root div, and `HostInvitationEditor` fills it with the
`EditPanel` plus the Edit/Save buttons.

`overlay` today exists only to give absolutely-positioned content a positioning
context. That context is the `relative` div wrapping `ScaledStage`, which starts
at x=0 of the root — so `absolute top-5 left-5` resolves to the same place
against the root. One slot is enough.

The host layer must render **inside** the root div, not wrap it. Three reasons,
all load-bearing:

- the palette vars (`--c1`…`--c5`) and the font classes are set on the root div,
  and everything in `styles.ts` is built from them
- `EditPanel`'s desktop `invite:absolute invite:inset-y-0 invite:right-0`
  anchors to the nearest positioned ancestor, which is the root div
- while closed, `EditPanel` sits at `translateX(100%)` and is only invisible
  because the root has `overflow-hidden`. Outside it, it would overhang the page
  and create a horizontal scrollbar.

**2d. The card stays a `children` slot. Do not move card mounting into
`Invitation`.**

The guest page renders the card on the server (`<Card>` from `loadTemplate`) and
passes it in; the host editor renders `<TemplateCard id>` in the browser because
it must redraw as the host types. Keep both. Project rule is server-rendered
unless client rendering is required, and guests are the common case — there is
no reason to ship template code to a browser that will never redraw the card.

This works because a server-rendered element passed as `children` into a client
component stays server-rendered; React does not re-render it in the browser.
`Invitation` is `'use client'` (it needs `ScaledStage` to measure), and that is
fine.

Accepted cost: two card-mounting paths means the host's card and the guest's
card could in principle differ. Both feed through the same `cardValues(values)`,
so the content cannot diverge — only render-time details like font or image
loading could. Accepted knowingly.

**2e. Add a `replyInert?: boolean` prop.** Its only job is switching the reply
panel inert (both blocks, per 1b).

Name it for what it does, not why it was asked for. `Invitation` does not need
to know that "editing" is a concept — it only needs to know how to go quiet when
told. `HostInvitationEditor` passes `replyInert={editing}`.

This is the only signal that crosses the boundary. Everything else flows one
way: values down, host layer down.

**2f. Update both call sites.**

- `src/app/[invite]/page.tsx` — becomes
  `<Invitation template={template} values={values}><Card values={cardValues(values)} /></Invitation>`.
  It no longer constructs `RsvpPanel`; drop that import.
- `src/components/invitation/HostInvitationEditor.tsx` — passes the card as
  children, `EditPanel` + the Edit/Save buttons as `host`, and
  `replyInert={editing}`. It keeps `values` and `editing` state and keeps wiring
  `onChange`/`onClose`/`onSave` into `EditPanel` — the host layer is not
  self-contained and is not meant to be.

**Do not change:** the edit form stays always-mounted and parked at
`translateX(100%)`, and the Edit/Save buttons stay always-mounted and fade. Both
animate on open/close, and conditional rendering would leave nothing to animate
— they would pop instead of slide.

---

### 3. Fix — one panel tree per panel, not two

Both `RsvpPanel` and `EditPanel` render the same content into two separate
shells: a desktop box (`hidden invite:flex`) and a mobile box (`invite:hidden` /
`fixed inset-0`). The content itself is written once in each file (`Reply`,
`body`) — that part is fine. The problem is that both shells are always in the
DOM, with one switched off by `display: none`.

**The bug this causes:** every `id` exists twice. `id="rsvp-note"` in
`RsvpForm`, and `id={\`field-${field.id}\`}`in`EditPanel`'s `Field`, for every
template field. A `<label htmlFor>` resolves to the first match in the document,
and the desktop shell is written first — so on a narrow screen every label
points at an invisible copy and **clicking a field label does nothing**.

Secondary: `RsvpForm` holds its own `attempted` state, so the two copies track
validation separately. (`useRsvpForm()` is called once in the parent, so the
answers themselves are already shared — the duplication was half worked around
already.)

**The change:** render one shell per panel whose position and slide direction
change at the breakpoint, instead of two shells with one hidden.

The obstacle is that the transform differs by mode — desktop slides on X, mobile
on Y — and an inline `style` cannot be breakpoint-conditional. Solve it the way
this codebase already solves the same problem: put a data attribute on the panel
and write the two transforms in `globals.css` behind a media query. `.edge[data-shape]`
and `.reveal[data-open]` are the existing precedent; follow that shape rather
than inventing a new pattern.

Preserve exactly: the existing easing and durations (420ms for the edit panel,
800ms for the reply drawer, both on `cubic-bezier(0.22,1,0.36,1)`), the
`translateZ(0)` compositing hints and the `.edge` negative margin. Those exist to
stop a hairline of page background flashing through the seam mid-transform —
`globals.css` around the `.edge` rule explains it. If the seam artefact appears
after this change, that is why.

**Verify after:** on a narrow screen, clicking a field label in the edit form
focuses that field. On both widths, open/close still slides rather than jumps.

---

### 4. Conditional — shared panel shell

**Only if it still looks worth it after step 3. Re-evaluate; do not do this
automatically.**

`RsvpPanel` and `EditPanel` build nearly the same box: `PANEL` width, an `.edge`
div, a `bg-[var(--c1)]` scrolling body, the same slide. That could be one shell
component taking the content as children.

Reasons to reconsider at that point:

- step 3 may already have absorbed most of the repetition into CSS, leaving
  little in the components to share
- the two panels may be about to diverge — the edit panel is host-only and will
  likely grow structure (Type 2 sections, image fields) the reply panel never
  has. Extracting a shared shell right before a divergence is worse than leaving
  the repetition.

If the shells are still near-identical after step 3 and nothing imminent is
about to split them, extract. Otherwise leave it and note the decision here.

**Decided: not extracted.** Step 3 moved the part the two panels actually
shared — the box's placement, slide direction, duration and easing — into
`.reply` and `.edit` in `globals.css`, and those two rules differ in every
line: fixed-bottom vs fixed-inset, translateY vs translateX, 800ms vs 420ms,
static vs absolute above the breakpoint. What is left in the components is an
`<aside>`, an `.edge` and a scrolling body, and even those diverge — the reply's
edge turns at the breakpoint and is left unpainted, the edit panel's is painted
and absent below it; the reply carries an in-flow spacer the edit panel has no
use for. A shared shell would take a prop for each of those, which is the whole
of it. Only `PANEL` is genuinely common, and it is already shared.

## Notes

Decided in discussion, so these do not need re-litigating:

- No dimming, scrim, blur or scale on the covered reply panel. Earlier drafts of
  this discussion proposed it; it was not wanted. The edit form covers opaquely
  and that is the whole treatment.
- Frame-within-frame nesting was considered and rejected. Nesting implies
  containment, and the edit form does not contain the invitation — it lies over
  part of it. It is expressed as "the Invitation accepts a host layer".
- The RSVP breakpoint is **1000px** (`--breakpoint-invite`), not 900.
- Print is out of scope for this work. It is noted here only because "print uses
  the card alone" is the reason the reply panel can be a non-optional part of
  the Invitation.

Open, not blocking:

- `AGENTS.md` warns this Next.js version has breaking changes and that the docs
  in `node_modules/next/dist/docs/` are authoritative. Check the server/client
  component guide there before relying on the "server children inside a client
  component stay server-rendered" behaviour in 2d.

## History

<!-- Keep this updated latest to earliest -->

- Type 1 invitation page and editing platform
- Events list — "Edit invitation" label + safeguard/dates info
- Scanner fixes — cart badge + safeguard bar helper
- Dashboard events + event edit pages
- Dashboard redesign
- Dashboard UI
- Initial setup
