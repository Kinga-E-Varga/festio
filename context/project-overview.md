# FESTIO — Core Spec (always in context)

Invitation + RSVP + event hub. One coherent product, not a bundle of tools.

**Terms:** _Event_ = the record and unit of purchase. _Invitation_ = the guest-facing page of an event.

## Stack

Next.js/React, TypeScript, Tailwind. SSR pages with dynamic components. Firebase for hosting/auth; API routes + Cloud Functions for backend. Firestore, region `europe-west` (hard requirement). Fonts via `next/font/google` (self-hosted at build time, no runtime Google request).

Host-uploaded images go to **Firebase Storage** (same `europe-west` region); Firestore documents hold only the resulting path/URL, never image bytes. Uploaded images are covered by the auto-deletion rule under GDPR.

For forms use React Hook Form.

## Packages

Each event has one package. It only ever goes up (Free → Standard → Custom); paid events can never be downgraded; no partial refunds.

| Package  | Price   | Templates                        | Seating chart |
| -------- | ------- | -------------------------------- | ------------- |
| Free     | Free    | Free simple templates only       | No            |
| Standard | 100 RON | All simple templates             | Yes           |
| Custom   | 200 RON | All templates, simple or modular | Yes           |

## Invitation kinds

**Simple:** fixed template, host edits text only. Minimal RSVP form. Free or Standard templates; Custom can use them too.

**Modular:** host adds/removes/edits sections; RSVP form is modular the same way. Also gets template customization (palette, fonts, images). Custom only.

- Base sections, always present: top bar, hero/cover, title, date & time, location, RSVP, footer.
- Optional sections: countdown, helpful notes, dress code, gift preferences, playlist, FAQ, schedule, menu, accommodation, transportation.
- **Sections, palettes and font pairs are shared libraries** in `src/modular/`. Each section has one or more variants; a palette is 15 colour roles, the rest mixed from them; more may be added; a font pair is body + headings. Hosts pick a whole palette or pair, never single colours or fonts.
- **A modular template is a preset over them:** a palette, a font pair and the sections with a variant each, in the fixed order. It is a starting point the host can change later.
- Events store section, variant, palette and font-pair ids, so those ids are permanent. Template ids are not stored and may change.

## Host flow

Pick invitation → add event details → (modular) customize design → (modular) add optional sections + RSVP questions → save, then sign in/up and pay → share → configure & download printable → track RSVPs → (paid) seating chart.

## RSVP

- Guests RSVP **without an account**.
- One guest can RSVP for multiple people, with a name per attendee plus any requested details (age group / child-baby tagging, dietary needs, etc.).
- Modular-invitation hosts add optional questions from presets or fully custom.
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

Every event has a downloadable printable invitation. **PNG export in v1.**

- **Simple:** printable = the same artifact as the online invitation. No separate layout.
- **Modular:** separate printable layout, fixed slots, no free-form editing.

Full spec in `context/features/print.md`.

## Lifecycle

- Invitations can be saved at any time, public or not. Content and template are editable until **24h before the event**.
- Visibility per invitation: **Hidden / Public / Protected**. Protected reveals a password field (min 4 chars, letters or digits). The password is printed on the physical card, directly below the link.
- Saving changes while not Hidden requires acknowledging a blocking warning that guests won't be notified (shows current RSVP count); host must agree or cancel.
- **Cancel event:** detailed confirmation + host re-enters password. RSVP form closes; invitation page is replaced with a header plus a short custom host message.
- **Postpone** = just change the date. Notifying guests is the host's responsibility in both cases; nothing is automated.

## Seating chart (paid)

Standard and Custom only. Full spec in `context/features/seating-chart.md`. Not built yet.

## Security

- Links are the host-chosen slug only, e.g. `festio.eu/maria-birthday`. Slugs are unique across Festio; slugs that clash with app routes are rejected.
- Links are guessable. Privacy comes from Protected mode; the link editor tells the host so.
- The guest list is never shown on the invitation page.
- `noindex` headers — invitations must never be indexed.
- Hosts must enter their expected guests (people). Replies are shown against it and may pass 100%. The form pauses at a hidden reply cap: the larger of expected + 50% or expected + 20, both set in `src/lib/config.ts`. Hosts are told only that the form pauses if far more replies come in than expected, and that they can raise the number anytime.
- Rate limiting by IP via Cloud Function, on both RSVP submissions (e.g. 5 per link per hour) and invitation page views.

## GDPR

- Host = data controller, Festio = data processor, via a DPA in the Terms.
- Auto-deletion of the whole invitation record (invitation, guest data, everything but the host account) a set period after the event. Currently 60 days — **must be a single configurable parameter, never hardcoded.**
- Plain-language privacy notice on the RSVP form: what's collected, who sees it, retention.
- Consent both ways: host uses guest data only for this event; guest agrees to that use.

## Template architecture (hard constraints)

Structure is fixed by invitation type; design varies per template.

1. **One file per template.** Adding a template = adding a single file. No registration step, no edits elsewhere. It then appears in the app automatically.
2. **All dynamic data lives in that file:** identity and display name, the package it needs (simple templates: Free or Standard; modular: Custom), recommended event types, palette, fonts, background, recommended print size, the editable fields (labels, input types, defaults, limits), for modular templates the palette, font pair and sections they start from (the sections themselves live in the shared library), and the design itself.
3. **Single-place edits.** Changing a colour, font, default, or field must never mean editing the same value in two places.
4. **Never break existing events.** A template edit must not destroy content hosts already entered. Changes that can't be applied safely must not be applied to events already using the template.

## Design system

Desktop-first, fully mobile responsive. Nav collapses to a drawer on mobile. Smooth transitions, card hover states, toasts for user actions, loading skeletons for async content.

Base app fonts — for the app's UI use the combination of Work Sans and Libre Baskerville google fonts.
**Invitations have their own independent fonts and are not bound by this.**

Base app palette — the `@theme` tokens in `src/app/globals.css`: neutral, steel teal,
terracotta, mustard, forest green, rust red. Use token names (`bg-steel-500`), never raw hex.
**Invitations have their own palettes and are not bound by this.**

## Out of scope for v1

Conditional RSVP logic, PDF export, add-to-calendar / guest reminders, photo gallery, free-form print layouts.

## Unsettled — ask, don't assume

- **Firestore schema and document shapes.** No canonical schema exists. Before adding collections, fields, or changing document shape, read the existing code and ask rather than assume. The answer-storage rules under RSVP are decided and hold regardless of final layout.
- Which slots exist in the modular print layout and what content can fill each.
- Which field input types templates need (text, long text, date, time, image, ...).
- How a guest holding only a printed invitation reaches the online RSVP form (printed URL / QR / host shares separately).
