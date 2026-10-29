import { TurnIcon } from "@/modular/cards/CardIcon";
import { list } from "@/modular/content";
import { SectionHeading } from "@/modular/SectionHeading";
import {
  BODY_SM,
  INNER_EYEBROW,
  ITEM_TITLE,
  MUTED,
  PAD,
  SPLIT,
  SECTION_GROUND,
  otherCard,
  CARD_STACK,
} from "@/modular/styles";
import type { SectionGround, SectionValues } from "@/types/modular";

/**
 * The two-line heading beside the ways of arriving, spaced as Schedule's
 * Two-line & list spaces a day: each way's eyebrow where the date goes, its
 * title and note as an event, its icon, when it has one, on a soft disc at
 * the row's end, centred on it, the discs taking turns accent / secondary.
 * No numbers. Between hairlines (Two-line & list, `3`), or with `cards`
 * each way a card on the other surface, stacked as Schedule's Two-line &
 * cards' days (Two-line & cards, `5`).
 */
export function TwoLineWays({
  values,
  ground,
  cards = false,
}: {
  values: SectionValues;
  ground: SectionGround;
  cards?: boolean;
}) {
  const ways = list(values, "ways").slice(0, 6);

  return (
    <div className={`${SPLIT} ${SECTION_GROUND[ground]} ${PAD}`}>
      <div>
        <SectionHeading values={values} align="start" />
      </div>
      {ways.length > 0 ? (
        <ul
          className={cards ? CARD_STACK : "border-t-1 border-[var(--m-line)]"}
        >
          {ways.map((way, index) => (
            <li
              key={index}
              className={
                cards
                  ? otherCard(ground)
                  : "border-b-1 border-[var(--m-line)] pt-4 pb-3"
              }
            >
              {way.label ? (
                <p
                  className={`${INNER_EYEBROW} mb-1 text-[color:var(--m-secondary)]`}
                >
                  {way.label}
                </p>
              ) : null}
              <div className="grid grid-cols-[minmax(0,1fr)_2.375rem] items-start gap-6 py-3">
                <div className="min-w-0">
                  {way.title ? (
                    <h3 className={ITEM_TITLE}>{way.title}</h3>
                  ) : null}
                  {way.text ? (
                    <p
                      className={`${BODY_SM} ${MUTED} mt-1 whitespace-pre-line`}
                    >
                      {way.text}
                    </p>
                  ) : null}
                </div>
                <TurnIcon
                  name={way.icon}
                  index={index}
                  className="self-center"
                />
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
