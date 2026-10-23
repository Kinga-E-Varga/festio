# Palette switcher — `?palette=on`

Only in `npm run dev`; never reaches guests. Host app only (not the invitation pages).

A round button in the bottom-right corner that recolours the app live, to compare palettes on
the real screens. It overrides the `@theme` colour variables on `<html>`; `globals.css` is
never touched.

- Turn it on: open any host page with `?palette=on`, e.g. `http://localhost:3000/dashboard?palette=on`.
  It stays on (in this browser) until `?palette=off`.
- Pick a palette in the panel. The pick is remembered across pages and reloads.
- **Copy CSS** copies the picked palette's `--color-*` lines, ready to paste into `globals.css`.
- Options: **Current** (whatever `globals.css` holds), **Wine accent** (today's palette with
  the wine accent), **Old: green + burgundy** (the palette before Moss).
- Add an option: a full `Palette`, or only the roles that change, in `PALETTES`.
- Code: `src/app/PalettePicker.tsx` (palettes and panel), `src/app/PaletteSwitcher.tsx`
  (dev-only gate), loaded in `src/app/[locale]/layout.tsx`.
