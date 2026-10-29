# Current Feature: Shared list rows and timeline spacing

## Status

Completed

## Goals

- **Shared list rows** (a refactor, no visible change): the row layouts the list styles repeat become named shared styles in `src/modular/styles.ts`, and the list shell the three identical lists share becomes one component.
  - `NARROW_LIST`: a list 350px at most and centred on a phone, its column's width from `@3xl` (Transportation's, Menu's, Schedule's, Special people's and Contact's lists).
  - `DISC_ROW`: a row with a 38px disc column at its end (Transportation's, Menu's, Accommodation's, Special people's and Contact's two-line rows); `LEAD_ROW`: a row led by a number or icon column (Transportation's, Menu's, Schedule's, Special people's and Contact's icon lists).
  - One rows shell — the list between hairlines or as stacked cards — for Transportation's Two-line rows, Special people's and Contact's lists.
  - Every touched style looks the same before and after (measured in the browser).
- **Timeline spacing:** Schedule's Timeline and Our story's Moments get a little more space between the heading and the timeline's start, only when there is a heading (the space belongs to the heading).

## Notes

- From the simplifier's finding at the last `/feature complete` (left for later).
- Simplify: ran 2026-10-29
