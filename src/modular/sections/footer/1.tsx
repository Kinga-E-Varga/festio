import { useTranslations } from "next-intl";
import { longDate } from "@/modular/content";
import { Icon } from "@/modular/icons";
import { Mark, markParts } from "@/modular/Mark";
import { DISPLAY, EYEBROW, MUTED_LINK } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { FOOTER } from "./styles";

/** The mark again, the date, and the way back up. */
export function Variant({ basics, language, related }: VariantProps) {
  const t = useTranslations("Sections");
  const mark = markParts(related.header ?? {}, "mark");

  return (
    <div className={FOOTER}>
      {mark.length > 0 ? (
        <p className={`${DISPLAY} mb-3.5 text-[24px]`}>
          <Mark parts={mark} />
        </p>
      ) : null}
      <p className={`${EYEBROW} text-[color:var(--m-secondary)]`}>
        {longDate(basics.date, language)}
      </p>
      <a href="#cover" className={`${MUTED_LINK} mt-3`}>
        {t("backToTop")}
        <Icon name="arrow-up" className="size-3" />
      </a>
    </div>
  );
}
