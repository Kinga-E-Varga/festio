import { safeLink } from "@/modular/content";
import { Icon } from "@/modular/icons";
import {
  ARROW_NUDGE,
  BODY_SM,
  CARD,
  GROUND,
  H3_ITEM,
  H4,
  CARD_DISC,
  INNER_EYEBROW,
  MUTED,
  TIME_COLUMN,
  TONE_TEXT,
  TONES,
  turnTone,
  CARD_STACK,
  DISC_ROW,
} from "@/modular/styles";
import type { ListItem, SectionGround } from "@/types/modular";

/* The rows' lines, in the palette's line colour. */
const RULE = "border-[var(--m-line)]";

/*
 * A numbered row: the number's column first, as wide as a list's times;
 * 8px clear of the right edge, so the arrow sits a little in from it.
 */
const NUMBERED_ROW =
  "grid grid-cols-[auto_1fr_1.125rem] items-center gap-3 pr-2";

/* Larger than a text link's arrow: it stands alone at the row's end. */
const ARROW = (
  <Icon name="arrow-up-right" className={`${ARROW_NUDGE} size-4.5!`} />
);

/* The arrow's disc: on hover, its ground and arrow swap colours. */
const DISC = {
  accent: `${TONES.accent} group-hover/link:bg-[var(--m-accent)] group-hover/link:text-[color:var(--m-accent-soft)]`,
  secondary: `${TONES.secondary} group-hover/link:bg-[var(--m-secondary)] group-hover/link:text-[color:var(--m-secondary-soft)]`,
};

/**
 * The stays, one row each between lines — or, with `cards`, each row a card
 * on that surface, the cards stacked. With `numbered`, each stay's number
 * (01, 02…) first, large, taking turns accent / secondary, as
 * Transportation's Icon & list (`TIME_COLUMN`); without, the arrow on a
 * soft disc as Transportation's Two-line & list's icons, taking turns
 * accent / secondary, its colours swapping on hover. Spaced as
 * Transportation's lists and cards: 16px from the eyebrow to the name,
 * 4px to the note. Shared by every style.
 */
export function StayList({
  places,
  nameClass = H4,
  cards,
  numbered = false,
}: {
  places: ListItem[];
  /** The stay's name; Stays' small serif unless a variant says otherwise. */
  nameClass?: string;
  /** The cards' surface; without it, the rows between lines. */
  cards?: SectionGround;
  numbered?: boolean;
}) {
  if (places.length === 0) return null;
  return (
    <ol className={cards ? CARD_STACK : `border-t-1 ${RULE}`}>
      {places.map((place, index) => {
        const link = safeLink(place.link);
        // Padded as a schedule's event: 12px under, and over the name when
        // there is no eyebrow (an eyebrow takes the place of a date).
        const row = `${numbered ? NUMBERED_ROW : `${DISC_ROW} items-center`} pb-3 ${place.distance ? "" : "pt-3"}`;
        const number = numbered ? (
          <span className={`${TIME_COLUMN} ${TONE_TEXT[turnTone(index)]}`}>
            {String(index + 1).padStart(2, "0")}
          </span>
        ) : null;
        return (
          <li
            key={index}
            className={
              cards
                ? `${CARD} ${GROUND[cards]}`
                : `border-b-1 ${RULE} pt-4 pb-3`
            }
          >
            {link ? (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className={`group/link ${row}`}
              >
                {number}
                <Stay place={place} nameClass={nameClass} />
                {numbered ? (
                  ARROW
                ) : (
                  <span
                    className={`${CARD_DISC} transition-colors ${DISC[turnTone(index)]}`}
                  >
                    <Icon name="arrow-up-right" className="size-4.5" />
                  </span>
                )}
              </a>
            ) : (
              <div className={row}>
                {number}
                <Stay place={place} nameClass={nameClass} />
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/** A stay's eyebrow (its `distance`), name and note — the cell before the arrow. */
function Stay({ place, nameClass }: { place: ListItem; nameClass: string }) {
  return (
    <span className="flex min-w-0 flex-col gap-1">
      {place.distance ? (
        <span
          className={`${INNER_EYEBROW} mb-3 text-[color:var(--m-secondary)]`}
        >
          {place.distance}
        </span>
      ) : null}
      <span className={nameClass}>{place.name}</span>
      {place.note ? (
        <small className={`${BODY_SM} ${MUTED}`}>{place.note}</small>
      ) : null}
    </span>
  );
}

/**
 * A stay's cell: `children` (its icon, if any), then its lines. A stay
 * with a safe web address is a link, the whole cell, the arrow after its
 * name; otherwise a plain box. Grid (`5`), Cards (`6`) and Full card &
 * list (`7`).
 */
export function StayCell({
  place,
  className,
  children,
}: {
  place: ListItem;
  className: string;
  children?: React.ReactNode;
}) {
  const link = safeLink(place.link);
  return link ? (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`group/link ${className}`}
    >
      {children}
      <StayLines place={place} arrow />
    </a>
  ) : (
    <div className={className}>
      {children}
      <StayLines place={place} />
    </div>
  );
}

/**
 * A stay's eyebrow (its `distance`), name and note, as a way's on its
 * card; with `arrow`, the link's arrow after the name.
 */
function StayLines({
  place,
  arrow = false,
}: {
  place: ListItem;
  arrow?: boolean;
}) {
  return (
    <>
      {place.distance ? (
        <span className={`${INNER_EYEBROW} text-[color:var(--m-secondary)]`}>
          {place.distance}
        </span>
      ) : null}
      {place.name ? (
        <span className={`${H3_ITEM} ${place.distance ? "mt-4" : ""} mb-1`}>
          {place.name}
          {arrow ? (
            <span className="ml-2 inline-block align-middle">{ARROW}</span>
          ) : null}
        </span>
      ) : null}
      {place.note ? (
        <small className={`${BODY_SM} ${MUTED}`}>{place.note}</small>
      ) : null}
    </>
  );
}
