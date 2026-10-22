# Current Feature: Dashboard layout

The dashboard redone as a column layout — logo in the nav, actions on a right-hand strip, no
top bar or footer, only the page content capped — and the old header and footer moved to the
landing page. Then the dashboard reorganised around one event at a time: an event picker in the
nav (like Firebase's project picker), the picked event's pages under it, a new Overview page per
event, and Home as the one place every event is listed.

**Why:** Home works — the summary, then the event cards. The trouble starts past it: the events
page shows every event with all six of its buttons at once, which is too much. A host should be
_inside_ one event, its pages one click apart, and switch to another event with a quick pick, not
a trip back to a long list.

## Status

Completed

## Goals

- Dashboard: the nav and the right-hand strip keep to the window's edges; only the page's content is
  capped, centred, at `max-w-page` (1280px, `--container-page` in `globals.css`)
- Landing: the top bar's and footer's strips span the window, their content capped at `max-w-app`
  (1536px, `--container-app`)
- The docked nav runs the window's full height at its left edge, with no border (no card,
  corners or shadow); the `side-card` utility removed
- The strip, top to bottom: account, cart, alerts (the bell; "notifications" are now alerts), latest
  replies (new) and language
- One side panel for alerts and latest replies (`SidePanel`, state in `useSidePanel`): from `nav` up it
  opens at the window's edge and narrows the page (`--spacing-drawer`, 400px), the strip moving over with
  it; a title and an X on top; the other icon switches its content in place, the active icon or the X
  closes it, a click elsewhere never does; on phones it lies over the page. Its views are `CartList` (the events waiting for payment, each opening its Event settings, and the total), `AlertsList`
  and `RepliesList` (the old rail split in two)
- Icons with a 1.75 line: 18px in the nav and on the phone's top bar (`SIDE_ICON`), 22px on the strip
  and the panel's X (`STRIP_ICON`)
- The nav, strip, side panel and phone menu on `neutral-150`, a step darker than the page, with no
  borders; the right-hand strip in the nav's colours, dark icons (`barIcon`), 40px
  hover circles and account circle (a plain `primary-800` circle, its initials in
  `neutral-100`)
- The dashboard's links and buttons in the accent colour: links `accent-700`, the main button
  `accent-800` (`BTN_PRIMARY`, shared by the guest list), the outlined one `accent-700`
- Dashboard home's event cards always one per row; the two-column step at 1240px removed
- The event editor's save bar as tall as the top bar (56px) when it fits on one line
- The landing page (`/`) gets a copy of the dashboard's top bar (`LandingHeader`), so the dashboard can be
  redone on its own
- Dashboard from `nav` up: no top bar; the Festio logo heads the docked nav, and bell, cart and account
  stand in a strip down the window's right edge (`BarActions`, shared with the
  phone's top bar, which stays)
- The footer moved to the landing page (`src/components/landing/SiteFooter.tsx`); the dashboard has none
- The account circle opens the side panel's third view, Your account (`AccountList`): Billing,
  Privacy & data and Settings, moved out of the nav, then Log out (to the landing page until
  accounts exist)
