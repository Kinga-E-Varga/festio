import { isOn, text } from "@/modular/content";
import { DRAWING, drawingLook, drawingOf } from "@/modular/drawing";
import { markParts } from "@/modular/Mark";
import type { SectionValues } from "@/types/modular";
import type { ReactNode } from "react";

/*
 * The Card covers' shared parts: Stamp, Playbill and Ticket. Each is a card
 * in the second surface on the page's own ground, so the host's pattern
 * shows round it, the host's illustration and the Title's words inside.
 */

/*
 * The cover's stage, a size container round the card (`CARD_BOX`). On a
 * dark palette it keeps, under names of its own, the colours the card
 * turns to (`dark-palette:`): the ink for its paper, the second surface
 * for its ink, that softened toward the paper for its muted ink, and the
 * secondary and the accent each half mixed with its soft colour, deep
 * enough for the light paper. Kept here, a step above the card, because the
 * card's own swap reads them and a colour can't be worked out from itself.
 */
export const CARD_STAGE =
  "absolute inset-0 [container-type:size] dark-palette:[--card-paper:var(--m-ink)] dark-palette:[--card-ink:var(--m-surface-alt)] dark-palette:[--card-ink-muted:color-mix(in_oklab,var(--m-surface-alt)_70%,var(--m-ink))] dark-palette:[--card-secondary:color-mix(in_oklab,var(--m-secondary)_50%,var(--m-secondary-soft))] dark-palette:[--card-accent:color-mix(in_oklab,var(--m-accent)_50%,var(--m-accent-soft))]";

/*
 * On a dark palette, a card's paper, inks, secondary and accent swapped for
 * `CARD_STAGE`'s, on whatever holds the card.
 */
export const CARD_INKS =
  "dark-palette:[--m-surface-alt:var(--card-paper)] dark-palette:[--m-ink:var(--card-ink)] dark-palette:[--m-ink-muted:var(--card-ink-muted)] dark-palette:[--m-secondary:var(--card-secondary)] dark-palette:[--m-accent:var(--card-accent)]";

/*
 * The card's place on the cover. Upright, in from every edge by a share of
 * the shorter side. Landscape, a little more from its sides, and 9% of its height
 * from its top and bottom, up to 100px, the sections' own padding on wide
 * screens (`PAD_TOP`, `PAD_BOTTOM`). Once the cover is the whole column
 * (1440px, `INVITE_COLUMN`), 40px in from its sides, where the header's
 * content starts and ends. A size container, so the card's parts read its
 * own shape: landscape (`[@container(aspect-ratio>1)]:`) or upright. On a
 * dark palette, its colours swapped (`CARD_INKS`).
 */
export const CARD_BOX = `absolute inset-[min(5cqw,4.5cqh)] [@container(aspect-ratio>1)]:inset-x-[calc(min(5cqw,4.5cqh)+3cqw)] [@container(aspect-ratio>1)]:inset-y-[min(100px,9cqh)] [@container(min-width:1440px)]:inset-x-10 [container-type:size] ${CARD_INKS}`;

/*
 * The host's drawing's room: whatever the words leave, across the card's
 * width upright and its height landscape, in the drawing's proportions,
 * shrinking along the other way when space runs out, never taller than
 * 640px, however big the screen. Its widest by the card's size
 * (`DRAWING_CAPS`). A size container, so the drawing inside
 * (`DRAWING_FIT`) fits it whole. Give it the picked drawing's frame and
 * file (`drawingRoom`).
 */
const DRAWING_ROOM =
  "flex aspect-[var(--drawing-w)/var(--drawing-h)] max-h-160 min-h-0 min-w-0 w-full items-center justify-center [container-type:size] [@container(aspect-ratio>1)]:h-full [@container(aspect-ratio>1)]:w-auto";

/*
 * How far the drawing may reach, by how much room the card's words need.
 * Upright, held by its height (a share of the card's width), and never
 * wider than a little more: tall and wide drawings weigh the same, a wide
 * one not stopped short by a width cap made for tall ones. Landscape,
 * beside the words, a share of the width. `roomy` the Stamp's (80% tall,
 * 88% wide, 70% landscape); `snug` the Playbill's, whose ribbon and heading
 * need more (70%, 85%, 60%).
 */
const DRAWING_CAPS = {
  roomy:
    "max-w-[min(88cqw,80cqw*var(--drawing-w)/var(--drawing-h))] [@container(aspect-ratio>1)]:max-w-[70cqw]",
  snug: "max-w-[min(85cqw,70cqw*var(--drawing-w)/var(--drawing-h))] [@container(aspect-ratio>1)]:max-w-[60cqw]",
};

