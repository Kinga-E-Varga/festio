import { list } from "@/modular/content";
import { IconHeading } from "@/modular/IconHeading";
import {
  BODY_SM,
  CARD,
  GROUND,
  ITEM_TITLE,
  MUTED,
  PAD,
  SPLIT,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { otherGround } from "@/modular/ground";

/**
 * A bus on its soft disc over the heading — no eyebrow — beside the ways
 * of arriving, stacked, each a card on the other surface with its title and text.
 * No label over a way.
 */
export function Variant({ values, ground }: VariantProps) {
  const ways = list(values, "ways").slice(0, 4);

  return (
    <div className={`${SPLIT} ${GROUND[ground]} ${PAD}`}>
      <IconHeading icon="bus" values={values} />
      {ways.length > 0 ? (
        <ul className="flex flex-col gap-3 @3xl:gap-4">
          {ways.map((way, index) => (
            <li
              key={index}
              className={`${CARD} ${GROUND[otherGround(ground)]}`}
            >
              {way.title ? <h3 className={ITEM_TITLE}>{way.title}</h3> : null}
              {way.text ? (
                <p className={`${BODY_SM} ${MUTED} mt-1.5 whitespace-pre-line`}>
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
