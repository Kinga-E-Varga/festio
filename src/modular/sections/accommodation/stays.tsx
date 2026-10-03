import { list, safeLink } from "@/modular/content";
import { Icon } from "@/modular/icons";
import { SectionHeading } from "@/modular/SectionHeading";
import {
  ARROW_NUDGE,
  BODY_SM,
  GROUND,
  H4,
  MUTED,
  PAD,
  SPLIT,
} from "@/modular/styles";
import type { ListItem, VariantProps } from "@/types/modular";

/* The rows' lines, in the palette's line colour. */
const RULE = "border-[var(--m-line)]";

const ROW =
  "grid grid-cols-[1fr_1rem] items-center gap-3 py-4 @3xl:grid-cols-[1fr_auto_1rem]";

/**
 * The mid band: heading left, the stays right. A stay with a safe
 * web address is a link with an arrow; one without is plain. On a phone
 * the side note moves under the name.
 */
export function Variant({ values, ground }: VariantProps) {
  const places = list(values, "places");

  return (
    <div
      className={`${SPLIT} items-start ${GROUND[ground]} text-[color:var(--m-ink)] ${PAD}`}
    >
      <div>
        <SectionHeading values={values} align="start" />
      </div>
      {places.length > 0 ? (
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
                    <Stay place={place} />
                    <Icon name="arrow-up-right" className={ARROW_NUDGE} />
                  </a>
                ) : (
                  <div className={ROW}>
                    <Stay place={place} />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      ) : null}
    </div>
  );
}

/** A stay's name, note and side note — the cells before the arrow. */
function Stay({ place }: { place: ListItem }) {
  const sub = [place.note, place.distance].filter(Boolean).join(" · ");
  return (
    <>
      <span className="flex min-w-0 flex-col gap-1">
        <span className={H4}>{place.name}</span>
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
