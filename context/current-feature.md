# Current Feature: Safety features

Clean guest links, the Protected password on the printed card, expected guests with a hidden reply cap, reply-form closing, and one set of warning texts for the editor and the notifications rail.

## Status

Completed

## Goals

**Clean links**

- Guest links are the host's slug only: `festio.eu/maria-birthday`. No random digits.
- Slugs are unique across Festio. If one is taken, the editor shows an error and suggests free alternatives (the event's year, then `-2`, `-3`).
- Slugs that clash with app routes are rejected: `dashboard`, `invitations`, `templates`, `prints`, `invite`, `api`, every locale code. The list lives once, in `src/lib/slug.ts`; `next.config.ts` builds its rewrite from it.
- The Public and Protected visibility texts tell the host what Public exposes (the link can reach uninvited people; address, date and every detail are visible) and that the Protected password is printed on the card.
- `digits` is gone from the event type, mock data and the link helpers.
- Guest links resolve without a locale prefix and never collide with host-app routes.

**Password on the printed card**

- A Protected invitation's printable shows the password on its own line, directly below the link, on flat and folded cards.
- The line follows the invitation's language (`Print` catalog). Public and Hidden invitations print no password line.

**Expected guests (replaces the attendee safeguard)**

- The editor asks "How many guests do you expect?" (people, required). The hint says it drives the replies view, protects from spam, pauses the form if far more replies come in, and can be raised anytime.
- It can't be set below the replies already in.
- The real reply cap is hidden: the larger of expected + 50% or expected + 20.
- Replies show against expected, e.g. `46/40`, and may pass 100%.
- Single replies meter (editor): normal below 80%, terracotta from 80%, red from 100%.
- Yes/no bar (cards, events list): green and orange until 100%, then full and all red.
- Card tag: "Replies at X% of expected" from 80% up to 100%, "More replies than expected" above 100%. Tags keep their own texts, separate from banner titles.
- Editor banner: the same two states, or "Replies are paused" once the hidden cap is hit. Only one replies banner shows at a time.
- Paused: a box on the dashboard card, a banner in the editor, a notice in the rail. Guests see a neutral "Replies are closed for now. Please contact the host."
- From 100% of expected, a "Report unusual replies" link sits inline after the banner and rail text (not on the card). It points to a draft page at `/dashboard/events/[id]/report`.

**Reply-form closing**

- The form closes at the host's custom time when one is set, otherwise the day before the event at 00:00. The custom time is saved on the event (`repliesCloseAt`).
- Within 7 days of closing: a "Replies close in …" notice and editor banner. After it: "Replies closed on …". Texts say whether it was the custom time or the default.
- The card's "Reply form closes …" line turns terracotta when closing soon, and reads "Replies closed …" once closed. Past events always count as closed.

**Notifications rail**

- Rail notices use the editor banners' titles and bodies (`EventPage.<key>Title` / `<key>Body`), word for word. `Notices` holds only the rail's event name and action.
- Every notice names its event after a middle dot: "Replies at 87% of expected · Maria & Andrei".
- Reply, closing and editing notices are built from the events' own data, never written by hand.
- Order by urgency: rust (unmatched, paused), then terracotta (expected), mustard (editing and reply closing), teal (unpaid).

**Mock data**

- Botez Sofia: exactly 70/70 replies (100% of expected, not paused).
- Maria & Andrei: replies close in 30 hours on the default time.

## Notes

- A plain array of rewrites in `next.config.ts` runs before dynamic routes, so `[locale]` never swallows a guest link.
- Unknown slugs 404 without saying whether an event exists.
- Rate limiting should cover invitation page views as well as RSVP submissions. The Cloud Function doesn't exist yet; the rule is recorded, not built.
- No real data exists yet (mock only), so old `-dddd` links need no migration. Slug uniqueness is checked against mock data until Firestore.
- The reply-cap margins, the 80% warning and the 7-day closing window live in `src/lib/config.ts`.
- Not built: guests' form doesn't close at the reply deadline yet; rail action buttons lead nowhere; the flood report page is a placeholder.
- RO/HU texts are AI-drafted and need a native read-through.

## History

<!-- Keep this updated latest to earliest -->

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
