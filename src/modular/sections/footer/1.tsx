import { longDate, text } from "@/modular/content";
import { Icon } from "@/modular/icons";
import { Mark, markParts } from "@/modular/Mark";
import { DISPLAY, EYEBROW, MUTED_LINK } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/** The mark again, the date, and the way back up. */
export function Variant({ values, basics, language, related }: VariantProps) {
  const back = text(values, "backLabel");
  const mark = markParts(related.header ?? {}, "mark");

  return (
    <div className="flex flex-col items-center justify-center bg-[var(--m-surface)] px-6 pt-11 pb-6 text-center @3xl:pt-12 @3xl:pb-7">
      {mark.length > 0 ? (
        <p className={`${DISPLAY} mb-3.5 text-[28px]`}>
          <Mark parts={mark} />
        </p>
      ) : null}
      <p className={`${EYEBROW} text-[color:var(--m-secondary)]`}>
        {longDate(basics.date, language)}
      </p>
      {back ? (
        <a href="#cover" className={`${MUTED_LINK} mt-3`}>
          {back}
          <Icon name="arrow-up" className="size-3" />
        </a>
      ) : null}
    </div>
  );
}
