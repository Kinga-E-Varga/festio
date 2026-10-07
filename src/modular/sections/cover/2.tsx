import { CoverPhoto } from "@/modular/CoverPhoto";
import { imageSrc, longDate, text } from "@/modular/content";
import { PILL, SERIF_BOLDEST } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/**
 * The photo full width: the kicker in a small
 * tertiary circle top right, in the heading face; the date bottom left in a
 * pill of the second surface, in the muted ink.
 */
export function Variant({ values, basics, language }: VariantProps) {
  const kicker = text(values, "kicker");
  /* The event's own date, in the invitation's language. */
  const date = longDate(basics.date, language);

  return (
    <CoverPhoto
      photo={imageSrc(text(values, "photo"))}
      className="flex-col items-end justify-between p-4 @3xl:p-10"
    >
      {kicker ? (
        <div className="relative grid size-[110px] rotate-12 @3xl:size-[136px] place-items-center motion-safe:animate-bob rounded-full bg-[var(--m-tertiary)] shadow-md shadow-(color:--m-shadow)/20 px-3 text-center text-[color:var(--m-tertiary-ink)]">
          <p
            className={`${SERIF_BOLDEST} text-[color:var(--m-tertiary-ink-muted)] text-[14px] leading-[1.25] text-balance @3xl:text-[17px]`}
          >
            {kicker}
          </p>
        </div>
      ) : (
        <span />
      )}
      <p
        className={`relative self-start ${PILL} bg-[var(--m-surface)] shadow-md shadow-(color:--m-shadow)/30 px-4 py-2 text-[13px] leading-[1.3] font-semibold tracking-[0.1em] uppercase text-balance text-[color:var(--m-ink-muted)] @3xl:px-8 @3xl:py-4 @3xl:text-[16px]`}
      >
        {date}
      </p>
    </CoverPhoto>
  );
}
