# "Other" on Choice Questions

A host's own choice question can end with an **Other** option. A guest who picks it writes
their own answer, like diet's and accessibility's Other.

## The host's side

- A switch on a choice question in the Form tab: **Add an Other option**. Off by default.
- Not a new question kind. A choice question with or without Other is the same kind.
- **Turning it on** is allowed anytime, even after guests answered.
- **Turning it off** is allowed until someone has picked Other. After that it stays on,
  like an option that has answers. Say so next to the switch.
- Other's wording comes from the code, in the invitation's language ("Other" / "Altceva" /
  "Egyéb"). The host doesn't write or edit it.
- Other doesn't count toward `RSVP_OPTIONS_MAX` (8). It is always the last option.
- Suggested questions are not affected: none of them is a choice question.

## The guest's side

- Other shows as the last option. Picking it opens a text box under it.
- The text is limited to `RSVP_ANSWER_MAX`, like any text answer.
- Other picked with empty text blocks Send, required or not, with the same warning as diet
  ("Please tell us more where you picked Other.").
- A choice question stays single-select.

## Storage

- Today a choice answer is the option's id (a string). An Other answer also needs the
  guest's words, so the shape changes. **Settle the exact shape in the plan, and ask before
  changing it.** One option: keep the id string for normal picks and use
  `{ choice: "other", other: "…" }` for Other.
- Other's id must never clash with an id the host's options get.
- The question card stores only the switch (e.g. `other: true`). Its wording isn't stored.
- No migration: only dev data exists. Update the schemas and the seed (one seeded choice
  question with Other on, and a few Other answers).

## Summaries and the guest list

- **Guest list Summary:** Other is one more row in the question's block, with its count,
  shown like the other rows (hidden at 0).
- **Guest list rows and export:** an Other answer shows the guest's words.
- **Host's reply editor:** Other can be picked and its text edited, like on the guest form.
  Other with empty text can't be saved (the diet rule).
- The Overview is unchanged: it doesn't show the host's own questions.

## Out of scope

- Multi-select choice questions.
- Other on yes/no or text questions.
- Changing the suggested questions.
