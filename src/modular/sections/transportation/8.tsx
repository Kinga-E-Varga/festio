import { list } from "@/modular/content";
import { FullCard } from "@/modular/FullCard";
import { BODY, H3_ITEM, INNER_EYEBROW, MUTED } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { TurnIcon } from "@/modular/cards/CardIcon";

/**
 * The ways of arriving as a full card (`FullCard`): the heading centred,
 * the ways under it between the card's lines, one under another, a line
 * across the card between each. Each way centred, as a Cards (`1`) card's
 * content: its icon, when it has one, on a soft disc over its eyebrow, the
 * discs taking turns — the 1st, 3rd… in the accent, the 2nd, 4th… in the
 * secondary — then its title and note.
 */
export function Variant({ values, ground }: VariantProps) {
  const ways = list(values, "ways").slice(0, 6);
  if (ways.length === 0) return null;

  return (
    <FullCard values={values} ground={ground}>
      <ul className="divide-y-1 divide-[var(--m-line)]">
        {ways.map((way, index) => (
          <li
            key={index}
            className="flex flex-col items-center py-8 text-center @3xl:py-10"
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
    </FullCard>
  );
}
