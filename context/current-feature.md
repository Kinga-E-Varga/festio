# Current Feature: Scanner fixes — cart badge + safeguard bar helper

<!-- One line: what is being built or fixed. -->

Two findings from the code-scanner sweep: the cart badge is hardcoded, and the
safeguard bar maths is duplicated across two components.

## Status

In Progress

## Goals

<!-- What must exist when this is done. -->

- The top bar cart badge and its `aria-label` derive their count from the events
  data, the way the bell badge already derives from `ATTENTION_NOTICES.length`.
- The attending/declined safeguard bar percentages live in one place
  (`src/lib/event.ts`), used by both `EventCard` and `EventSummary`.
- `npm run build` and `npm run lint` pass.

## Notes

<!-- Decisions, constraints, open questions, known limitations. -->

- Cart count comes from `EVENTS.filter((event) => !event.paid).length`, which is
  1 against the current mock data — so no visible change today, only the drift
  is removed.
- Pluralisation follows the existing inline-ternary pattern
  (`EventRow.tsx:42`, `DetailsSection.tsx:115`), not a new helper.
- Open question: the cart badge still renders a `0` bubble when nothing is
  awaiting payment. The bell behaves the same way, so leaving both alone keeps
  them symmetric — raised with the host rather than changed unasked.
- The new helper returns `CSSProperties` so the two call sites stay identical;
  it takes a structural param like the existing `invitationLink(event)`.

## History

<!-- Keep this updated latest to earliest -->

- Dashboard events + event edit pages
- Dashboard redesign
- Dashboard UI
- Initial setup
