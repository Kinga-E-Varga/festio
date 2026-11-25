import { ItemIcon } from "@/modular/cards/CardIcon";
import { iconMode, itemMark } from "@/modular/item-marks";
import { Rows } from "@/modular/cards/Rows";
import { list } from "@/modular/content";
import { SectionHeading } from "@/modular/SectionHeading";
import {
  BODY_SM,
  DISC_ROW,
  INNER_EYEBROW,
  ITEM_TITLE,
  MUTED,
  PAD,
  SPLIT,
  SECTION_GROUND,
  turnTone,
} from "@/modular/styles";
import type { SectionGround, SectionValues } from "@/types/modular";

/**
 * The two-line heading beside the ways of arriving, spaced as Schedule's
 * Two-line & list spaces a day: each way's eyebrow where the date goes, its
 * title and note as an event, its icon, when it has one, on a soft disc at
 * the row's end, centred on it, every disc in the secondary.
 * No numbers. Between hairlines: Two-line & list (`3`).
 */
export function TwoLineWays({
  values,
  ground,
}: {
  values: SectionValues;
  ground: SectionGround;
}) {
  const ways = list(values, "ways").slice(0, 6);
  const mode = iconMode(values);

  return (
    <div className={`${SPLIT} ${SECTION_GROUND[ground]} ${PAD}`}>
      <div>
        <SectionHeading values={values} align="start" />
      </div>
      <Rows items={ways}>
        {(way, index) => (
          <>
            {way.label ? (
              <p
                className={`${INNER_EYEBROW} mb-1 text-[color:var(--m-secondary)]`}
              >
                {way.label}
              </p>
            ) : null}
            <div className={`${DISC_ROW} items-start py-3`}>
              <div className="min-w-0">
                {way.title ? <h3 className={ITEM_TITLE}>{way.title}</h3> : null}
                {way.text ? (
                  <p className={`${BODY_SM} ${MUTED} mt-1 whitespace-pre-line`}>
                    {way.text}
                  </p>
                ) : null}
              </div>
              <ItemIcon
                mark={itemMark(mode, way.icon, index)}
                tone={turnTone(index, "secondary")}
                className="self-center"
              />
            </div>
          </>
        )}
      </Rows>
    </div>
  );
}
