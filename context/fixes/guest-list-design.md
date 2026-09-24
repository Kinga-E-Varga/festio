# Fix: guest list row design

The guest list table (`/dashboard/events/[id]/guests`) works, but its rows don't look good. Redesign the row, wide screens first, then narrow ones.

## Tried and rejected

1. **Columns with a header row:** Name · Invitation sent · Reply · Tags · actions.
2. **Tinted boxes (in the code now, the fallback):** Name · reply or ☐ Invite sent · an Unknown box with Match to… / Add as new · a Duplicate box with Keep both / Same person · Edit, on a fixed grid. "Doesn't look good at all."
3. **Light rows:** name + small tag · status dot · one "Resolve…" button that opens the choices, or a pencil shown on hover. Rejected and reverted.

## Research (13 RSVP apps + table guides)

- Rows stay light: status is one small badge; extra actions sit behind one button or a menu.
- None of the apps puts two sets of fix buttons in the table.
- Groups are shown quietly (e.g. Joy's shared circle around a party).

## Rules the design must keep

- **Categories, in order:** Unknown guests · Confirmed · Declined · Waiting for a reply. An empty category hides.
- **Replies split by category.** Each part shows "Replied with …"; the note stays on the first part that isn't Unknown. Filters and search split replies the same way.
- **Unknown** = the list is on and the name isn't on it. **Duplicate** = on every reply with that name; Keep both / Same person only on the second reply. Waiting names never get tags.
- **Invite sent** checkbox on Waiting rows only, one click.
- **Chips + search** in one row above the table. "Coming 7" in the chips counts everyone; that's fine.

## Where the code is

- `src/components/dashboard/guest-list/RowView.tsx`: the row.
- `src/components/dashboard/guest-list/styles.ts`: `COLUMNS` widths, `ISSUE` / `ISSUE_LABEL` box styles.
- `src/components/dashboard/guest-list/GuestTable.tsx`: categories, groups, the "Replied with" line.

## Working note

Claude can't see the page (no headless browser). Start from a screenshot and say what's wrong with the current look.
