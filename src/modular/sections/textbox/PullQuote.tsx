import { COLUMN, HEADING, MUTED } from "@/modular/styles";
import type { SectionValues } from "@/types/modular";
import { LargeText, SmallText, WORDS_GAP } from "./TextBoxWords";

/** A large quote mark: the heading face, in the muted ink, its box cut to the glyph's top half, where the mark is. */
const QUOTE_MARK = `${HEADING} ${MUTED} h-7 text-[56px] leading-none @3xl:h-12 @3xl:text-[96px]`;

/**
 * The words as a pull quote: two large marks in the heading face beside the
 * large text alone, the opening one at its top left, the closing one at its
 * bottom right, at every width; the small text under the whole, outside
 * them. Quote accent (`7`), Quote (`8`) and Quote joined (`9`).
 */
export function PullQuote({ values }: { values: SectionValues }) {
  return (
    <div className={`${COLUMN} flex flex-col items-center ${WORDS_GAP}`}>
      {/*
       * The marks in their own columns beside the large text, at every
       * width. The text fills its lines (not balanced), so its box ends
       * where its words do and the marks sit against them: the opening one
       * at its top, the closing one at its bottom, nudged down a tenth of
       * its size so it sits on the last line rather than above it.
       */}
      <div className="grid grid-cols-[auto_minmax(0,auto)_auto] justify-center gap-x-2 @3xl:gap-x-4">
        <span aria-hidden="true" className={`${QUOTE_MARK} self-start`}>
          “
        </span>
        <LargeText values={values} className="text-pretty!" />
        <span
          aria-hidden="true"
          className={`${QUOTE_MARK} translate-y-[0.1em] self-end`}
        >
          ”
        </span>
      </div>
      <SmallText values={values} />
    </div>
  );
}
