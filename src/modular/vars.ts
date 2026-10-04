import type { CSSProperties } from "react";
import type {
  ColorRole,
  FontPair,
  MixedColor,
  ModularPalette,
} from "@/types/modular";

/*
 * The few colours a palette does not set: the shadow, the page ground
 * darkened, mixed once here in oklab, and the inverse pair, the page's own
 * two colours swapped. A mix reads other custom properties on the same
 * element, so it follows whatever palette is set.
 */
const MIXES: Record<MixedColor, string> = {
  shadow: "color-mix(in oklab, var(--m-canvas), black 80%)",
  inverse: "var(--m-ink)",
  "inverse-ink": "var(--m-surface)",
};

/*
 * Shared guest chrome written for simple invitations reads `--c1`–`--c6`,
 * with the simple palette's meanings — today only the focus ring
 * (`.invite` in `globals.css`); the RSVP form takes a skin instead. This is
 * the one place those are filled for a modular invitation — variants read
 * `--m-*` only, so the two sets never collide.
 */
const SHARED: Record<string, string> = {
  "--c1": "var(--m-surface)", // surface
  "--c2": "var(--m-accent)", // accent
  "--c3": "var(--m-ink)", // ink
  "--c4": "var(--m-ink-muted)", // muted
  "--c5": "var(--m-secondary)", // hover
  "--c6": "var(--m-error)", // warning
};

/**
 * The widest the invitation's column grows, in px. The one place it is set:
 * the page reads it as `--invite-column`, photos' `sizes` read the number.
 */
export const INVITE_COLUMN = 1440;

/** The palette's roles as `--m-<role>`: enough to draw a swatch or a pattern tile. */
export function paletteVars(palette: ModularPalette): CSSProperties {
  const roles = Object.keys(palette.colors) as ColorRole[];
  return Object.fromEntries(
    roles.map((role) => [`--m-${role}`, palette.colors[role]]),
  ) as CSSProperties;
}

/** The pair's two faces as `--font-primary` / `--font-secondary`. */
export function fontVars(fontPair: FontPair): CSSProperties {
  return {
    "--font-primary": `var(${fontPair.fonts.primary.cssVar})`,
    "--font-secondary": `var(${fontPair.fonts.secondary.cssVar})`,
  } as CSSProperties;
}

/**
 * The palette's roles, the mixes, the shared roles, the pair's two faces
 * and the column's width.
 */
export function modularVars(
  palette: ModularPalette,
  fontPair: FontPair,
): CSSProperties {
  return {
    ...paletteVars(palette),
    ...Object.fromEntries(
      Object.entries(MIXES).map(([name, mix]) => [`--m-${name}`, mix]),
    ),
    ...SHARED,
    ...fontVars(fontPair),
    "--invite-column": `${INVITE_COLUMN}px`,
  } as CSSProperties;
}

/** The `next/font` classes that define the pair's two variables. */
export function fontClasses(fontPair: FontPair): string {
  return `${fontPair.fonts.primary.className} ${fontPair.fonts.secondary.className}`;
}
