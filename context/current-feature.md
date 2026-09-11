# Current Feature

<!-- One line: what is being built or fixed. -->

Dashboard Events page + Event edit page, built to the prototyped artifact's design (plus a few small dashboard fixes).

## Status

In progress

## Goals

<!-- What must exist when this is done. -->

- Dashboard **Events page** laid out per the referenced artifact design.
- **Event edit page** laid out per the referenced artifact design.
- Both fully responsive, using our own breakpoints (not the artifact's).

Small fixes alongside:

- Rearrange the dashboard nav buttons to match the artifact.
- Dashboard > main page > event sum-up box (Live invitations … unmatched names): take the design from the artifact.
- Dashboard > main page > event card: left thick border colour `#51644A`.
- Notifications bar: change `Your account and printable PNGs stay.` → `Your account stays.`
- Dashboard > main page > Your events tab: inactive buttons must have no background colour.

## Notes

<!-- Decisions, constraints, open questions, known limitations. -->

- Full spec: @context/features/dashboard-event-event-page.md
- Artifact reference: https://claude.ai/code/artifact/fb5d8c95-a769-480a-b4b1-c485bb94998b?org=28204eef-360c-45a6-9676-662dc4a99070&sk=YiHOuomOmtH9odn2-TvV4w
- Use the artifact's **design only** — its code is prototype quality and must not be reused.
- Scope is limited to the events page, event edit page and the small fixes above; ignore all other parts of the artifact.
- Where artifact colours differ from the app palette, snap to the nearest palette colour (see @context/project-overview.md).

## History

<!-- Keep this updated latest to earliest -->

- Dashboard redesign
- Dashboard UI
- Initial setup
