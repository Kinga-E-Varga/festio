import { list, text } from "@/modular/content";
import { Icon } from "@/modular/icons";
import { IconHeading } from "@/modular/IconHeading";
import { SectionHeading } from "@/modular/SectionHeading";
import {
  ARROW_NUDGE,
  GROUND,
  PAD,
  SPLIT,
  UNDERLINE_LINK,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { otherGround } from "@/modular/ground";
import { FaqList } from "./FaqList";

/**
 * Split with a question mark on its soft disc over the heading, in place of
 * the eyebrow, no italic second line, and each question a bar of its own
 * on the other surface.
 */
export function Variant({ values, ground }: VariantProps) {
  const linkLabel = text(values, "linkLabel");

  return (
    <div className={`${SPLIT} ${GROUND[ground]} ${PAD}`}>
      <IconHeading icon="question" values={values}>
        <div className="flex flex-col items-center gap-2 @3xl:items-start">
          <SectionHeading values={values} align="start" />
          {linkLabel ? (
            <a href="#rsvp" className={UNDERLINE_LINK}>
              {linkLabel}
              <Icon name="arrow-up-right" className={ARROW_NUDGE} />
            </a>
          ) : null}
        </div>
      </IconHeading>
      <FaqList items={list(values, "items")} box={otherGround(ground)} />
    </div>
  );
}
