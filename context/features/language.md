# Language / i18n

## Overview

Adds Hungarian and Romanian alongside English, for both the host-facing app and
guest-facing invitations.

## Requirements

### General rule

Any string Festio provides that the host cannot edit gets a catalog entry and is
translated. This covers RSVP labels, predefined section titles, print page instructional
text, dashboard UI, toasts, empty states — not just the RSVP form and sections. Anything
the host types themselves is never translated.

### Host app (dashboard, editor, landing page)

- Use `next-intl`, locale-segment routing: `src/app/[locale]/...`.
- English is the default locale and is unprefixed (`festio.eu/dashboard`). Romanian and
  Hungarian are prefixed (`festio.eu/ro/dashboard`, `festio.eu/hu/dashboard`).
- Host can switch app language via a footer control. This is independent of any event's
  language.
- UI strings live in per-locale message catalogs, not hardcoded in components.

### Guest invitation

- The invitation route (`src/app/[invite]/page.tsx`, e.g. `festio.eu/maria-birthday-1657`)
  stays unprefixed and outside `[locale]` — there is no per-guest language switch.
- Each invitation gets a new `language` field, set by the host. This is separate from the
  host's own app language.
- Invitation `language` drives:
  - RSVP form labels and questions provided by Festio (not host-typed text).
  - Type 2 predefined section titles and any other Festio-provided section copy.
  - Date/time formatting shown to guests.
  - Default values for editable fields (e.g. the RSVP response message) while the host
    hasn't edited them — the default tracks the current invitation language. Once the host
    edits a field, that's host content and is never touched by language changes. This part
    is a nice-to-have; skip if it adds real complexity.
- Host-typed content (anything the host wrote themselves) is never translated, regardless
  of invitation language.
- `language` is editable like any other content field, until the existing 24h content
  freeze. Changing it after the invitation is public uses the existing "guests won't be
  notified" warning flow — no new mechanism needed.
- Already-downloaded printable PNGs do not retroactively update if the language changes
  later. Expected behavior, not a bug.
- The printable invitation always reflects the invitation's own `language`, never the
  host's current dashboard language — every string on the print artifact must come from
  the invitation's data, not from whatever locale the host happens to be browsing in.

### Existing invitations

- All existing invitations are currently English. On rollout, existing invitations default
  `language` to English; no host action required.

### Templates

- Only one template exists today (`src/templates/`), so this is in scope now rather than
  deferred.
- Template files currently hold labels/copy directly; move Festio-provided labels (section
  titles, defaults) into the message catalogs so templates read from them instead of
  hardcoding strings. Host-editable field values stay in the template's own data, untouched
  by this change.

## Why this works with the existing data model

RSVP answers are stored keyed to permanent question IDs (see `project-overview.md`), never
to label text. Switching an invitation's language only changes which label renders for
existing stored answers — no migration needed.

## Decisions made

- EN default/unprefixed, RO/HU prefixed, host-switchable in footer.
- Invitation `language` separate from host app language.
- Invitation `language` editable pre-freeze, same warning as any other content edit.
- Template restructuring included now (single template, low cost).
