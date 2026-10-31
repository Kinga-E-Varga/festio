import { list } from "@/modular/content";
import { fullCardCell, FullCard, fullCardGrid } from "@/modular/FullCard";
import { BODY, H3_ITEM, INNER_EYEBROW, MUTED } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { ItemIcon } from "@/modular/cards/CardIcon";

/**
 * The ways of arriving as a full card (`FullCard`): the heading centred,
 * the ways under it between the card's lines, side by side
 * (`fullCardGrid`), hairlines between. Each way centred, as a Cards (`1`) card's
 * content: its icon, when it has one, on a soft disc over its eyebrow, every disc in the secondary — then its title and note. Full card (`8`); with
 * `accent`, the card on the accent, no lines, every disc in the palette's
 * secondary (`ItemIcon`'s `accent`): Full card accent (`10`).
 */
export function FullCardWays({
  values,
  ground,
  accent = false,
}: VariantProps & { accent?: boolean }) {
  const ways = list(values, "ways").slice(0, 6);
  if (ways.length === 0) return null;

  return (
    <FullCard values={values} ground={ground} accent={accent}>
      <ul className={fullCardGrid(ways.length, accent)}>
        {ways.map((way, index) => (
          <li key={index} className={fullCardCell(accent)}>
            <ItemIcon name={way.icon} accent={accent} className="mb-5" />
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
