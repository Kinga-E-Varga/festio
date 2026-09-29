# Current Feature: Card shadow, tab hover, Active = shared

The invitation card's shadow set per template, a hover colour on the event tabs, and Active holding only Public/Protected events.

## Status

Completed

## Goals

- A template sets `design.shadow: 'light' | 'dark' | null`; `ScaledStage` leaves a strip around the card (design px) so the shadow is never cut off, and it shrinks with the card. `null` = no strip, no shadow
- Wolf-dance card loses its `p-7`; page padding moves to the wrapper around `ScaledStage` in `Invitation.tsx` (not on `.stage`) — `p-1`, on top of the shadow strip
- Inactive event tabs get `hover:bg-forest-200` (#D6E2D2) and a `forest-500` bottom border on hover, the divider's colour; tab bottom border 3px (was 2px) — Events and Invitations tabs both
- Status (past / active / draft) is worked out in one helper in `src/lib/event.ts` from the date, `paid` and visibility; the stored `status` goes. Active = paid and Public or Protected; draft = unpaid or Hidden
- `Events.groupActive`, `groupDraft`, `emptyDrafts`, `emptyActive` updated in EN, RO and HU to match the new rule

## Notes

- Spec: `context/fixes/card-shadow-active-status.md`
- Accepted: a paid but Hidden event leaves the dashboard home and its warnings leave the notifications rail
- Shadow is screen only — print doesn't go through `ScaledStage`
- With `p-7` gone the wolf-dance content gets 28px more room per side — check it in the browser. The printable is unaffected: `/prints` draws its own card and never renders the template's `Card`
- `Invitations` texts and `EventEditor.draftTitle` / `draftBody` stay as they are

## History

<!-- Keep this updated latest to earliest -->

- Simplify codebase — a quality-only cleanup of all of `src/`, one chunk at a time, with a plain-language review and a possible-bugs list in `context/reviews/2026-09-29.md`
- Event package — one Free / Standard / Custom package in place of tier + invitation type, named package everywhere (HU csomag, RO pachet); Custom unlocks every template; package texts restored in the edit page; event row actions reordered with shorter HU/RO edit labels
- Reply editor — edit a reply with every RSVP question (age, diet with None/Other, the host's questions, reply-wide answers with Separate from group); New reply with several people; unsaved-changes guards shared with the list box and a leave-page warning; custom answers and the message in the reply details; keyboard diet dropdown
- Preloaded guest list — the list box as a draft editor: paste and add names, an A→Z list with a sticky search, × for waiting names and "replied" for the rest, Save / Cancel with unadded-names and discard prompts; opens above the list buttons, fades in and out; one shared gold button colour
- Guest summary — the guest list page's Summary: Replies, Age and Dietary needs tables, custom question answers and messages behind a Show/Hide toggle, an Other diet option, and mock custom questions on the engagement
- Guest list row design — one sheet with category sections, reply threads, a Needs your attention section for unknown and identical names, foldable reply details, a header that gives up space in order, and Summary / Guest list page sections
- React Grab — dev-only tool to copy an element's component and file location for Claude Code
- Event guest list — one page per event with the merged list, categories, Unknown/Duplicate resolving, inline editing, pasted names and invite-sent tracking; BACK falls back to each page's own list
- Safety features — clean slug-only links, the Protected password on the printed card, expected guests with a hidden reply cap, reply-form closing, and one set of warning texts for banners and the notifications rail
- Language / i18n — Romanian and Hungarian for the host app and guest invitations, each invitation with its own language
- Invitation print page — a flat or folded printable at `/prints`, with its own settings form
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
