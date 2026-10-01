import type { CSSProperties } from "react";
import type { ColorRole, FontPair, ModularPalette } from "@/types/modular";

/*
 * The shared host bar, edit panel and RSVP form read `--c1`–`--c6`, with the
 * simple palette's meanings. This is the one place those roles are filled
 * from the 15 — variants read `--m*` only, so the two sets never collide. A
 * variant on a dark ground may set its own `--c*` on its own wrapper.
 */
const SHARED_ROLES: Record<string, ColorRole> = {
  "--c1": "c1", // surface
  "--c2": "c13", // accent
  "--c3": "c8", // ink
  "--c4": "c10", // muted
  "--c5": "c15", // hover
  "--c6": "c13", // warning
};

/** The palette as `--m1`…`--m15`, the shared roles, and the pair's two faces. */
export function modularVars(
  palette: ModularPalette,
  fontPair: FontPair,
): CSSProperties {
  const roles = Object.keys(palette.colors) as ColorRole[];
  return {
    ...Object.fromEntries(
      roles.map((role) => [`--m${role.slice(1)}`, palette.colors[role]]),
    ),
    ...Object.fromEntries(
      Object.entries(SHARED_ROLES).map(([name, role]) => [
        name,
        palette.colors[role],
      ]),
    ),
    "--font-primary": `var(${fontPair.fonts.primary.cssVar})`,
    "--font-secondary": `var(${fontPair.fonts.secondary.cssVar})`,
  } as CSSProperties;
}

/** The `next/font` classes that define the pair's two variables. */
export function fontClasses(fontPair: FontPair): string {
  return `${fontPair.fonts.primary.className} ${fontPair.fonts.secondary.className}`;
}
