import { useTranslations } from "next-intl";
import { longDate } from "@/modular/content";
import { Icon } from "@/modular/icons";
import { headerMark, Mark } from "@/modular/Mark";
import {
  AMPERSAND_SIZE,
  H4,
  HEADING,
  MUTED_LINK,
  SECTION_GROUND,
  TONE_TEXT,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { FOOTER } from "./styles";

/* The mark at 34px on every page width, in the headings' face. */
const MARK = `${HEADING} text-[34px] leading-[1.15] tracking-[-0.03em]`;

/* Each style's colours for the mark, its middle and the date; empty: the ground's ink. */
const INKS = {
  plain: { mark: "", middle: "", date: "" },
  colourful: {
    mark: TONE_TEXT.accent,
    middle: TONE_TEXT.secondary,
    date: TONE_TEXT.secondary,
  },
  colourfulAccent: {
    mark: TONE_TEXT.accent,
    middle: TONE_TEXT.secondary,
    date: TONE_TEXT.accent,
  },
  balanced: {
    mark: "",
    middle: TONE_TEXT.secondary,
    date: TONE_TEXT.secondary,
  },
  balancedAccent: {
    mark: "",
    middle: TONE_TEXT.accent,
    date: TONE_TEXT.accent,
  },
};

/**
 * The page closes on its ground, centred: the mark, its middle a step
 * smaller, the date under it, then the way back up. Every style the same
 * but for its colours (`INKS`): `plain`, all in the ground's ink, Accent
 * (`2`) on the accent and Simple (`3`) on the page's surface; `colourful`
 * (`1`), the mark in the accent, its middle and the date in the secondary;
 * `colourfulAccent` (`6`), the date in the accent; `balanced` (`5`), the
 * mark in the ink, its middle and the date in the secondary;
 * `balancedAccent` (`4`), those two in the accent. The "accent" styles put
 * the accent where their twin has the secondary, as the header's do.
 */
export function BandFooter({
  basics,
  language,
  related,
  ground,
  inks = "plain",
}: Pick<VariantProps, "basics" | "language" | "related" | "ground"> & {
  inks?: keyof typeof INKS;
}) {
  const t = useTranslations("Sections");
  const ink = INKS[inks];
  const mark = headerMark(
    related.header ?? {},
    `${AMPERSAND_SIZE} ${ink.middle}`,
  );

  return (
    <div className={`${SECTION_GROUND[ground]} ${FOOTER}`}>
      {mark.length > 0 ? (
        <p className={`${MARK} mb-4 ${ink.mark}`}>
          <Mark parts={mark} />
        </p>
      ) : null}
      <p className={`${H4} ${ink.date}`}>{longDate(basics.date, language)}</p>
      <a href="#cover" className={`${MUTED_LINK} mt-3`}>
        {t("backToTop")}
        <Icon name="arrow-up" className="size-3" />
      </a>
    </div>
  );
}
