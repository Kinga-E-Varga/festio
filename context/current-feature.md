# Current Feature: Guest list row design

Redesign the guest list table row at `/dashboard/events/[id]/guests`. It works, but the rows don't look good. Wide screens first, then narrow ones.

## Status

Completed

## Goals

- A new row design that looks clean and stays light: status as one small badge, extra actions behind one button or a menu.
- Wide screens first, then a narrow-screen layout.
- Keep every rule below working exactly as it does now.

## Notes

**Rules the design must keep**

- Categories, in order: **Needs your attention** · Confirmed · Declined · Waiting for a reply. An empty category hides. (Replaces the old Unknown guests category — see below.)
- Replies split by category. Each part shows "Replied with …"; the note stays on the first part that isn't Unknown. Filters and search split replies the same way.
- Unknown = the list is on and the name isn't on it. Waiting names never get tags.
- Invite sent on Waiting rows only, one click.
- Chips + search in one row above the table. "Coming 7" in the chips counts everyone; that's fine.

**Needs your attention (decided)**

One section at the top holding everything the host has to sort out. Confirmed / Declined / Waiting rows then carry no fix buttons at all.

- **What goes in:**
  - **Unknown** replies (list on, name not on it): Match to a name · Add as new.
  - **Identical names:** every reply whose name matches another reply's name (normalized), whether or not the guest chose "No, add mine". All replies with that name go in, shown together so the host can compare what each replied: the party, each person's status, the note, and the **date of the reply**.
- **One button for identical names: "Different person"**, only on the replies that came in after the first. No "Same person" / "Keep both" — if it's the same person, the host deletes the extra reply with the row's delete button.
- **Order inside the section:** all shared-name cards first (they must be sorted out first), then the Unknown replies. A–Z within each.
- **After "Different person"** that reply leaves the section and never comes back for that name. If it still isn't on the list, it stays as an Unknown item instead.
- **When a reply leaves the section** its people go to Confirmed / Declined. When the section is empty it hides.
- **Counts:** we count replies, not people. Each identical-name reply counts on its own (a pair = 2), each Unknown reply = 1.
- **Data:** needs a reply date on each reply, and a "confirmed different person" marker. Both mock-only for now (`src/types/guests.ts`); the Firestore shape stays unsettled.
- **Replaces:** the Unknown guests category, the Duplicate tag on rows, Keep both / Same person. The Match / Add as new fix line stays, on Unknown rows inside the section only.
- **Filter menu:** one "Needs attention" option replaces Unknown and Duplicates.
- **One replies warning everywhere:** the "N unmatched replies" warning becomes "N replies need a look", counting unknown names and identical names together. Same wording in the guest list banner, the notifications rail, the event card note and the dashboard stat ("Replies to review").

**Tried and rejected — don't repeat**

1. Columns with a header row: Name · Invitation sent · Reply · Tags · actions.
2. Tinted boxes (in the code now, the fallback): Name · reply or ☐ Invite sent · an Unknown box with Match to… / Add as new · a Duplicate box with Keep both / Same person · Edit, on a fixed grid. "Doesn't look good at all."
3. Light rows: name + small tag · status dot · one "Resolve…" button that opens the choices, or a pencil shown on hover. Rejected and reverted.

**Research (13 RSVP apps + table guides)**

- Rows stay light; status is one small badge; extra actions behind one button or a menu.
- None of the apps puts two sets of fix buttons in the table.
- Groups are shown quietly (e.g. Joy's shared circle around a party).

**Reference design — structure only**

Artifact: https://claude.ai/artifact/YZWtMVFAroRjnewfZs6eKn?sk=YnAEyCwIZ3y-dd-Xr53cXw

Take the **structure only**. Don't copy its code, colours, fonts or shapes — use the app's own tokens and components. Where it clashes with the rules above, the rules win.

- **One sheet, sections inside.** The table is one card. Each category is a section with a heading, a count next to it, and an optional one-line hint (e.g. Waiting: "Names from your list who haven't answered."). A thin line between sections.
- **Groups.** One reply = one group, with a thin line between groups. A group with more than one part gets a quiet vertical thread on the left joining its parts. Each person has a small dot on the thread that shows their status: filled = coming, outlined = declined, dashed = waiting.
- **Group attention.** Groups that need action (invite not sent) get a soft tint that fades from the left. No boxes.
- **Person row, wide screens.** Three parts on one line: name (+ Unknown tag inside the attention section) · status badge · icon actions (edit, delete).
  - Status badge: "Coming" / "Not coming". On Waiting rows: "Invitation sent" (click to undo), or "Not sent yet" + a "Mark as sent" text link. One click either way.
- **Note.** The reply's note sits under the people as a quiet bubble with a note icon, joined to the thread. Max ~60ch wide.
- **"Replied with …" line.** Last in the group, on the thread with a dashed dot: "Replied with **Name**, listed in Confirmed".
- **Inline edit.** Editing turns the row into a soft panel: Name field (with char counter and error) + Coming / Not coming toggle (replies only) + Cancel / Save changes. Leaving with unsaved changes asks first.
- **Match to a name** opens a dialog: search + a list of waiting names (each showing sent / not sent), and a Match button that names the pick.
- **Above the table.** Search on the left, then All · Coming · Not coming chips, then one **Filter** button that opens a menu with the rest (Waiting, Not sent yet, Needs attention), all in one row. The button names the filter in use. Menu options hide when their count is 0 (Not sent yet, Needs attention) or when the list is off (Waiting); with none left, the button hides.
- **Narrow screens (≤720px).** Search on the first row, chips + Filter button on a second row. Person row: name + tags on top, status badge under it, icon actions on the right spanning both lines. The thread moves in closer. The edit panel stacks into one column.
- **Banners on the guest list page: two at most.** (1) The replies warning ("N replies need a look" — unknown + identical names). (2) The replies-paused banner: the hidden reply cap is reached and the form is closed. These banners no longer show on this page: "Replies at {percent}%" (shown today at exactly 100%) and "More replies than expected". The event editor keeps its banners unchanged (`RepliesBanner` with `from="warn"`).
- **Not in scope from the artifact:** Export button, the preview strip, the page header/setting/banner layout, and the empty/no-results panels. Only the table and the row are being redesigned.

**Where the code is**

- `src/components/dashboard/guest-list/RowView.tsx` — the row.
- `src/components/dashboard/guest-list/styles.ts` — `COLUMNS` widths, `ISSUE` / `ISSUE_LABEL` box styles.
- `src/components/dashboard/guest-list/GuestTable.tsx` — categories, groups, the "Replied with" line.

**Working note:** Claude can't see the page (no headless browser). Start from a screenshot and say what's wrong with the current look.

## History

<!-- Keep this updated latest to earliest -->

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
