import { list, text } from "@/modular/content";
import { Icon } from "@/modular/icons";
import { SectionHeading } from "@/modular/SectionHeading";
import {
  ARROW_NUDGE,
  GROUND,
  PAD,
  SPLIT,
  UNDERLINE_LINK,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { FaqList } from "./FaqList";

/**
 * The heading and a link to the reply form beside the questions. Every
 * answer starts closed. Native `<details>`, so it needs no script.
 */
export function Variant({ values, ground }: VariantProps) {
  const linkLabel = text(values, "linkLabel");
  const items = list(values, "items");

  return (
    <div className={`${SPLIT} ${GROUND[ground]} ${PAD}`}>
      <div className="flex flex-col items-center gap-2 @3xl:items-start">
        <SectionHeading values={values} align="start" />
        {linkLabel ? (
          <a href="#rsvp" className={UNDERLINE_LINK}>
            {linkLabel}
            <Icon name="arrow-up-right" className={ARROW_NUDGE} />
          </a>
        ) : null}
      </div>
      <FaqList items={items} />
    </div>
  );
}
