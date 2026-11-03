"use client";

import { useLocale } from "next-intl";
import { SOFT_PICK } from "@/components/dashboard/styles";
import { localized, type Language } from "@/lib/language";
import { DRAWING, DRAWINGS, drawingLook, drawingOf } from "@/modular/drawing";

/**
 * One drawing's button: the inputs' fill, Add's fill when picked, Add's
 * hover fill on hover — picked or not, as the icon picker's. A size
 * container, so the drawing fits it whole, whatever its frame.
 */
const CHOICE = `grid h-20 w-20 cursor-pointer place-items-center rounded-ui border p-2 transition-colors [container-type:size] ${SOFT_PICK} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500`;

/* The drawing as big as its button allows: by its height, or by its width when wide. */
const THUMB = "h-[min(100cqh,calc(100cqw*var(--drawing-h)/var(--drawing-w)))]";

/**
 * The drawings library as a row of buttons, each drawing painted as the
 * cover paints it, in the text's colour; the picked one pressed (an
 * unknown or empty value, the default, as the cover shows), each named in
 * a tip on hover.
 */
export function DrawingPicker({
  labelId,
  value,
  onPick,
}: {
  /** The field label's id, which names the group. */
  labelId: string;
  value: string;
  onPick: (id: string) => void;
}) {
  const host = useLocale() as Language;
  const picked = drawingOf(value).id;

  return (
    <div
      role="group"
      aria-labelledby={labelId}
      className="flex flex-wrap gap-1.5"
    >
      {DRAWINGS.map((drawing) => {
        const name = localized(drawing.name, host);
        return (
          /* Its name in a tip under it, on hover or keyboard focus. */
          <span key={drawing.id} data-tip={name} className="option-tip flex">
            <button
              type="button"
              aria-pressed={picked === drawing.id}
              aria-label={name}
              onClick={() => onPick(drawing.id)}
              className={`${CHOICE} ${drawingLook(drawing)}`}
            >
              <span className={`${DRAWING} ${THUMB}`} />
            </button>
          </span>
        );
      })}
    </div>
  );
}
