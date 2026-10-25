# Reply Questions for Every Invitation

Every invitation, simple or modular, on every package, gets the same editable reply form.
Age and dietary needs stop being fixed fields and become suggested questions. Suggested
questions are locked, so the summary can count them.

## The form

- Every package, Free included, gets the full editable reply form that modular invitations
  have today: suggested questions, the host's own questions, Required, remove / archive,
  restore.
- Simple invitations get the Form tab in their editor, shared with the modular editor
  (`PanelTabs`, the Replies tab).
- All questions are still attend-only, and there's still no conditional logic.

## Suggested questions

- The list: **age, diet, transport, song, accessibility, accommodation, phone**.
- Each has a **permanent id** (`age`, `diet`, `transport`, …). It is never matched by
  wording.
- **Wording comes from the code**, in the invitation's language. It isn't saved on the
  event, so it follows a later language change.
- Each one can be added **only once**. Its chip shows it is already added, using the id.
- **Locked:** wording, options, type and scope can't be changed.
- **Required** can still be switched, with the usual rule: off anytime, but not back on
  once answers exist.
- Removing one works like any question: deleted if nobody answered, archived (answers
  kept) if someone did.

### Age and diet

- Added to **every new invitation**, both **required** by default. The host can remove
  them.
- Both are asked of each person.
- **Age:** one of adult · child · baby.
- **Diet:** multi-select from vegetarian, vegan, gluten-free, lactose-free, nut allergy,
  other, plus a free text for "other". It is its own question kind, because normal
  questions can't do multi-select plus text.
- **Accessibility:** works like diet: step-free access / wheelchair, help with walking or
  seating, hearing, sight, other (with text), or None. Asked of each person, optional by default.
- Diet and accessibility share one question kind: options, None, and Other with text.
- The other suggestions keep their current kind and scope, optional by default.

## Limit

- Every active question counts toward `QUESTIONS_MAX` (10), suggested ones included. Age
  and diet use 2 by default.

## Storage

- Age and diet answers move into each person's `answers` under their fixed ids, like
  every other question. Missing key = not asked, null = skipped.
- The person fields `ageGroup`, `diet` and `dietOther` go away.
- The answer value has to grow for diet (a list of needs plus the "other" text). Settle
  the exact shape in the plan, and ask before changing it.
- **No migration:** only seed and dev data exist. Update the schemas and the seed.

## Summaries

### Overview — Replies box

- **Age and diet:** counts as today, from their answers.
- **Transport, accommodation** (yes/no): "N said yes".
- **Song, phone, accessibility** (text): "N answered".
- **The host's own questions:** today's "N answered your custom questions" line.
- Only questions **still on the form** show. An archived one drops out of the summary.
  Its answers stay in the guest list and export.

### Guest list — Summary section

- The Age and Dietary needs blocks show only when the event asks those questions.

## Guest list and reply editor

- Age and diet columns and fields show only when the event asks them, or when some reply
  already has answers to them (archived).
- The host's reply editor edits them like any other answer.

## Wording to rewrite

- `messages/{en,ro,hu}.json` → `Packages`:
  - Free and Standard blurbs drop "minimal reply form".
  - Custom's blurb and upsell stop selling "reply questions" as its own. It stays about
    design: modular sections, palette, fonts, images.
- `context/project-overview.md`: the Simple and Modular invitation kinds, the RSVP section
  ("Modular-invitation hosts add optional questions"), and anything else that says simple
  forms are minimal.

## Out of scope

- Conditional question logic.
- New suggested questions beyond the seven above.
- Editing a suggested question's wording or options.
