# Card shadow, tab hover, Active = shared

Three small fixes, one commit.

## 1. Invitation card shadow, set per template

**Problem.** To get a shadow, the template pads its own card (`absolute inset-0 p-7 …` in
`src/templates/wolf-dance/index.tsx`) and puts the shadow on the next div. A shadow
outside the card gets cut off: `.stage` has `overflow: auto` (needed for scrolling below
`MIN_SCALE`), and the card fills the stage edge to edge on its tight side.

**Fix.**

- The template sets `design.shadow: 'light' | 'dark' | null`, next to `width` / `height`.
  The type lives with `TemplateModule` in `src/types/invitation.ts`.
- `Invitation.tsx` passes `template.design.shadow` to `ScaledStage`.
- `ScaledStage` leaves room for the shadow. With a shadow set, it fits the card as if it
  were `width + 2 × space` by `height + 2 × space` (the space in design px), and the card
  sits that far in from the frame's edge. The shadow paints in that strip, so nothing clips.
- The shadow **shrinks with the card**: the space and the shadow are in design px and go
  through the same `scale()`. A small card looks like a smaller copy of the big one.
- The shadow is set in CSS from a `data-shadow` attribute on the stage, reusing the
  existing `elevation-light` / dark values. No inline shadow styles.
- `null` = no strip, no shadow. The card fits exactly as it does today.
- Screen only. The printable does not go through `ScaledStage` and gets no shadow.

**The padding moves outside the card.**

- Remove `p-7` from the wolf-dance card. Its `--c3` border now reaches the card's edge.
- Put page padding back on the wrapper around `ScaledStage` in `Invitation.tsx`. Its
  comment ("The padding lives here rather than on the stage…") still describes it, but
  the padding itself is gone. Not on `.stage`: `clientWidth` counts padding, so the card
  would come out too big.
- This padding is screen px and doesn't scale. The shadow strip (28 design px) already
  gives the spacing `p-7` did, so the wrapper adds only a little on top: `p-1`, settled
  in the browser.

**Check.** With `p-7` gone, wolf-dance's content gets 28px more room on each side at
1080 × 1532. Check the layout still looks right. The printable is unaffected: `/prints`
draws its own card from the template's print colours and never renders its `Card`.

## 2. Event tabs hover

In `src/components/dashboard/EventTabs.tsx`, inactive tabs get `hover:bg-forest-200`
(#D6E2D2 — one shade lighter than the #AABAA4 / `forest-300` first tried), and on hover their bottom border turns `forest-500`, the divider's colour.
The tabs' bottom border goes from 2px to 3px, the active tab's too; otherwise the active tab
is unchanged. Applies to the
Events and Invitations tabs, which share the component.

## 3. Active = Public or Protected

**Problem.** `status` is stored on each mock event and ignores visibility. The event in
`src/mock/dashboard.ts` with `visibility: 'hidden'`, `paid: true` sits under Active.

**Fix.** Work the status out in one helper in `src/lib/event.ts` instead of storing it:

- **past:** the event date has gone by
- **active:** paid **and** visibility Public or Protected
- **draft:** everything else (unpaid, or Hidden)

Remove the stored `status` from `DashboardEvent` and the mock data. Every reader
(`EventGroups`, `InvitationGroups`, both list pages' tab counts, `EventRow`, `EventCard`,
`InvitationCard`, `DangerZone`, `replyWindow`, the dashboard home and the mock
notification helpers) uses the helper.

**Side effect.** The dashboard home (`dashboard/page.tsx`) and the notification rail
items (`mock/dashboard.ts`) only take active events. A paid but Hidden event leaves the
home page, and its warnings leave the rail. No guest can reply to a hidden page, so that
is expected.

**Texts, in `en`, `ro` and `hu`:**

| Key | Now (EN) | Becomes |
| --- | -------- | ------- |
| `Events.groupActive` | Active — the invitation is live or ready to share | Active — the invitation is visible to guests |
| `Events.groupDraft` | Drafts — not paid for, never reachable | Drafts — hidden or not paid for, never reachable |
| `Events.emptyDrafts` | No drafts waiting. Saved-but-unpaid invitations land here. | No drafts waiting. Hidden and unpaid invitations land here. |
| `Events.emptyActive` | Nothing live yet. Pick a template to start your first invitation. | Check it against the new rule; e.g. say an event goes live once it is paid for and no longer hidden, like `Invitations.emptyActive` |

The `Invitations` texts already describe the new rule, so leave them alone. Check RO and HU
match their EN meaning, not just the keys.

Leave `EventEditor.draftTitle` / `draftBody` ("nothing has been paid for") alone. The
delete-draft box shows only for unpaid events. A paid Hidden draft gets Cancel event,
which is right, because paid events can't be deleted.

## Done when

- A template with `shadow: 'light'` shows an uncut shadow at every scale, including
  small ones, and `null` shows none.
- Wolf-dance has no `p-7`, and the page keeps its breathing room.
- Inactive tabs turn `forest-200` on hover, with a `forest-500` bottom border.
- The hidden paid mock event shows under Drafts, and every tab count agrees.
- `npm run build` passes.
