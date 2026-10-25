# Current Feature: Modular invitations — Phase 4: modular RSVP

## Status

Completed

## Goals

- A modular invitation's host can add their own questions to the reply form, from our suggestions or written from scratch, in the editor's **Replies** tab
- Guests see and answer those questions on the invitation; the answers are saved with the reply and shown to the host in the guest list
- Questions follow the answer storage rules of the core spec, with one agreed change: a question nobody has answered can be deleted
- Nothing changes for simple invitations

## Notes

- Plan: `context/plans/modular-invitations-phase-4-modular-rsvp.md`
- Simplify: ran 2026-10-25

Spec: `context/features/pending/modular-4-rsvp.md` (builds on `modular-1-sections.md`). Agreed in brainstorming on 2026-10-25. Mockup of the Replies tab and the guest form: `.superpowers/brainstorm/1891076-1792936007/content/replies-tab.html` (scratch, approved as the layout).

### Why

Modular (Custom) hosts need more than name, age and diet: transport, songs, accessibility, anything their event needs. Most hosts don't know what to ask until they see an example, so we give them starters, but we don't want to maintain fixed questions.

### Three layers

1. **Always asked** — the simple invitation's form, unchanged: the reply's status, each person's name, and (when coming) age and dietary needs, plus the message to the hosts. The host can't remove them.
2. **Suggestions** — one-tap starters. Tapping one opens the add-question form **prefilled** with our wording in the **invitation's language**; the host may change anything before adding. Once added it is an ordinary host question; nothing remembers it came from a suggestion. The list (all five kept):

   | Suggestion    | Question                                      | Answer   | Asked          |
   | ------------- | --------------------------------------------- | -------- | -------------- |
   | Transport     | Do you need transport to the venue?           | yes / no | once per reply |
   | Song request  | Which song gets you dancing?                  | text     | once per reply |
   | Accessibility | Any accessibility needs we should know about? | text     | per person     |
   | Accommodation | Do you need a place to stay?                  | yes / no | once per reply |
   | Phone number  | A phone number, in case we need to reach you  | text     | once per reply |

   The wording lives in one `LocalizedText` entry per suggestion (en/ro/hu, like section names), read in the invitation's language. A suggestion already in the list (same wording) shows greyed with a tick, but stays tappable (my call).

3. **Host's own** — written from scratch: wording, answer type (choice / yes-no / text), asked of each person or once per reply, required or not.

Host questions are shown only when the reply is "coming" (core spec: attend-only). No conditional logic.

### The host's Replies tab (modular editor)

Today it is empty for modular invitations. Top to bottom, as in the mockup:

- **Always asked**: Name, Age, Dietary needs as locked tags, and a hint that the host's questions are shown only to guests who are coming.
- **Your questions** with a count ("2 of 10"): one row per active question — drag handle, wording, type and scope underneath, edit. Reordered by **drag and drop** with **dnd-kit** (new dependency, decided: works with mouse, touch and keyboard; loaded only in the host editor; the seating chart will reuse it). Install it on the feature branch.
- **Show archived (n)** link: archived questions, each with Restore.
- The add / edit form, inline in the panel: Question, Answer (Choice / Yes-no / Text), Ask (Each person / Once per reply), Required switch, and for a choice its options (add, reword, reorder); Cancel / Add question (Save on edit). Delete or Archive on edit, by the rule below.
- **Suggestions** chips, then **+ Write your own question**.

Host chrome reads the host's locale; question wording is the host's own text, written in the invitation's language.

Questions save with the editor's existing **Save** (same save as the invitation, through `saveInvitation`), so the not-Hidden "guests won't be notified" warning applies. The preview beside the panel shows them in the form right away. On the template preview (`/templates/<id>`) the tab works in memory only, like the rest of that editor.

### On the guest's form

- **Per-person** questions: inside each person's block, under age and diet.
- **Once-per-reply** questions: after the people (after "+ Add another person"), before the message to the hosts.
- In the host's order. Both RSVP variants (Soft band, Bold band) draw them with their existing skin (`rsvp/reply.tsx`): text → the text field, yes/no → the two side-by-side choices, choice → the dropdown, single pick.
- A required question gets the same warning treatment as a missing name.

### Rules

- **Limit**: up to 10 active questions; archived don't count. Restore is refused at 10.
- **Answered mark (agreed schema change)**: each question on the event gets an `answered` flag, set to true the first time a saved reply answers it, inside that reply's save — no extra reads. It never goes back to false, even if those replies are deleted (safe side). Answered includes a host-written reply in the guest list.
- **Not answered**: change anything; **Delete** removes it.
- **Answered**: wording can change; Required can only go off; type and scope are locked (shown locked, with a short note why); **Archive** instead of delete. Archived = hidden from the form, answers still shown and exported.
- **Choice options** (my call): add and reword anytime; remove only before the question is answered. Option ids are permanent.
- Limits (my call): wording up to `RSVP_QUESTION_MAX` 120 characters, 2–8 options of up to 60 each — new constants in `src/db/limits.ts`.

### Saving a guest's answers

- `guestReplySchema` gains `answers` on the reply and on each person (by question id, the existing `answersSchema` shape).
- `writeGuestReply` checks them against the event's current questions: drops ids that aren't active questions or don't match their scope, checks the value fits the type (a choice's option id, a boolean, text within `RSVP_ANSWER_MAX`). A misfit is dropped as never asked, and Required is held by the form, not the save: the form may have opened before the host changed the question, and one missing answer beats a lost reply (decided after review, 2026-10-25). Asked and left empty = `null`; not asked = no key (core spec). Kept only when the reply is coming, like age and diet.
- Sets `answered` on each question that got a non-null answer, in the same transaction.
- The guest list already shows and edits answers to `event.questions`, and the summary counts `answeredCustom`; check that both still work, including archived questions.

### Saving questions while guests reply (my calls)

- The server never takes `answered` from the browser; it keeps the stored value.
- If a question got answered after the host opened the editor, the host's save still goes through, but the server keeps that question safe: a delete becomes Archive, and type, scope, Required turned on and removed options stay as stored. The toast names the question(s) that were kept. Nothing else the host changed is lost.
- Saving questions does not bump the event card's `version` (so an open Event settings form doesn't conflict); it goes with `invitationVersion`, which the guest page already caches under.

### Host-written replies in the guest list (my calls)

- The same type checks as a guest's reply (one shared check function), but Required is not enforced: the host corrects replies and may not know every answer.
- The host can still edit answers to archived questions, since the guest list shows them.
- A non-null answer the host saves sets `answered` too.

### Package and scope

- Custom (modular) only. Simple invitations keep their fixed form and no Replies-tab questions.
- **Not in scope: the modular guest page.** Guests can't open a modular invitation yet (`invite/[invite]/page.tsx` loads simple templates only); that is its own feature. Here the guest side is the form in the editor's preview plus the save path (`guestReplySchema`, `writeGuestReply`), proven by tests, so the guest page gets answers for free.
- Not in scope: questions tied to sections (Transportation, Playlist), conditional logic, multi-select choices, new RSVP variants.
- Privacy notice (my call): reword "Your name and reply" to cover answers too ("Your name and answers…"), since a host can ask for a phone number. All three languages.

### Left to the builder

Component split, where the editor state for questions lives beside `ModularState`, how archived questions render in the panel, and the exact copy for host chrome (in all three languages).