- The language picker on the right-hand strip (and the phone's top bar): a globe button
  opening a menu of the languages, each named in its own language (`LanguageMenu`)

### Event workspace

**The nav**, top to bottom (docked, and the same in the phone's drawer):

- The logo
- Home and Templates. The Events page and Downloads leave the nav; Downloads comes back later
- A rule, then the **event picker**: a box with the event's name, its date and how far off it is
  (`EventWhen`), and a chevron. Clicking it opens a small list, floating over the event's pages: a
  search box, the upcoming events soonest first (about six, then it scrolls), each with a dot and
  its date, the picked one marked, and **+ New event** at the bottom. Past events show only while
  searching, latest first under a Past label, those with deleted data left out; otherwise they
  are reached from Home
- Under the picker, the picked event's pages: **Overview, Event details, Guests, Seating,
  Invitation, Print, View as guest ↗** — today's six event buttons (`ActionRow` in `EventRow`) plus
  Overview, with their icons and their disabled cases kept: Seating greyed out on Free with its
  reason, Invitation / Print / View as guest greyed when the event has no design, Event details and
  Invitation when the event is past. View as guest opens the guest page in a new tab
- Quit dashboard stays at the foot

**Which event the picker shows:** the one the host last opened. With none opened yet, the next
upcoming event. Opening an event anywhere (a Home card, a past-event row, an alert, the picker)
makes it the picked one. A past event stays picked while the host is in it — the picker box shows
it though the list doesn't, its pages under it mostly greyed — and drops out once an upcoming one
is picked. With no upcoming events and none opened, the picker reads "No upcoming events" (or "No
events yet" with none at all), its list holds only the New event action, and no event pages
show under it.

**Switching events:** picking another event while on one of an event's pages lands on the same
page for the new event (Guests → its Guests), like Firebase's project picker; when that page is
greyed for the new event, its Overview instead. Picked from Home or Templates, it opens the
event's Overview.

**Calls made while writing this up (check them):**

- The picked event is kept in a cookie for now, so the server-drawn nav shows it straight away;
  read and written through one small helper, to swap for the account once there is one
- The dot beside each event in the picker shows its status (Active / Draft, from `eventStatus`)
- Seating has no page yet, so on paid events it is greyed too, with a "Coming soon" reason —
  never an enabled item that goes nowhere

**Routes**, each event's pages under its id:

- `/dashboard/events/<id>` — Overview (new)
- `/dashboard/events/<id>/details` — Event details, today's event editor (moved from `<id>`)
- `/dashboard/events/<id>/guests` — Guests, as today
- `/invitations/<id>` and `/prints/<id>` — Invitation and Print stay full-page editors outside the
  dashboard; their BACK falls back to the event's Overview
- `/dashboard/events` (the events page) goes, with `EventRow` and its event list. Every link to it
  or into it (`EventCard`'s `?event=…#focus`, `notices.ts`, `BackButton`, the save bar's Cancel,
  `ReplySummary`) points at the event's Overview or the matching event page instead

**Overview** — one event's own home: the event pages' header (`EventPageBar`, the title Overview),
then two columns from 860px (on phones the left column, then the right, each in its own order):

- **Left, a third of the width as on Home (`TWO_COLUMNS`)**: the event's box (below), its invitation's picture at the foot of it, with **Edit** on its top right
  corner, a link on a `neutral-50` tag edged like the boxes (greyed with the nav's reason when it
  can't open); **Share** — the visibility as a
  line ("Protected: guests need the password to open it", and Public's and Hidden's), then the
  link and the password with Copy buttons (`ShareFields`)
- **Right**, one under another: To do, Replies, Key dates, Data and privacy. In detail:
  - The event's box (left column, first): its name as the title with its Live / Draft / Past tag at the right
    (`StatusTag`, shared with Home), its date (`EventWhen`). The **Package** box: "Standard — 100 RON
    · paid" and what it includes, with an **Upgrade** link to Event settings' card while there is
    one; while unpaid, why it is hidden and **Pay and publish**. Neither on a past event
  - **Replies**, with this event's latest replies (the last five) under the numbers, past a rule: the replies against expected guests, bar and legend
    (`RepliesSummary`), who is coming in two short lines (by age and by dietary need, only the
    groups with anyone in them), how many answered the custom questions when there are any, the
    reply form's state (open until …, closed on …, paused), a link to the full Summary; this event's
    latest replies (the side panel's list, this event's alone) with a link to the guest list
  - **To do** (first) and **Key dates**: the event's alerts (left out when there are none); the dates as
    a timeline, across the box once it has room (560px, its gaps as long as the waits) and down it
    before, each stop its name over its day and how far off (today, the reply form
    closing, the event, the data's deletion)
  - **Data and privacy**, last: when the guest data is deleted, what to save (Export, coming soon),
    the legal side (`RetentionInfo`)
- No other event buttons on the page: the nav holds them
- A past event's Overview shows the same, nothing editable; one whose data is deleted is not opened
  at all (see Home)

**Event settings' Package card** keeps only the upgrade, titled Upgrade: the next package up with its
button. Left out on a Custom event, which has nowhere to go. Paying moves to the Overview, and the
unpaid alert's action opens the Overview.

**Home** — the one list of every event, built for a planner with many:

- The event pages' header (`EventPageBar`), capped to the page width: today's date (small caps, `neutral-900`) in the bar where
  an event's name goes, the greeting as the page's title
- A narrow column, then the events box beside it, as tall as the column; on a narrow page they
  stack: Create, Next event, Events, then Needs your attention
- **Create a new event**: the whole accent box is the button (nowhere to go yet)
- **Next event**: how far off the soonest upcoming event is, its name and day; opens its Overview
- **Needs your attention**: every event's alerts (the bell's), each its event, task and link,
  scrolling inside the box after about three; "All caught up" with none
- **Events**: a search, then a dropdown under it — Upcoming (the default), Live, Drafts, Past,
  All events (upcoming soonest first, then past), each with its count — then six rows a page (a Live / Draft / Past tag, the name over its day, the
  replies bar and "84 of 120 replied", or how many came once past), "1–6 of 12" and ‹ › arrows.
  Searching or filtering goes back to the first page. A row opens the Overview; once its data is
  deleted it reads "Record deleted" and opens nothing
- The stat strip, the big event cards and the folded Past events are gone
- One set of text styles: every box title `small-title` (`BoxHead`), every row a name over a
  grey line (`RowLines`), every link `TEXT_LINK`, every count `meta-text` right after its title

### Event pages' header and Event settings

**Header**, on the Overview, Event settings and Guests (to be shared by every event page later):

- No BACK. A 56px bar across the whole width between the nav and the strip, stuck to the top
  (under the phone's top bar): the event's name with a chevron, opening the picker's list under
  it to switch events (`EventSwitcher`, the same list as the nav's picker), in the nav's text
  style, medium weight
- Under it the page's name, serif 28px, scrolling with the page, no rule. Once it scrolls under
  the bar, the bar shows "/ Event settings" after the event's name; the bar has no rule either
- The save bar spans the same width, 16px short of either side, down on the window's edge

**Guests**: two tabs under the title (`PageTabs`), each its own address: **Guest list**
(`/guests`, first, the one used most) and **Summary** (`/guests?view=summary`). A query, not a
page of its own, so switching keeps the list's edits, which live in memory until there is a
store. The list takes the whole width, the summary the page width.

**Guest list tab**: one row on top: the search, then at the right an **Invite list ▾** menu (Use an
invite list while off; Edit invite list and Stop using the invite list while on) and **New reply**.
The filter chips (All, Coming, Not coming, Filter) go: each status is its own card (the Overview's
card style: a coloured dot, the serif title and the count as the head, which folds it), and search
narrows them all. Needs your attention comes first, tinted, open; the others open folded. "Not
sent yet" is a toggle at the top of the No reply yet card, the one place it applies. The rows,
threads, editors and the add-names box stay as they are.

**Page widths**: the event bar and the page's title span the whole width
from the nav, starting at the left. Under them each page's content takes the width it needs,
centred: narrow 640px (short forms and messages: the flood report), form 840px (Event settings),
page 1280px (Home, the Overview), or the whole width (the guest list's table). The four are
tokens in `globals.css`, picked through `CONTENT_WIDTH`. Home's bar and title are capped to its
page width instead, the date in the bar.

**Two shades** across the dashboard, from today's palette: the page, the nav and the right-hand
strip on `neutral-125` (a step added between 100 and 150), the side panel on `neutral-50`, the nav and strip ruled off from the page by a
`neutral-300` line; the cards on `neutral-50`. One colour per kind of line: `neutral-300` for
the layout's lines (the nav and strip edges, the nav's rules) and the cards' edges, `neutral-400` for the edges of fields, buttons and the picker,
`neutral-200` for dividers inside a card, an editor or the side panel's lists.

**Event settings** (was Event details; the route stays `/details`): cards like the Overview's.
One column, in the
order below, so an open card only pushes the ones under it down. Each card has its title (the Overview's card title), no line under it.

- A card is read first: its settings as rows of label and value, no fields
- **Edit** in its header turns that card's rows into its fields, in the same rows (label left, field where the value was), its edge a step darker, with Cancel and
  Save changes at its foot; its change warnings show inside it, before Save. One card at a time:
  the other Edit buttons wait until it is saved or cancelled. The page-wide save bar goes;
  leaving with unsaved changes still asks first
- **General**: event name, occasion, invitation language, date
- **Link and access**: the address and the link it makes, who can open it, the password while
  Protected. The "search engines never see invitations" line becomes an info box at the foot of the card
- **Replies**: expected guests (and how many replied), when the reply form closes (moved from
  Details), the invite list
- **Package** and **Cancel or delete** hold actions, not settings, so no Edit: the package the
  event has (Pay and publish while unpaid) and the next one up with its button; one row per
  action with its button, the title like the other cards'
- The event pages' warning banners (the reply form closing or closed, unpaid, paid but hidden, replies paused, replies to sort out) become to-do items in the Overview's To do (`eventTodos`), the same boxes as its alerts, never twice for one thing. Event settings and Guests open with no banners
- Data and retention leaves Event settings (nothing in it is a setting) for the Overview's Key dates box, under the timeline: the deletion date; what to save before then, with an Export button greyed out as coming soon (no export yet); the data-controller and what-guests-are-told rows under them

### Cleanup

Quality only: nothing a host sees changes, except the menus' edges.

- **One nav**: the docked column and the phone's drawer are the same element. Closed on a
  phone it is hidden by CSS, out of reach of keys and screen readers; it is a dialog only while
  open
- **One loader for event pages** (`events/[id]/load-event.ts`): an unknown event is not found,
  a deleted record goes Home, and the tab title, for the Overview, Event settings and Guests
- **The event header** (`EventPageHeader`) draws the tabs (Guests) or the rule under the title
  (the others). The bar takes one `look` (an event page's or Home's), not Home-only props
- **One set of spacings**: the 1800px step is the `wide` breakpoint; the chrome's top padding
  is one token (`pt-chrome-top`), so the logo, the strip, the side panel and the event bar stay
  level; the page's padding is one class (`PAGE_GUTTER`) and the event bar reads main's top
  padding instead of copying it
- **Greyed links in one place**: `openHref` decides whether an event page opens, for the nav,
  switching events and the Overview's links (`PageLink`, now also Edit on the picture)
- **Home's events box** gets small rows from the server (`homeRows`), sorted and with their
  status, not whole events
- **Shared pieces**: the cart's events (`UNPAID_EVENTS`), the short date (`formatDay` with
  `PICKER_DATE_PARTS`), `eventPage`, the menus (`MENU_SURFACE`, `MENU_BOX`, `MENU_ROW`, all with
  a `neutral-400` edge), `CARD_FRAME`, `BOX_ROW`, `shadow-drawer`, `FoldChevron`; one
  `Nav.comingSoon` and one `Notices.context` text
- **Removed**: the page-wide save bar (`SaveBar`) and what only it used, `EventMeta`,
  `EditRows`, and unused texts, classes and tokens

## Notes

Plan: `context/plans/event-workspace.md`

## History

<!-- Keep this updated latest to earliest -->

- Full-width sections — modular invitations drop the centred column: each section's ground (surface, surface-alt, accent, or a variant's own `band` for reply and playlist) spans the page, its content centred and capped at 1440px (`INVITE_COLUMN`); the cover and split sections' photos stay in the column; the header bar and its line span the page, its names, links and Reply in the column; the editor's preview fills its area, no padded ground or shadow; the envelope's page copy lands where the page draws it; the column shadow (`elevation-band`, `--m-column-shadow`) removed; header, cover and title fill the first screen when they fit, the cover photo taking the spare height but never wider than 2:1 unless the screen is too short; the default Olive Garden cover photo fixed
- Envelope adjustments — the simple card comes out of the envelope (Rises / Slides out, picked in the Design tab; the guest page rises), then the reply panel slides in; the modular page's copy rises out of the pocket as the envelope slides off, grows to full size and the header shows; the envelope stays lifted from the click, a tap or key eases into the lift, the tag swings back on the slide; card and page in the pocket 3 in from the sides and 2 below the fold (`CARD_SIDE`, `CARD_TOP`); the inside shadow neutral brown, fill and outline; palette envelope colours may name the palette's own colours (`paletteEnvelope`), used by Coastal and Flint; RO tag "Pentru / tine"; new Coastal Fun and Olive Garden covers and default church / venue photos, unused samples removed; the modular column's shadow mixed from the surface (`--m-column-shadow`), at 0% for now
- Envelope animation — a closed envelope in the invitation's colours over every simple and modular invitation (guest page and both editors): hover lifts it and drops the tag, a click turns the flap open, then it fades into the page, reduced motion fades it straight out; a Use envelope switch in the Design tab, on by default; six envelope colour roles on every palette and Wolf Dance with fixed Hue + Vivid shading; the tag in EN / RO / HU; the page inert until opened, focus handed to it after; `envelope.py build-app` writes the Inkscape drawing into `drawing.generated.ts` (`env-` prefixed), the drawing moved beside the skill and the prototype files removed; the global reduced-motion rule fixed (`i *` → `*`)
- Dashboard polish — Festio's own UI restyled and sized for laptops: palette tokens named by role, one corner token (`rounded-ui`), smaller nav, rail, top bar, 36px buttons and fields, smaller headings; events list cards and rows reworked with shared dashboard styles; only the event date locks, from the event day; invitations on laptops: the modular cover fits the first screen, section spacing at most 80px, the reply form 40px with a mouse and 44px on touch (simple and modular), 36px section edit buttons
- Modular invitations 5 — Content tab — the editor's Text tab renamed Content in every editor; the modular Content tab lists the sections that are on as numbered cards, one open at a time, scrolling the preview to it; Design and Content buttons on a hovered preview section; each variant lists the fields it shows; inputs for text, long text, time, toggle, image (photo upload coming soon), icon (grid picker), lists and groups with Add / Remove; Date shows only the date, read from the event details, with the Calendar card, Accent & big date and Tear-off variants; Helpful notes edits the Dress code / Gifts fields; times in the invitation language's style; required fields checked on blur and on Save, which jumps to the first empty one; one working state, Save and leave-page warning for Content and Design
- Modular invitations 4 — Section variants & palettes — a second variant for most sections (header, cover, title, date & time, countdown, location, schedule, travel, stays, menu, Helpful notes, FAQ, reply, footer), numbered by id, with shared pieces (`HeaderBar`, `TitleNames`, `CoverPhoto`, `WashedPhoto`, `IconHeading`, `Mark`) and `top-bar` renamed `header`; every sample in `defaults.ts`, templates keeping only their changes; the Coastal Fun template; box corners (Sharp / Slight / Soft / Round); section styles rolling out as bands in the Design tab; new palettes (Coastal, Linen, Noir, Peony, Thistle, Y2K, Flint, Sunset), Dark Olive renamed Orchard, a `mood` (subtle / balanced / vivid) on every palette and readability fixes; the `/palette` skill with a contrast checker and swatch page; reply form ids from `useId` and a wrapping diet dropdown
- Modular invitations 3 — Design editor — the modular editor's Design tab: template, palette, ground pattern and font pair pickers that roll out like the palettes; section switches with a variant picker under each section that is on; Helpful notes switches for Dress code, Gifts and custom notes, never on twice with the standalone sections; live preview; Save in memory with a leave-page warning; the Sunbaked palette and the Fraunces & Space Grotesk pair; the playlist record's disc, rings, hole and shadow mixed from its band
- Modular invitations 2 — Olive Garden — the modular library redone from the Nocturne prototype: palettes as 15 named roles (Nocturne only), Gelasio + Arimo, a hand-drawn icon library, one new variant per section with a shared four-part heading, Helpful notes and a required footer; one reply form with skins for simple and modular; section backgrounds alternated by the page (own-colour and joined sections); split sections with the content capped at 620px; the column widened to 1440px (`INVITE_COLUMN`); a toggle field type; a shared Good to know menu link; "reply" everywhere in guest and host text
- Modular invitations — templates split, 1280px column — `src/templates/` in `simple/` and `modular/`; the modular invitation capped at 1280px on its `--m4` ground with a faint palette shadow, shown the same way in the editor (no rounded frame, no bottom padding); ground patterns as a shared library with polka dots on Garden; the top bar as a required `top-bar` section with a `mark` field; no shadow on the editors' side panel; anchor jumps to RSVP no longer shift the editor up (`overflow: clip`)
- Custom invitation editor UI — the modular editor frames the invitation on the print ground (mustard-50) with padding per breakpoint, rounded corners, a thin border and a soft shadow; the edit panel moved out of the invitation into the editor, the sections drawer stays inside the box; modular invitations get a thin palette scrollbar (`--m7` on `--m2`); `elevation-btn` renamed `elevation-print`
- Text uniformity — one sans scale (10 / 11 / 11.5 / 12.5 / 13.5 / 14) and fewer spacings and weights across the host app, serif headings resized; every single-line field 40px tall; the editor side panel's tabs underlined in neutral with an edge-only open tab, the X only while the panel covers the viewport, View at every width and no title row on the print panel
- Invitation editor rework — one shared top bar and page frame for the simple, modular and print editors (BACK, title and tags, save status, Edit / View, Save or Export, Save off until something changed), `HostBar` removed; side panels in Festio's own chrome with neutral Text / Replies / Design tabs, a Print settings title, the event editor's fields and grey inputs, choice buttons and checkbox; app icons in the top bar; shared bar buttons and banner tones in `event-editor/styles.ts`
- Modular invitations phase 1 — a shared library in `src/modular/`: 15 sections with one variant each, Terracotta and Midnight palettes (15 colours as `--m1`…`--m15`), Classic and Script font pairs, all found by id; Garden and Garden Midnight templates at `/templates/<id>` with a sticky top bar, mobile drawer, Open in Maps links and the simple RSVP form; the host bar and an empty three-tab panel via a shared `PanelTabs`; simple-only loading for the guest, print and invitation pages
- RSVP form fixes — Coming / Not coming above the names; age and dietary needs per name when coming, with the reply editor's options; one warning slot above Send; custom radios and checkboxes in the invitation palette; reply fields in the invitation's primary font, buttons in Work Sans uppercase; the editor tries the form without saving; toast tones (success, neutral, warning, error), bigger and longer-lasting toasts
- Invitation editor tabs — the dashboard Invitations page archived to `archived/invitations-page/`; Edit invitation and Print straight from the events list, BACK falling back to it; a new event row layout with shared action blocks and short month names; no Studio in the nav, Downloads in Hosting; the editor panel's Text / Response / Design tabs with the X as a segment, sticky at the top, with a hint on where the reply message shows and the View button in `--c2`
- Prettier formatting — one pinned style (double quotes, semicolons) in `.prettierrc.json`, `npm run format` / `format:check`, VS Code format-on-save with Prettier, a Claude Code hook that formats every file Claude edits, and a one-time reformat of the codebase
- Card shadow, tab hover, Active = shared — a template sets its card shadow (light / dark / none) and the stage leaves room for it, so the card no longer pads itself; lighter tab hover with a bottom border and a 3px tab border; Active holds only paid Public / Protected events, with the status worked out instead of stored and the Active / Draft texts fixed in EN, RO and HU
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
