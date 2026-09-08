# FESTIO — Core Spec (always in context)

Invitation + RSVP + event hub. One coherent product, not a bundle of tools.

**Terms:** _Event_ = the record and unit of purchase. _Invitation_ = the guest-facing page of an event.

## Stack

Next.js/React, TypeScript, Tailwind. SSR pages with dynamic components. Firebase for hosting/auth; API routes + Cloud Functions for backend. Firestore, region `europe-west` (hard requirement). Fonts via `next/font/google` (self-hosted at build time, no runtime Google request).

Host-uploaded images go to **Firebase Storage** (same `europe-west` region); Firestore documents hold only the resulting path/URL, never image bytes. Uploaded images are covered by the auto-deletion rule under GDPR.

## Data layer — not yet settled

No canonical Firestore schema exists. Before adding collections, fields, or changing document shape, read the existing code and ask rather than assume. The answer-storage rules below are decided and hold regardless of final layout.

## Tiers

Each invitation is individually tied to a tier. Paid invitations can never be downgraded; no partial refunds.

| Tier | Price   | Templates                     | Seating chart |
| ---- | ------- | ----------------------------- | ------------- |
| 1    | Free    | Free templates only           | No            |
| 2    | 100 RON | All Type 1 templates          | Yes           |
| 3    | 200 RON | All Type 1 + Type 2 templates | Yes           |

## Invitation types

**Type 1 (simple):** fixed template, host edits text only. Minimal RSVP form.

**Type 2 (modular):** host adds/removes/edits sections; RSVP form is modular the same way. Also gets template customization (palette, fonts, images).

- Base sections, always present: hero/cover, title, date & time, location.
- Optional sections: map, countdown, dress code, gift preferences, playlist, FAQ, schedule, menu, accommodation, transportation.
- **Sections are defined per template, not shared globally.** Each template file declares which sections it supports, which are on by default, and which the host may add. Two templates may support different section sets.

## Host flow

Pick invitation → add event details → (Type 2) customize design → (Type 2) add optional sections + RSVP questions → save, then sign in/up and pay → share → configure & download printable → track RSVPs → (paid) seating chart.

## RSVP

- Guests RSVP **without an account**.
- One guest can RSVP for multiple people, with a name per attendee plus any requested details (age group / child-baby tagging, dietary needs, etc.).
- Type 2 hosts add optional questions from presets or fully custom.
- All non-core questions are attend-only conditionals (shown only when attending).
- **No conditional question logic in v1** — explicit non-goal.
- RSVP form auto-closes 24h before the event date.

### Answer storage rules (decided)

- Each attendee has a fixed core: name + RSVP status. Always present.
- Everything else is stored as answers keyed to **permanent question IDs**. Missing key = never asked. Null = asked and skipped.
- Question definitions are **archived, never deleted**; archived questions stay visible and exportable.
- A question's type and scope freeze once it's in use. Required is host-controlled but cannot be turned on once answers exist; turning it off is always allowed.

## Host dashboard

Lists active events with edit / print / guest list actions.

**Guest list** — favors simplicity and readability over event-management depth.

- Full CRUD; the host is the only one who can ever correct an RSVP. Add from scratch (phone RSVPs), edit every field, delete any RSVP.
- Optional pre-loaded guest list by name; incoming RSVPs are matched against it, unmatched names get an `UNKNOWN` tag. Host can add the unknown guest or match them to an existing (mistyped) name.
- Duplicate name on submit → don't create an entry; ask the guest whether they already RSVP'd. "Yes, it's me" = no new entry. "No, add mine" = new entry flagged `UNKNOWN`.

## Print

Every event has a downloadable printable invitation. **PNG export in v1.** Recommended print dimensions shown next to the preview.

- **Type 1:** printable = the same artifact as the online invitation. Host sees a non-editable preview, an edit button (routes to the online editor), print specs, and "Save as PNG".
- **Type 2:** separate printable layout with a dedicated print editor. **Fixed slots** — the template defines the layout, the host only chooses what fills each slot. No free-form layout editing.

## Lifecycle

