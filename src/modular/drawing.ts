import type { Drawing, DrawingShape } from "@/types/modular";

/*
 * The drawings hosts pick for a cover, one file each in `./drawings/`,
 * listed by Turbopack's glob like the palettes: a new drawing is a new file
 * (and its built SVG), nothing registers it. Small, so the browser gets
 * them all: the cover draws the picked one, the Content tab offers each.
 */
const FILES = import.meta.glob("./drawings/*.ts", { eager: true });

/** The drawing a cover shows until the host picks another. */
export const DEFAULT_DRAWING = "couple-biking";

/** Every drawing, the default first, then by id. */
export const DRAWINGS: Drawing[] = Object.values(FILES)
  .map((file) => (file as { drawing: Drawing }).drawing)
  .sort((a, b) =>
    a.id === DEFAULT_DRAWING
      ? -1
      : b.id === DEFAULT_DRAWING
        ? 1
        : a.id.localeCompare(b.id),
  );

/*
 * The three frames every drawing is drawn in, so the covers lay out three
 * shapes, not any: tall 5:6, square 1:1, wide 6:5 (tall on its side). The
 * artist pads a drawing to one in Inkscape; `svg.py` builds no other. Their
 * proportions as the custom properties `DRAWING` and the covers read.
 */
export const DRAWING_SHAPES: Record<DrawingShape, string> = {
  tall: "[--drawing-w:100] [--drawing-h:120]",
  square: "[--drawing-w:100] [--drawing-h:100]",
  wide: "[--drawing-w:120] [--drawing-h:100]",
};

/**
 * What a drawing's box needs: its frame's proportions and its files. Its
 * filled shape comes along unless `lines` asks for the lines alone (see
 * `DRAWING` on the ground).
 */
export function drawingLook(drawing: Drawing, lines = false): string {
  const fill = lines ? "" : ` ${drawing.fill ?? ""}`;
  return `${DRAWING_SHAPES[drawing.shape]} ${drawing.file}${fill}`.trim();
}

/** The drawing with this id; an unknown or empty one, the default. */
export function drawingOf(id: string): Drawing {
  return (
    DRAWINGS.find((drawing) => drawing.id === id) ??
    DRAWINGS.find((drawing) => drawing.id === DEFAULT_DRAWING) ??
    DRAWINGS[0]
  );
}

/*
 * A drawing, the whole of it, never cropped: its filled shape (`before:`,
 * in `--drawing-ground`) under its lines (`after:`, in the current text
 * colour), each painted through one of its files as a mask. Both layers sit
 * on the same box, or the browser can round them a pixel apart. Read from
 * `drawingLook` on it or above: its frame's proportions (`--drawing-w`,
 * `--drawing-h`), the box's shape, and its files (`--drawing`,
 * `--drawing-fill`). The files have 5 units of room round the drawing
 * (`MARGIN` in `svg.py`), so the masks reach as far past the box. Give it a
 * height or a width; the other follows.
 *
 * The ground is the caller's: unset, the filled shape is invisible and the
 * lines alone show, which is what the Content tab's picker wants (no
 * palette there). The Card covers set it in `card.ts`.
 */
export const DRAWING =
  "relative aspect-[var(--drawing-w)/var(--drawing-h)] shrink-0 before:absolute before:-inset-x-[calc(5/var(--drawing-w)*100%)] before:-inset-y-[calc(5/var(--drawing-h)*100%)] before:bg-[color:var(--drawing-ground,transparent)] before:[mask-image:var(--drawing-fill)] before:mask-contain before:mask-center before:mask-no-repeat after:absolute after:-inset-x-[calc(5/var(--drawing-w)*100%)] after:-inset-y-[calc(5/var(--drawing-h)*100%)] after:bg-current after:[mask-image:var(--drawing)] after:mask-contain after:mask-center after:mask-no-repeat";
