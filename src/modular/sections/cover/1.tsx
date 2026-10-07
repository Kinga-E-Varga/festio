import { CoverPhoto } from "@/modular/CoverPhoto";
import { imageSrc, longDate, text } from "@/modular/content";
import { CORNER, FROSTED, HEADING } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/* The cover's frosted box, edged in the line. */
const BOX = `${FROSTED} ${CORNER} border-1 border-[var(--m-line)] shadow-md shadow-(color:--m-shadow)/20 text-[color:var(--m-ink)]`;

/**
 * The photo full width, and low on it a frosted box with the kicker and the
 * date.
 */
export function Variant({ values, basics, language }: VariantProps) {
  const kicker = text(values, "kicker");
  /* The event's own date, in the invitation's language. */
  const date = longDate(basics.date, language);

  return (
    <CoverPhoto
      photo={imageSrc(text(values, "photo"))}
      className="items-end justify-center"
    >
      <div
        className={`${BOX} relative mx-6 mb-14 flex flex-col items-center gap-3 px-6 py-5 text-center @3xl:px-9`}
      >
        {kicker ? (
          <p className="text-[10px] leading-[1.5] tracking-[0.14em] uppercase">
            {kicker}
          </p>
        ) : null}
        <p className={`${HEADING} text-[18px] leading-[1.4] tracking-[0.1em]`}>
          {date}
        </p>
      </div>
    </CoverPhoto>
  );
}
