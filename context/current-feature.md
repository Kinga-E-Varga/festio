# Current Feature: Dashboard & Events UX Fixes

## Status

In Progress

## Goals

### Dashboard main page

- Add an "Add event" button on the right side of the header (next to date / "Bună, Maria"); on small screens it moves under "Bună, Maria" — it must not collapse into a bare "+".
- Remove the "Your next invitation locks for editing tomorrow — 24 hours before the event" line.
- Under "YOUR EVENTS", add explanatory copy: each event is one record and one purchase, and each event has an invitation with a response form for tracking and managing guests.
- Rename "Your events" to "Your active events" and remove the tabs — only active events are shown.
- Move the 5 action buttons off the dashboard event card (they move to the Events page list).
- Make the whole event card a button that navigates to Events and scrolls to the clicked event. Give it a good hover state that does **not** change the card background colour.
- Show when the response form closes — date only, unless a real time is set (not 00), in which case show the time too. Apply the same show/hide-time logic on the Events page.
- Under the attendee safeguard (and under any warning such as "5 names didn't…") add attendee breakdown notes, e.g. "6 children and 2 babies among the attendees", "x with vegan dietary needs".
- Remove all non-warning tags next to the warning tags; make warning tags more direct ("editing locks in 30 hours"), and add comparable warnings such as "safeguard at 80%" and "RSVP closes in x days".
- Remove the "raise cap" button below the attendee bar.

### Events page

- Use the same "Each event is one …" copy as under "YOUR ACTIVE EVENTS" on the dashboard.
- Split the events list into cards, like the dashboard.
- Those cards carry the 5 buttons moved off the dashboard card, plus a 6th "Edit invitation" button placed after "Edit". Stack them cleanly on small screens.
- Events page cards have **no** hover state.
- Card layout: image on the far left; to its right a column with event details (date, tags — protected, custom — but no warning tags), and below that the RSVP section taken as-is from the dashboard card, except: keep the raise link, and omit the extra info lines (unmatched names, children attending, etc.). "Dates that matter" sits in its own column on the far right, styled the same way as in the current event-editing card. - might fine-tune after.

### Dashboard nav

- Hosting: Dashboard, Events, Invitations.
- Studio: Prints and downloads, Templates.

## Notes

- Source spec: `context/fix/UX-fixes.md`.
- Scope is UI/UX only — no schema or data-model changes.
- Base app palette and fonts from `context/project-overview.md` apply (these are app UI surfaces, not invitations).
- Open questions to resolve at `start`: exact wording of the shared "Each event is one …" copy, which warning tags are in scope, and where the attendee breakdown data comes from.

## History

<!-- Keep this updated latest to earliest -->

- Dashboard design fixes — stats, card/list layout, editor banners, focus rings
- Invitation composition — card + reply in one component, one tree per panel
- Type 1 invitation page and editing platform
- Events list — "Edit invitation" label + safeguard/dates info
- Scanner fixes — cart badge + safeguard bar helper
- Dashboard events + event edit pages
- Dashboard redesign
- Dashboard UI
- Initial setup
