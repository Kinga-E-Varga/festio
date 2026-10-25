# Modular editor: shared bar styles out of `design/`

**Status: small refactor, ready to load.** Found by the simplifier at the end of modular invitations phase 4 (modular RSVP), and left for later on purpose.

## Why

The Design, Content and Form tabs of the modular editor draw the same bars: the box, the 32px mark slot, the icon look, the section name, the roll-out arrow and panel. Those all live in `src/components/modular/design/` (`styles.ts`, `RollOut.tsx`, `SectionBar.tsx`). `content/` and `replies/` import them from there with `../design/...`.

The coding standards say a bundle used outside its folder moves up to the shared one, and that a folder never imports another feature's local `styles.ts`. Content broke that rule before phase 4, and Form (`replies/`) followed the same pattern.

## Goals

- Move what the three tabs share to the modular editor's shared level, e.g. a new `src/components/modular/styles.ts` and a shared spot for the components. That covers:
  - styles: `DESIGN_BOX`, `BOX_GAP`, `MARK_SLOT`, `BOX_MARK`, `BOX_MARK_STROKE`, `SECTION_CARD`, `SECTION_REVEAL`, `SECTION_NAME`, `DESIGN_BAND`
  - components: `RollArrow`, `RollPanel`, `SectionBar`
- Keep in `design/styles.ts` only what the Design tab alone uses (e.g. `DESIGN_BOX_BUTTON`, if nothing else uses it).
- Update every import in `design/`, `content/` and `replies/`, and the map in `context/map/modular.md`.
- No change to how anything looks or behaves.

## Notes

- Before moving each one, check what uses it with Grep (excluding the context folders).
- Check the editor in the browser afterwards: the Design, Content and Form tabs, a section's styles rolling out, a Content card's fields, and a question's form.
- Pure refactor: `npm test`, `npm run build` and `npm run test:app` must pass unchanged.