/** The room for the drawing the host picked (`drawing`, the default until they do), as big as `caps` allows. */
export function drawingRoom(
  values: SectionValues,
  caps: keyof typeof DRAWING_CAPS = "roomy",
): string {
  return `${DRAWING_ROOM} ${DRAWING_CAPS[caps]} ${drawingLook(drawingOf(text(values, "drawing")))}`;
}

/* The drawing, in the ink, as big as its room (`drawingRoom`) allows, never cropped. */
export const DRAWING_FIT = `${DRAWING} text-(--m-ink) h-[min(100cqh,calc(100cqw*var(--drawing-h)/var(--drawing-w)))]`;

/*
 * Small round bites along two opposite edges: `BITES_Y` the top and bottom,
 * `BITES_X` the left and right, `--bite` across (radius) every `--bite-step`,
 * rounded to a whole number along the edge. The bites keep `--bite` off each
 * end of their edge (padding: they tile the content box, the strips past it
 * stay whole, 1px over the bitten edge so no seam shows between them), so
 * every corner is a solid square, never a sliver between two bites. Each mask's two halves meet in the middle. Nest them for bites on
 * all four sides; what goes inside sits `absolute inset-0`, past the padding.
 */
export const BITES_Y =
  "px-(--bite) [mask:radial-gradient(circle_var(--bite)_at_50%_0,#0000_96%,#000)_0_0/var(--bite-step)_51%_round_no-repeat_content-box,radial-gradient(circle_var(--bite)_at_50%_100%,#0000_96%,#000)_0_100%/var(--bite-step)_51%_round_no-repeat_content-box,linear-gradient(#000_0_0)_left/calc(var(--bite)+1px)_100%_no-repeat_border-box,linear-gradient(#000_0_0)_right/calc(var(--bite)+1px)_100%_no-repeat_border-box]";
export const BITES_X =
  "py-(--bite) [mask:radial-gradient(circle_var(--bite)_at_0_50%,#0000_96%,#000)_0_0/51%_var(--bite-step)_no-repeat_round_content-box,radial-gradient(circle_var(--bite)_at_100%_50%,#0000_96%,#000)_100%_0/51%_var(--bite-step)_no-repeat_round_content-box,linear-gradient(#000_0_0)_top/100%_calc(var(--bite)+1px)_no-repeat_border-box,linear-gradient(#000_0_0)_bottom/100%_calc(var(--bite)+1px)_no-repeat_border-box]";

/** The Title's lines a poster card draws: eyebrow, then the names or the first line, then the second line. */
export function posterWords(
  title: SectionValues,
  ampersand: string,
): { eyebrow: string; names: ReactNode[]; first: string; second: string } {
  /* Use names off: two plain lines in place of the names and their line. */
  const named = isOn(title, "names");
  return {
    eyebrow: text(title, "eyebrow"),
    names: named ? markParts(title, "names", ampersand) : [],
    first: named ? "" : text(title, "firstLine"),
    second: text(title, named ? "secondLine" : "nextLine"),
  };
}

/* Where a line `inset` in meets a corner scoop of radius `r`: past the scoop along the edge. */
function reach(r: number, inset: number): number {
  return r > 0 ? Math.sqrt((r + inset) ** 2 - inset ** 2) : inset;
}

/**
 * A line `inset` px in from a `w` × `h` card's edge, curving inward round a
 * scoop of radius `scoop` at each corner (0 for square corners), each arc
 * keeping the same distance from its scoop. Walks the card clockwise from
 * the top left.
 */
export function framePath(
  w: number,
  h: number,
  inset: number,
  scoop: number,
): string {
  const sides = [
    (t: number) => [t, inset],
    (t: number) => [w - inset, t],
    (t: number) => [w - t, h - inset],
    (t: number) => [inset, h - t],
  ];
  const lengths = [w, h, w, h];
  const point = ([x, y]: number[]) => `${x.toFixed(2)} ${y.toFixed(2)}`;
  const arc = `A ${scoop + inset} ${scoop + inset} 0 0 0`;
  const corner = reach(scoop, inset);
  let d = `M ${point(sides[0](corner))}`;
  sides.forEach((at, index) => {
    d += ` L ${point(at(lengths[index] - corner))}`;
    const next = sides[(index + 1) % 4](corner);
    d += scoop > 0 ? ` ${arc} ${point(next)}` : ` L ${point(next)}`;
  });
  return `${d} Z`;
}

/**
 * The length of `framePath`'s line: the straight runs plus each corner's
 * arc, of radius `scoop + inset`, sweeping a quarter of its circle less
 * both ends, where the line meets it.
 */
export function frameLength(
  w: number,
  h: number,
  inset: number,
  scoop: number,
): number {
  const corner = reach(scoop, inset);
  let length = 2 * (w + h) - 8 * corner;
  if (scoop > 0) {
    const R = scoop + inset;
    length += 4 * R * (Math.PI / 2 - 2 * Math.asin(inset / R));
  }
  return length;
}
