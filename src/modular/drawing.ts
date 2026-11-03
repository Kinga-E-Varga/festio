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

/** What a drawing's box needs: its frame's proportions and its file. */
export function drawingLook(drawing: Drawing): string {
  return `${DRAWING_SHAPES[drawing.shape]} ${drawing.file}`;
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
 * A drawing, the whole of it, never cropped, in the current text colour,
 * painted through its file as a mask. Read from `drawingLook` on it or
 * above: its frame's proportions (`--drawing-w`, `--drawing-h`), the box's
 * shape, and its file (`--drawing`). The file has 5 units of room round the
 * drawing (`MARGIN` in `svg.py`), so the mask reaches as far past the box.
 * Give it a height or a width; the other follows.
 */
export const DRAWING =
  "relative aspect-[var(--drawing-w)/var(--drawing-h)] shrink-0 after:absolute after:-inset-x-[calc(5/var(--drawing-w)*100%)] after:-inset-y-[calc(5/var(--drawing-h)*100%)] after:bg-current after:[mask-image:var(--drawing)] after:mask-contain after:mask-center after:mask-no-repeat";