- Invitations can be saved at any time, public or not. Content and template are editable until **24h before the event**.
- Visibility per invitation: **Hidden / Public / Protected**. Protected reveals a password field (min 4 chars, letters or digits).
- Saving changes while not Hidden requires acknowledging a blocking warning that guests won't be notified (shows current RSVP count); host must agree or cancel.
- **Cancel event:** detailed confirmation + host re-enters password. RSVP form closes; invitation page is replaced with a header plus a short custom host message.
- **Postpone** = just change the date. Notifying guests is the host's responsibility in both cases; nothing is automated.

## Seating chart (paid)

Host sets table count and seats per table, plus per-guest grouping criteria (can group / do not group / must stay together). Platform auto-generates an arrangement; host can then adjust manually and export the final chart.

## Security

- Unguessable links: slug + 4 random digits, e.g. `festio.eu/maria-birthday-1657`.
- `noindex` headers — invitations must never be indexed.
- Optional 4-digit access code for full page access.
- Host-set "max total attendees" cap. Must be clearly presented as an adjustable technical safeguard, not a real guest limit.
- Rate limiting by IP via Cloud Function, e.g. 5 submissions per link per hour.

## GDPR

- Host = data controller, Festio = data processor, via a DPA in the Terms.
- Auto-deletion of the whole invitation record (invitation, guest data, everything but the host account) a set period after the event. Currently 30 days — **must be a single configurable parameter, never hardcoded.**
- Plain-language privacy notice on the RSVP form: what's collected, who sees it, retention.
- Consent both ways: host uses guest data only for this event; guest agrees to that use.

## Template architecture (hard constraints)

Structure is fixed by invitation type; design varies per template.

1. **One file per template.** Adding a template = adding a single file. No registration step, no edits elsewhere. It then appears in the app automatically.
2. **All dynamic data lives in that file:** identity and display name, invitation type + minimum tier, recommended event types, palette, fonts, background, recommended print size, the editable fields (labels, input types, defaults, limits), for Type 2 the supported/default/addable sections, and the design itself.
3. **Single-place edits.** Changing a colour, font, default, or field must never mean editing the same value in two places.
4. **Never break existing events.** A template edit must not destroy content hosts already entered. Changes that can't be applied safely must not be applied to events already using the template.

## Design system

Desktop-first, fully mobile responsive. Nav collapses to a drawer on mobile. Smooth transitions, card hover states, toasts for user actions, loading skeletons for async content.

Base app fonts — for the app's UI use the combination of Kantumruy Pro and Libre Baskerville google fonts fonts.
**Invitations have their own independent fonts and are not bound by this.**

Base app palette, only use these. **Invitations have their own independent palettes and are not bound by this.**

```
Neutral: #FAF7F3 #F5F0EB, #ECE5DD, #DCD3C7, #CABDAE, #AE9F8C, #8D7D6A, #6B5E4E, #4C4236, #2F281F, #17130E

Steel teal: #F3F7F9, #EDF6F8, #DAECF0, #ADCCD4, #7CADBA, #478797, #275D6A

Terracotta: #FDF2EB, #FCEEE4, #F6DBC7, #EEC09E, #E4A372, #C8711F, #924C00

Mustard: #F9F5EA, #F8F2E0, #F0E6C9, #DBCDA1, #C6B379, #AF974B, #7C682A

Forest green: #F2F7F0, #EAF1E7, #D6E2D2, #AABAA4, #7E9277, #51644A, #2F402A

Rust red: #FCF0F0, #FBEAE9, #F6DBDA, #E1AEAD, #CD8080, #B75759, #7B2C30
```

### Design reference

Refer to the screenshot below as a base for the dashboard UI. It does not have to be exact. Use it as a reference:

- @context/screenshots/dashboard-ui.png

## Out of scope for v1

Conditional RSVP logic, PDF export, add-to-calendar / guest reminders, photo gallery, free-form print layouts.

## Unsettled — ask, don't assume

- Firestore schema and document shapes (see above).
- Which slots exist in the Type 2 print layout and what content can fill each.
- Which field input types templates need (text, long text, date, time, image, ...).
- How a guest holding only a printed invitation reaches the online RSVP form (printed URL / QR / host shares separately).
- Whether the access code appears on the printed invitation.
