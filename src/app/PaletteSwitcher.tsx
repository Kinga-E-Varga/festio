import dynamic from "next/dynamic";

/*
 * Imported only behind the dev check: a production build drops the import,
 * so the picker and its palettes never reach the pages.
 */
const PalettePicker =
  process.env.NODE_ENV === "development"
    ? dynamic(() => import("@/app/PalettePicker").then((m) => m.PalettePicker))
    : null;

/**
 * Dev-only: a corner button to try other app palettes live. Off until
 * `?palette=on` — see `context/dev-tools/palette-switcher.md`.
 */
export function PaletteSwitcher() {
  return PalettePicker ? <PalettePicker /> : null;
}
