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
import { TurnIcon } from "@/modular/cards/CardIcon";

/**
 * One card per way of arriving: its icon, when it has one, on a soft disc
 * over its eyebrow, the discs taking turns — the 1st, 3rd… in the accent,
 * the 2nd, 4th… in the secondary — then its title and note.
 */
export function Variant({ values, ground }: VariantProps) {
  const ways = list(values, "ways").slice(0, 6);

  return (
    <div className={`${STACK} ${SECTION_GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} />
      {ways.length > 0 ? (
        <ul className={`grid gap-3 @3xl:gap-4 ${cardColumns(ways.length)}`}>
          {ways.map((way, index) => (
            <li
              key={index}
              className={`${CARD} flex flex-col ${centredWhenStacked(ways.length)} ${COLUMN} ${GROUND[otherGround(ground)]}`}
            >
              <TurnIcon name={way.icon} index={index} className="mb-5" />
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
