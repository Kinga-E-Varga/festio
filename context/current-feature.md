# Current Feature: Design Tweaks

## Status

Completed

## Goals

- **Alert boxes, one look:** warning, info and danger boxes have no border and a soft fill with darker text (`ALERT`, `DANGER_ALERT`, `INFO_SOFT`); the text and buttons sit in a row, stacked and centred when narrow (`AlertRow`). Used by the unsaved prompt, Separate, the add-names notice and both delete confirms. Small buttons: one size (`SMALL_BTN_*`), outline ones keep their background on hover.
- **Event settings warnings replace the save confirm:** each change guests would notice raises its own warning to tick: date, link, password (Protected only), language, visibility (to Hidden or Protected, once the event is shared) and an earlier close. A close date in the past is an error. The invitation editors keep the confirm, now in warning colours (`Dialog` `warn`).
- **Danger zone:** the quiet buttons (Keep the event, Reopen and the step back from delete) are outlined in the danger red (`BTN_DANGER_OUTLINE`). Delete reply is a solid red button; it says "Delete group reply" for a group.
- **The card opening is saved:** a simple invitation keeps rise or slide (`opening` on the invitation card, `slide` by default, so older cards read as before). The design cards that pick it were rebuilt (`EnvelopeCard`, `PickCard`, `SwitchCard`), shared with the print panel.
- **Bars:** the right bar's icons are spaced like the account circle. Quit dashboard is at its foot, like the editors' Quit, and the language moves to the side nav's foot. The quit icon points up-left. Hover tips on the right bar's buttons (not the account) and on the editor's Quit (`icon-tip`). Latest replies uses the envelope icon.
- **Landing bar:** bell, cart and account open their panel's contents in a box under the icon (`HeaderPopover`); a Dashboard button, and the account menu heads with Dashboard.
- **Home:** the events box filters with a dropdown (`FilterMenu`); rows line up their right-hand parts (`RowLines`).
- **Toasts:** three tones, no warning tone. Success is a shade lighter (`primary-800`) and neutral matches the hover tips (`neutral-950`). The test reply's toast is success, guests-answered-while-editing is neutral.
- **Overview's invitation picture, its own box:** a simple card alone, card-shaped, with no page ground (`inviteTheme(…, { ground: false })`) and no shadow. Stacked, it joins the title and date box, under the date, centred, at most 520px tall. A modular invitation shows its cover alone, laid out 700px wide and shrunk (`ModularInvitation` `hero`). It is card-shaped beside the other boxes; stacked, full width and at most 520px tall. Edit floats 12px in from the corner.
- **Replies bars:** the Event settings meter is drawn like the Overview's and Home's bars (`REPLIES_BAR`, `BAR_TRACK`), in their colours, every reply in one green fill, all of it red at the same shade once replies reach expected.
- **"Guests invited" instead of "expected guests":** the setting, the bars, the legend, the Summary's total, the paused-form notices and the errors (en/ro/hu). Each person a reply is for counts, coming or not. Wording only: the stored `expectedGuests` stays.
- **Editors' side panel on arrival:** the invitation editors and the print page open their panel where it sits beside the invitation and keep it shut where it would cover the screen, so the host sees the invitation first (`useEditing`).
- **Small fixes:** the page's empty scrollbar gutter takes the page colour. Phones on the Wi-Fi can sign in against the emulators (`firebase.json`, `firebase-client.ts`).

## Notes

- Simplify: ran 2026-10-26
- Schema change approved: `opening` on the simple invitation card.
- Tests added: `tests/writes/card-opening.test.ts` (a saved rise keeps it; an old card reads slide), `tests/lib/invite-theme.test.ts` (the card-only theme leaves the page ground out) and `tests/lib/replies-bar.test.ts` (the bars' shares). All seen failing first. The last one found float noise in `repliesBarVars` (35 of 125 gave 28.000…04%); it now multiplies before dividing.
- Not checked in the browser yet: most of the above, the Overview's picture on a signed-in page in particular. Romanian and Hungarian wording of the new warnings needs the host's check.
- Open offers, no answer yet: a link warning for Hidden events with no replies; rounded corners on toasts.
- Banner is warning-only now: its unused `info` / `notice` tones, `BANNER_TONE`, `BANNER_ICON` and `BannerTone` removed.
- Left for later: moving the shared editor cards out of `modular/design/`, `context/fixes/pending/editor-cards-out-of-modular.md`.
- Not part of this branch: `context/features/pending/printing-export.md` (untracked), and the "Reply questions for every invitation" line already in `context/history.md` (uncommitted, from the last feature).
