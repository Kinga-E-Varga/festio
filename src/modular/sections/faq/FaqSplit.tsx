import { list, text } from "@/modular/content";
import { otherGround } from "@/modular/ground";
import { Icon } from "@/modular/icons";
import { IconHeading } from "@/modular/IconHeading";
import { SectionHeading } from "@/modular/SectionHeading";
import {
  ARROW_NUDGE,
  INK_LINK,
  PAD,
  SPLIT,
  SECTION_GROUND,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { FaqList } from "./FaqList";

/**
 * The heading and the link to the reply form beside the questions, for
 * the two-line and icon styles. `icon`: a question mark on its soft disc
 * over the heading, in place of the eyebrow and the italic line. `bars`:
 * each question a bar of its own on the other surface, not a row between
 * hairlines. Every answer starts closed; native `<details>`, no script.
 */
export function FaqSplit({
  values,
  ground,
  icon = false,
  bars = false,
}: Pick<VariantProps, "values" | "ground"> & {
  icon?: boolean;
  bars?: boolean;
}) {
  const linkLabel = text(values, "linkLabel");
  const heading = (
    <div className="flex flex-col items-center gap-2 @3xl:items-start">
      <SectionHeading values={values} align="start" />
      {linkLabel ? (
        <a href="#rsvp" className={INK_LINK}>
          {linkLabel}
          <Icon name="arrow-up-right" className={ARROW_NUDGE} />
        </a>
      ) : null}
    </div>
  );

  return (
    <div className={`${SPLIT} ${SECTION_GROUND[ground]} ${PAD}`}>
      {icon ? (
        <IconHeading icon="question" values={values}>
          {heading}
        </IconHeading>
      ) : (
        heading
      )}
      <FaqList
        items={list(values, "items")}
        box={bars ? otherGround(ground) : undefined}
      />
    </div>
  );
}
