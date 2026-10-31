import type { ReactNode } from "react";
import { FullCard } from "@/modular/FullCard";
import type { IconName } from "@/modular/icons";
import { SectionHeading } from "@/modular/SectionHeading";
import {
  BODY,
  COLUMN,
  H3_ITEM,
  INNER_EYEBROW,
  MUTED,
  PAD,
  SECTION_GROUND,
  STACK,
  UNLINED_PULL,
} from "@/modular/styles";
import type { SectionGround, SectionValues } from "@/types/modular";
import { CardIcon, ItemIcon } from "./CardIcon";

/**
 * Dress code's and Gifts' note under the section's heading (`values`),
 * centred: its icon, when it has one, on a soft disc in the accent (as the
 * full cards' items), its label, 16px over the title, the text and, 16px
 * under them, what the section adds (the colours, the gift buttons). In one
 * card, the note between its lines (`FullCard`): Full card (`4`); with
 * `accent`, the card on the accent and the icon on the palette's secondary
 * disc (`ItemIcon`'s `accent`), Full card accent (`5`). With `band` (Accent,
 * `6`, on the accent band): no card, the heading straight over the note,
 * `STACK`'s gap under it, as in any section, as wide as the card's content.
 */
export function FullCardNote({
  values,
  ground,
  icon,
  label = "",
  title,
  body,
  children,
  accent = false,
  band = false,
}: {
  values: SectionValues;
  ground: SectionGround;
  icon?: IconName;
  /** The card's own label, smaller than the heading's intro line. */
  label?: string;
  title: string;
  body: string;
  children?: ReactNode;
  accent?: boolean;
  band?: boolean;
}) {
  const note = (
    <div
      className={`flex flex-col items-center text-center ${band ? `${COLUMN} @3xl:px-12` : `${accent ? UNLINED_PULL : ""} py-8 @3xl:py-10`}`}
    >
      {accent ? (
        <ItemIcon name={icon} accent className="mb-5" />
      ) : icon ? (
        <CardIcon name={icon} tone="accent" className="mb-5" />
      ) : null}
      {label ? (
        <p className={`${INNER_EYEBROW} mb-4 text-[color:var(--m-secondary)]`}>
          {label}
        </p>
      ) : null}
      {title ? <h3 className={`${H3_ITEM} mb-1`}>{title}</h3> : null}
      {body ? (
        <p className={`${BODY} ${MUTED} whitespace-pre-line`}>{body}</p>
      ) : null}
      {children ? (
        <div
          className={`flex flex-col items-center ${title || body ? "mt-4" : ""}`}
        >
          {children}
        </div>
      ) : null}
    </div>
  );

  return band ? (
    <div className={`${STACK} ${SECTION_GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} />
      {note}
    </div>
  ) : (
    <FullCard values={values} ground={ground} accent={accent}>
      {note}
    </FullCard>
  );
}
