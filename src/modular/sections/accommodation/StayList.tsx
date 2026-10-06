import { safeLink } from "@/modular/content";
import { Icon } from "@/modular/icons";
import { ARROW_NUDGE, BODY_SM, H4, MUTED } from "@/modular/styles";
import type { ListItem } from "@/types/modular";

/* The rows' lines, in the palette's line colour. */
const RULE = "border-[var(--m-line)]";

const ROW =
  "grid grid-cols-[1fr_1rem] items-center gap-3 py-4 @3xl:grid-cols-[1fr_auto_1rem]";

/** The stays, one row each between lines. Shared by Stays and Simple. */
export function StayList({
  places,
  nameClass = H4,
}: {
  places: ListItem[];
  /** The stay's name; Stays' small serif unless a variant says otherwise. */
  nameClass?: string;
}) {
  if (places.length === 0) return null;
  return (
    <ol className={`border-t-1 ${RULE}`}>
      {places.map((place, index) => {
        const link = safeLink(place.link);
        return (
          <li key={index} className={`border-b-1 ${RULE}`}>
            {link ? (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className={`group/link ${ROW}`}
              >
                <Stay place={place} nameClass={nameClass} />
                <Icon name="arrow-up-right" className={ARROW_NUDGE} />
              </a>
            ) : (
              <div className={ROW}>
                <Stay place={place} nameClass={nameClass} />
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/** A stay's name, note and side note — the cells before the arrow. */
function Stay({ place, nameClass }: { place: ListItem; nameClass: string }) {
  const sub = [place.note, place.distance].filter(Boolean).join(" · ");
  return (
    <>
      <span className="flex min-w-0 flex-col gap-1">
        <span className={nameClass}>{place.name}</span>
        {sub ? (
          <small className={`${BODY_SM} ${MUTED} @3xl:hidden`}>{sub}</small>
        ) : null}
        {place.note ? (
          <small className={`${BODY_SM} hidden ${MUTED} @3xl:block`}>
            {place.note}
          </small>
        ) : null}
      </span>
      <span className={`${BODY_SM} hidden text-right ${MUTED} @3xl:block`}>
        {place.distance}
      </span>
    </>
  );
}
