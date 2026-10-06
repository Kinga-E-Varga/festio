import type { CSSProperties } from "react";

/**
 * How round a modular invitation's boxes are, by permanent id — the host
 * picks one step for the whole page. Tailwind's own radius steps (sm, 3xl,
 * and full's value for the pill), with soft's 10px between them. `box`:
 * cards and panels; `pill`: buttons and small labels, which go fully round
 * on the last step; `field`: form fields and their dropdown lists, as `box`
 * but never rounder than soft's 10px. Circles (icon discs, the cover's
 * kicker) and full-width photos never follow it.
 */
export const CORNERS = {
  sharp: { box: "0", pill: "0", field: "0" },
  slight: {
    box: "var(--radius-sm)",
    pill: "var(--radius-sm)",
    field: "var(--radius-sm)",
  },
  soft: { box: "10px", pill: "10px", field: "10px" },
  round: {
    box: "var(--radius-3xl)",
    pill: "calc(infinity * 1px)",
    field: "10px",
  },
} as const;

export type CornersId = keyof typeof CORNERS;

/** The steps in order, as the Design tab lists them. */
export const CORNER_IDS = Object.keys(CORNERS) as CornersId[];

/** A template that sets none, or a stored id that names none. */
export const DEFAULT_CORNERS: CornersId = "sharp";

export function isCornersId(id: string): id is CornersId {
  return id in CORNERS;
}

/** The step as `--m-corner` / `--m-corner-pill` / `--m-corner-field`, read by `CORNER`, `PILL` and `FIELD_CORNER`. */
export function cornerVars(id: CornersId): CSSProperties {
  return {
    "--m-corner": CORNERS[id].box,
    "--m-corner-pill": CORNERS[id].pill,
    "--m-corner-field": CORNERS[id].field,
  } as CSSProperties;
}
