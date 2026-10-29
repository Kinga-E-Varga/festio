import { useTranslations } from "next-intl";
import { longDate } from "@/modular/content";
import { Icon } from "@/modular/icons";
import { Mark, markParts } from "@/modular/Mark";
import { H4, HEADING, MUTED_LINK, SECTION_GROUND } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { FOOTER } from "./styles";

/* The middle of the mark in the ground's own ink, a step smaller. */
const MIDDLE = "text-[0.8em]";

/* The mark at 34px on every page width, in the headings' face. */
const MARK = `${HEADING} text-[34px] leading-[1.15] tracking-[-0.03em]`;

/**
 * The page closes on its ground, all in the ground's ink, centred: the
 * mark, the date under it, then the way back up. Accent (`2`) on the
 * accent; Plain (`3`) on the page's surface.
 */
export function BandFooter({
  basics,
  language,
  related,
  ground,
}: Pick<VariantProps, "basics" | "language" | "related" | "ground">) {
  const t = useTranslations("Sections");
  const mark = markParts(related.header ?? {}, "mark", MIDDLE);

  return (
    <div className={`${SECTION_GROUND[ground]} ${FOOTER}`}>
      {mark.length > 0 ? (
        <p className={`${MARK} mb-4`}>
          <Mark parts={mark} />
        </p>
      ) : null}
      <p className={H4}>{longDate(basics.date, language)}</p>
      <a href="#cover" className={`${MUTED_LINK} mt-3`}>
        {t("backToTop")}
        <Icon name="arrow-up" className="size-3" />
      </a>
    </div>
  );
}
