# Editor cards out of `modular/design/`

**Status: small refactor, ready to load.** Found by the simplifier at the end of the design tweaks branch (2026-10-26), and left for later on purpose.

## Why

The design-tab cards are now used outside the modular editor, but they still live in `src/components/modular/design/`:

- `EnvelopeCard` is used by the modular Design tab and by the simple editor (`src/components/invitation/EditPanel.tsx`).
- `PickCard` and `SwitchCard` are used by the print panel (`src/components/print/PrintPanel.tsx`).
- `SwitchCard` already imports `PanelSwitch` from `src/components/invitation/`.

So the simple editor and print reach into the modular editor's folder for shared pieces. These are components, not a `styles.ts`, so no rule is broken outright. But the folder no longer says who owns them.

## Goals

- Move the cards every editor shares to `src/components/invitation/`, beside `PanelSwitch`: `EnvelopeCard`, `PickCard`, `SwitchCard`.
- Move what they need with them, or to a shared spot. That means `SectionBar`, `RollArrow` (`RollOut.tsx`), `VariantBands`, and the styles `BOX_MARK`, `BOX_MARK_STROKE`, `SECTION_CARD`, `SECTION_REVEAL`, `BOX_GAP`, `MARK_SLOT`, `SECTION_NAME`, `DESIGN_BAND`. These are also used by the modular tabs, so they can't simply move into `invitation/styles.ts`; see Notes.
- Update every import, and the maps in `context/map/modular.md` and `context/repo-map.md`.
- No change to how anything looks or behaves.

## Notes

- **Overlaps `modular-shared-styles.md`**, which moves the same bar styles and `SectionBar` / `RollArrow` / `RollPanel` up out of `design/` for the modular tabs. Do the two together, or that one first. The shared bar pieces then need one home that both `invitation/` and `modular/` can use without importing another feature's local `styles.ts`, for example a shared `src/components/editor/` folder (its own `styles.ts`) that both import from.
- Before moving each one, check what uses it with Grep (excluding the context folders).
- Check in the browser afterwards:
  - the simple editor's Design tab: envelope switch, card opening rolling out;
  - the modular Design tab: envelope, sections, a section's styles;
  - the Content and Form tabs;
  - the print panel: card style, background switch.
- Pure refactor: `npm test`, `npm run build` and `npm run test:app` must pass unchanged.
