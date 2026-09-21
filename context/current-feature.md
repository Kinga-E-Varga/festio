# Current Feature

## Status

In Progress

## Goals

- Move the host's Edit/Save controls from the invitation's top-left corner to
  the middle of the card's own viewing panel.
- Make them one bar rather than separate buttons: Back and a dismiss X either
  side of Edit and Save, separated by lines, on a single surface.
- Keep the bar reachable while the edit form is open.
- Let the host dismiss the bar entirely to see the card as a guest sees it,
  with a small handle at the top of the page to call it back.
- Make Edit a toggle that holds its state and closes the form on a second
  click.
- Send Back to whatever Festio page the host came from, and to the landing
  page when they came from outside.

## Notes

- The bar centres over the card's slot, not the invitation: the reply
  surface's width moved out of the `PANEL` class string into
  `--spacing-invite-panel`, so the panel that claims that width and the
  controls that centre themselves over the remainder read one number.
- Tailwind settles conflicting utilities by emit order, not by class-string
  order — `px-0` after `px-5` lost, which collapsed the icon buttons and hid
  their glyphs. Every variant here is now built by omission from
  `BUTTON_CORE`/`INPUT_CORE` rather than by override, and the Edit toggle's
  active fill is a `data-active` attribute, which outranks the base utility on
  specificity instead of on ordering.
- Back is history-aware. The App Router keeps no depth counter and
  `document.referrer` does not update across client navigations, so
  `lib/history.ts` stamps each entry with how many Festio pages lie behind it
  and `HistoryTracker` in the root layout keeps that count. It can only ever
  undercount, so the failure mode is landing on the home page, never leaving
  the site.
- The date-format dropdown takes the panel's own surface and its option list
  the inverse. The picker is a native OS widget, so the hovered row keeps the
  system accent in Chrome whatever the rules say — `appearance: base-select`
  would fix that, but it was tried and reverted.

## History

<!-- Keep this updated latest to earliest -->

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
