# Current Feature: Reply Questions for Every Invitation

## Status

Completed

## Goals

- Every package (Free included) and every invitation kind gets the full editable reply form; simple invitations get the Form tab, shared with the modular editor.
- Suggested questions (age, diet, transport, song, accessibility, accommodation, phone) have permanent ids, wording from code in the invitation's language, can be added once each, and are locked (wording, options, type, scope). Required stays switchable with the usual rule.
- Age and diet are added to every new invitation, required by default, removable. Age: adult · child · baby. Diet: multi-select plus "other" text, its own question kind. Both asked of each person.
- Every active question counts toward `QUESTIONS_MAX` (10).
- Age and diet answers live in each person's `answers` under their fixed ids; `ageGroup`, `diet`, `dietOther` go away. No migration (dev data only): update schemas and seed.
- Overview Replies box: age and diet counts; transport and accommodation "N said yes"; song, phone, accessibility "N answered"; the host's own questions keep today's line. Archived questions drop out of the summary.
- Guest list Summary, guest list columns and the reply editor show age and diet only when the event asks them or replies already answered them.
- `Packages` wording (en/ro/hu) and `context/project-overview.md` rewritten: no "minimal reply form", and Custom no longer sells reply questions as its own.

## Notes

- Spec: `context/features/reply-questions.md`.
- Shapes decided: a suggested card is `{ id, suggested: true, required, archived, answered }` (the rest from code); the diet answer is `{ needs, other? }`; the summary gains `suggested: { transport, accommodation, song, phone, accessibility }`.
- Added after the plan: seed answers for every suggested question (maria-andrei); Overview lines reworded (no Age/Diet labels; age, diet and accessibility counts, then "Transport needed N" and "Accommodation needed N", a line each; guest list Summary's "answered" and messages rows are label + number; no song, phone or custom-answers line); accessibility options use short words everywhere (Wheelchair, Walking help, Hard of hearing, Low vision, Other); accessibility is options + None + Other like diet (shared `needs` kind, `summary.access`).
- Simplify: ran 2026-10-25
- Plan: `context/plans/reply-questions-for-every-invitation.md`
- Out of scope: conditional logic, new suggested questions, editing a suggested question's wording or options.
