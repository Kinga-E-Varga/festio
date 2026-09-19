# Current Feature: Dashboard Design Fixes

## Status

In Progress

## Goals

### Dashboard main page

- Rework the summary box to show: live invitations (x of y), next event (in 2 days), new replies (x since last), unmatched names (x unknown — "unknown" styled like the other small texts).
- Event card: give the left-hand "replies" section a bit more room on wide screens.
- Event card: match the button style to the "Edit invitation" button on the Events page; both get `#D6E2D2` as hover background.
- Event card, past event: if data is deleted, show only the free/standard/custom tag — no buttons, no link password. If data is not yet deleted, the edit button is disabled.

### Events page

- "Add event" button: same colour as the "Edit event" button, and pinned left even on small screens (icon-only, so it fits).
- Event list row layout: image on the left; to its right a column with date (plain date, not "in x weeks"), title, tags (drop "locks in…"), then the replies bar styled like the event editing page ("82 replies received against a 100 cap"), then the "dates that matter" section separated by a thin rule. Buttons (Edit event, Edit invitation) on the far right, vertically centred.
- Date and tags render larger here than on the dashboard event card.

### Event editing page

- Drop the Pending number from the summary card.
- Drop the unmatched-names box; shrink the image so buttons + image visually match the height of the card's left side on wide screens.
- Rename the Design button to "Edit invitation".
- Unpaid event: no "Cancel the event" action, and the "This draft is unpaid…" banner switches to the same colour as the "Editing closes in …" banner.
- Paid but hidden event: add a banner in that same colour telling the host the invitation is unreachable.
- Remove the "Open the invitation" button.
- Invitation address: the editable part gets the same light background as other input fields.
- Any thick focus outline on an input must use the same colour as that input's default border.

## Notes

- Spec source: `context/fix/design-fixes.md` (the file passed in, `context/fix/pending-design-fixes.md`, is empty).
- Pure UI/design pass — no data-model or schema changes.
- Anything not explicitly specified: choose whatever reads as visually clean and consistent with the existing design system.
- Palette is restricted to the base app palette in `context/project-overview.md`.
- Both the unpaid and the new hidden notice use the existing `Banner` (`src/components/dashboard/event-editor/Banner.tsx`) with `tone="warn"` — the terracotta tone the "Editing closes in …" banner already uses.

## History

<!-- Keep this updated latest to earliest -->

- Invitation composition — card + reply in one component, one tree per panel
- Type 1 invitation page and editing platform
- Events list — "Edit invitation" label + safeguard/dates info
- Scanner fixes — cart badge + safeguard bar helper
- Dashboard events + event edit pages
- Dashboard redesign
- Dashboard UI
- Initial setup
