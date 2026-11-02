import { list } from "@/modular/content";
import { SectionHeading } from "@/modular/SectionHeading";
import {
  BODY,
  CARD,
  COLUMN,
  INNER_EYEBROW,
  GROUND,
  H3_ITEM,
  MUTED,
  PAD,
  STACK,
  centredWhenStacked,
  cardColumns,
  SECTION_GROUND,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { otherGround } from "@/modular/ground";
import { ItemIcon } from "@/modular/cards/CardIcon";
import { iconMode, itemMark } from "@/modular/item-marks";

/**
 * One card per way of arriving: its icon, when it has one, on a soft disc
 * over its eyebrow, every disc in the secondary — then its title and note. Cards (`1`);
 * with `accent`, the cards on the accent, every disc in the palette's
 * secondary (`ItemIcon`'s `accent`): Cards accent (`9`).
 */
export function WayCards({
  values,
  ground,
  accent = false,
}: VariantProps & { accent?: boolean }) {
  const ways = list(values, "ways").slice(0, 6);
  const mode = iconMode(values);

  return (
    <div className={`${STACK} ${SECTION_GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} />
      {ways.length > 0 ? (
        <ul className={`grid gap-3 @3xl:gap-4 ${cardColumns(ways.length)}`}>
          {ways.map((way, index) => (
            <li
              key={index}
              className={`${CARD} flex flex-col ${centredWhenStacked(ways.length)} ${COLUMN} ${GROUND[accent ? "accent" : otherGround(ground)]}`}
            >
              <ItemIcon
                mark={itemMark(mode, way.icon, index)}
                accent={accent}
                className="mb-5"
              />
              {way.label ? (
                <span
                  className={`${INNER_EYEBROW} text-[color:var(--m-secondary)]`}
                >
                  {way.label}
                </span>
              ) : null}
              {way.title ? (
                <h3 className={`${H3_ITEM} mt-4 mb-1`}>{way.title}</h3>
              ) : null}
              {way.text ? (
                <p className={`${BODY} ${MUTED} whitespace-pre-line`}>
                  {way.text}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
