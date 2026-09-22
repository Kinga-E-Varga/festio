# Current Feature: Invitation print page

## Status

Completed

## Goals

- New route `/prints/[id]`, reached from the print button on a card on the invitation edit page. Own page, outside the dashboard layout.
- Layout mirrors `HostInvitationEditor.tsx`: same host action bar (no X button; "edit" → "save", "save" → "print") and the same edit panel design.
- Save and print buttons only fire a toast for now.
- Print edit panel collapses only on small screens; the form's view button shows only there.
- Print edit form: flat card / folded card choice, "coloured background" checkbox (on by default), two text inputs (bigger font, defaults to the invitation's `rsvpMessage` as a fallback only — separate data; smaller font, defaults to "Please respond on the link provided below.").
- Printing-information box whose text swaps with the card type but whose size never changes.
- Main viewing area shows an animated card instead of the `TemplateCard`: flip animation for flat card (note: click to flip), fold animation for folded card (note: click to open / click to close).
- Only Maria & Andrei gets a working print page for now; front art is `src/mock/inv-img/Screenshot 2026-07-27 213629.png`.

## Notes

- Full spec: `context/features/print.md`, including the reference HTML/CSS for both animations. Use only the parts of that reference that fit our stack (React + Tailwind v4 tokens, no inline styles).
- The big-text input defaults from `rsvpMessage` but stores its own value — editing it must not touch the invitation's RSVP message.
- Flat card copy: two images, front and back, printed on the two sides of one sheet, no folding, A6–A5.
- Folded card copy: two images, one per side, printed on both sides then folded in half, front ends up outside, A5–A4 before folding.
- Save button of the form *is* the host action bar's save button.
- Action bar is [Back] [Edit] [Save] [Print]; the Edit segment is hidden above 1000px, where
  the panel is always in flow and cannot collapse. The form's View button is hidden there too.
- Folded card: cover art on the flap, both text lines plus the link on the inside-right page,
  inside-left is the blank reverse of the cover.
- Only Maria & Andrei is reachable because it is the only event with a `templateId`; the route
  and the card's Print link are both gated on that rather than on the id.

## History

<!-- Keep this updated latest to earliest -->

- Host action bar — one bar over the card: back, edit toggle, save, dismiss
- Invitations page — grid of invitation cards, plus one-record arrivals from Events and the dashboard
- Dashboard & events UX fixes — header action, card restack, warning-only tags
- Dashboard design fixes — stats, card/list layout, editor banners, focus rings
- Invitation composition — card + reply in one component, one tree per panel
- Type 1 invitation page and editing platform
- Events list — "Edit invitation" label + safeguard/dates info
- Scanner fixes — cart badge + safeguard bar helper
- Dashboard events + event edit pages
- Dashboard redesign
- Dashboard UI
- Initial setup
