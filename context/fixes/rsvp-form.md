# RSVP form fixes

Three changes to the guest RSVP form, one commit. Files: `src/components/invitation/RsvpForm.tsx`,
`useRsvpForm.ts`, `RsvpPanel.tsx`, `styles.ts`, `HostInvitationEditor.tsx`,
`src/types/invitation.ts`, `messages/{en,ro,hu}.json`.

## 1. Coming / Not coming first, one warning slot

**Problem.** Send with no choice picked does nothing and says nothing: `buildPayload()`
returns null and the panel silently returns. Only empty names get a warning.

**Fix.**

- Move the Coming / Not coming buttons to the top of the form, above the names.
- One warning slot above Send, where the name warning is now. Shown only after a Send
  attempt. It checks top to bottom and shows the first problem only:
  1. Coming / Not coming not picked — new text, e.g. EN _"Please let us know if you're coming."_
  2. A name is empty — the existing `nameWarning`
  3. Someone coming has no age (see 2)
  4. Someone coming has no dietary need, not even None (see 2)
- Once a Send was attempted, the slot follows the form live: fix one problem and the next
  one shows; fix them all and it empties.
- New texts in the `Rsvp` namespace, EN / RO / HU (they follow the invitation's language).

## 2. Age and dietary needs per person

**What.** When Coming is picked, each name gets two required questions under it. Not
coming → neither is asked (spec: non-core questions are attend-only).

- **Age** — radio buttons: Adult / Child / Baby. One pick.
- **Dietary needs** — checkboxes: None, Vegetarian, Vegan, Gluten-free, Lactose-free,
  Nut allergy, Other. Several picks. None clears the others; any need clears None.
  Other opens a text box for the guest's own words — optional, doesn't block Send.
- Same options and rules as the host's reply editor (`guest-list/ReplyFields.tsx`,
  `pickDiet`), so a guest's reply and the host's view match. Reuse `AgeGroup` / `DietNeed`
  and the option lists rather than writing them twice.
- Labels are guest-facing, so they go in the `Rsvp` namespace in the invitation's language.

**Design — no browser default look.** Every colour from the invitation palette (`--c` vars),
never Festio's tokens.

- Native inputs stay (keyboard + screen readers), with `appearance-none`.
- Radio: round `--c3` ring; picked = `--c3` dot inside.
- Checkbox: square `--c3` outline; checked = `--c3` fill with a `--c1` tick.
- Labels in the invitation font, `--c3`. Visible focus ring in `--c3`.
- Classes live in `components/invitation/styles.ts` with the other guest chrome.
- May change to chips or a dropdown after seeing it in the browser.

**Payload.** `RsvpAttendee` gets `ageGroup`, `diet` (empty = None), `dietOther`, shaped
like the guest list's `GuestReply`. Not coming = keys left out (never asked). No storage.

## 3. Test replies in the invitation editor

**Problem.** In the host's invitation editor the RSVP form gets no send handler; Send just
shows the thank-you message.

**Fix.**

- The form works fully in the editor: every question, every warning, same checks.
- A reply that passes shows a toast _"Nothing saved — this is a test"_, then the thank-you
  message.
- The toast is the editor's existing `Toast`, in the **host's** language (`HostEditor`
  namespace), EN / RO / HU.
- The editor never saves, even once a database exists. Only the guest page will.
- No "try again": the thank-you stays until the page reloads.
