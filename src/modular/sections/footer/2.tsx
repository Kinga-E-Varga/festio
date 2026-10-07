import { useTranslations } from "next-intl";
import { longDate } from "@/modular/content";
import { Icon } from "@/modular/icons";
import { Mark, markParts } from "@/modular/Mark";
import { EYEBROW, GROUND, HEADING, LINK } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/* The middle of the mark, on the accent: its own ink, a step smaller. */
const MIDDLE = "text-[0.8em]";

/* The mark at 32px on every page width, in the headings' face. */
const MARK = `${HEADING} text-[32px] leading-[1.15] tracking-[-0.03em]`;

/*
 * The same space above the mark and under the date. The way back up gets no
 * padding of its own: the link's 44px tap height is its only room.
 */
const SPACE = "py-11 @3xl:py-12";

/**
 * The page closes on the accent, in its ink, all centred: the mark, the
 * date under it, then a hairline and the way back up.
 */
export function Variant({ basics, language, related, ground }: VariantProps) {
  const t = useTranslations("Sections");
  const mark = markParts(related.header ?? {}, "mark", MIDDLE);

  return (
    <div className={`${GROUND[ground]} text-center px-6`}>
      <div className={SPACE}>
        {mark.length > 0 ? (
          <p className={`${MARK} mb-4`}>
            <Mark parts={mark} />
          </p>
        ) : null}
        <p className={EYEBROW}>{longDate(basics.date, language)}</p>
      </div>
      <div className="border-t-1 border-[var(--m-ink)]/25">
        <a
          href="#cover"
          className={`${LINK} transition-opacity hover:opacity-80`}
        >
          {t("backToTop")}
          <Icon
            name="arrow-up"
            className="size-3.5 transition-transform group-hover/link:-translate-y-0.5"
          />
        </a>
      </div>
    </div>
  );
}
